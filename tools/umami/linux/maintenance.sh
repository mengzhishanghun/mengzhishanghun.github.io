#!/bin/bash
set -euo pipefail
[[ $(id -u) == 0 ]] || exit 1
umask 077
base=/srv/mzsh-umami
state="$base/state"
account=mzsh-umami
uid=$(id -u "$account")
cd /tmp
run() { sudo -u "$account" env HOME=/home/$account XDG_RUNTIME_DIR=/run/user/$uid "$@"; }
record=/var/lib/mzsh-umami-maintenance/state
if [[ -f "$record" ]] && grep -Eq '^phase=(candidate_testing|rolled_back|switching|rollback_failed|review_required)$' "$record"; then
  run "$base/bin/update.sh"
  echo 'Previous candidate requires operator review; release check only, installation blocked'
  exit 1
fi
apply=()
[[ $(TZ=Asia/Singapore date +%u) != 7 ]] || apply=(--apply)
if ! run "$base/bin/update.sh" "${apply[@]}"; then
  if [[ -f "$state/metadata-blocked" ]]; then
    blocked=$(cat "$state/metadata-blocked")
    [[ "$blocked" =~ ^ghcr.io/umami-software/umami@sha256:[0-9a-f]{64}$ ]] || exit 1
    printf 'phase=review_required\nattempted=%s\ntime=%s\n' "$blocked" "$(date -u +%Y%m%dT%H%M%SZ)" > "$record"
  fi
  exit 1
fi
[[ -f "$state/update-candidate" ]] || exit 0
# 先完成在线备份的隔离restore；候选仅接隔离PG，不升级生产库。
run "$base/bin/backup.sh"
exec 9< /run/lock/mzsh-umami/maintenance.lock
flock -n 9 || exit 1
candidate=$(cat "$state/update-candidate")
version=$(cat "$state/update-candidate-version")
[[ "$candidate" =~ ^ghcr.io/umami-software/umami@sha256:[0-9a-f]{64}$ && "$version" =~ ^v3\.4\.[0-9]+$ ]] || exit 1
old=$(cat "$base/config/image")
oldversion=$(cat "$base/config/version")
[[ "$old" =~ ^ghcr.io/umami-software/umami@sha256:[0-9a-f]{64}$ && "$oldversion" =~ ^v3\.4\.[0-9]+$ ]] || exit 1
dump=$(find "$base/backups" -maxdepth 1 -name 'umami-*.dump' -type f | sort | tail -1)
[[ -n "$dump" ]]
directory=$(mktemp -d "$base/candidate.XXXXXX")
chown root:"$account" "$directory"
chmod 750 "$directory"
mkdir "$directory/pgdata"
chown "$account:$account" "$directory/pgdata"
run podman unshare chown 999:999 "$directory/pgdata"
/opt/mzsh-node/node-v26.11.0-linux-x64/bin/node -e 'const fs=require("fs");const line=fs.readFileSync("/srv/mzsh-umami/config/umami.env","utf8").split("\n").find(x=>x.startsWith("DATABASE_URL="));if(!/^DATABASE_URL=postgresql:\/\/umami:[0-9a-f]{64}@127\.0\.0\.1:5432\/umami$/.test(line))throw Error("Invalid database target");fs.writeFileSync(process.argv[1],line.replace(":5432/",":15432/")+"\nPORT=13000\n",{mode:0o600,flag:"wx"});' "$directory/candidate.env"
chown "$account:$account" "$directory/candidate.env"
switching=0
finished=0
write_state() { printf 'phase=%s\nold=%s\nattempted=%s\ntime=%s\n' "$1" "$old" "$candidate" "$(date -u +%Y%m%dT%H%M%SZ)" > "$record"; }
wait_health() {
  local port=$1
  for attempt in {1..180}; do
    if curl --noproxy '*' --fail --silent --max-time 2 "http://127.0.0.1:$port/api/heartbeat" >/dev/null; then return 0; fi
    sleep 1
  done
  return 1
}
cleanup() {
  run podman rm -f mzsh-umami-candidate mzsh-postgres-candidate >/dev/null 2>&1 || true
  # 保留候选目录和备份用于排障；不删除旧数据。
}
finish() {
  local result=$?
  trap - EXIT
  set +e
  if [[ "$switching" == 1 && "$finished" != 1 ]]; then
    systemctl stop mzsh-umami
    printf '%s\n' "$old" > "$base/config/image"
    printf '%s\n' "$oldversion" > "$base/config/version"
    chown "$account:$account" "$base/config/image"
    chown "$account:$account" "$base/config/version"
    if systemctl start mzsh-umami && wait_health 3000 && run /opt/mzsh-node/node-v26.11.0-linux-x64/bin/node "$base/bin/verify-auth.mjs"; then
      write_state rolled_back
      echo 'Upgrade failed; verified old image restored; production database preserved'
    else
      write_state rollback_failed
      echo 'Old-image recovery failed; operator recovery required; production database preserved'
    fi
    result=1
  fi
  cleanup
  exit "$result"
}
trap finish EXIT
trap 'exit 143' TERM
trap 'exit 130' INT
write_state candidate_testing
run podman run -d --name mzsh-postgres-candidate --network host --pull never --user 999:999 --env-file "$base/config/postgres.env" -v "$directory/pgdata:/var/lib/postgresql/data" docker.io/library/postgres@sha256:66aafa11cf15800a3c94763f7e11d1e7b2e37e5e84bc4ce027cb6e1e4bfaf4df postgres -c listen_addresses=127.0.0.1 -p15432 -c shared_buffers=32MB > "$directory/postgres-container-id"
for attempt in {1..30}; do
  if run podman exec mzsh-postgres-candidate pg_isready -p15432 -Uumami -dumami -q; then break; fi
  sleep 1
done
run bash -c 'exec podman exec -i mzsh-postgres-candidate pg_restore -p15432 -Uumami -dumami --exit-on-error --no-owner < "$1"' bash "$dump"
# 候选端口通过PGPORT传入fingerprint，逐表只输出count/hash。
run env PGPORT=15432 "$base/bin/fingerprint.sh" umami mzsh-postgres-candidate > "$directory/restored-fingerprint"
cmp "$dump.restored-fingerprint" "$directory/restored-fingerprint"
run podman run -d --name mzsh-umami-candidate --network host --pull never --env-file "$base/config/umami.env" --env-file "$directory/candidate.env" "$candidate" > "$directory/umami-container-id"
wait_health 13000 || { echo 'Candidate failed heartbeat; old release retained'; exit 1; }
run /opt/mzsh-node/node-v26.11.0-linux-x64/bin/node "$base/bin/verify-auth.mjs" http://127.0.0.1:13000
cleanup
# 兼容元数据完全相同；仅切镜像，生产数据不被候选快照覆盖。
cp -a "$base/config/image" "$directory/old-image"
cp -a "$base/config/umami.env" "$directory/old-umami.env"
printf '%s\n' "$candidate" > "$base/config/image.next"
chown "$account:$account" "$base/config/image.next"
write_state switching
switching=1
systemctl stop mzsh-umami
mv "$base/config/image.next" "$base/config/image"
systemctl start mzsh-umami
wait_health 3000
run /opt/mzsh-node/node-v26.11.0-linux-x64/bin/node "$base/bin/verify-auth.mjs"
printf '%s\n' "$version" > "$base/config/version"
chown "$account:$account" "$base/config/version"
write_state successful
finished=1
echo "Verified compatible Umami patch installed: $oldversion -> $version"

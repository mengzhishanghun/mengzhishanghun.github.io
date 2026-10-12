#!/bin/bash
# 从已审核的源码目录安装；凭据必须提前放入独立私有目录。
set -euo pipefail
[[ $(id -u) == 0 ]] || exit 1
src=$(cd "$(dirname "$0")" && pwd -P)
base=/srv/mzsh-umami
account=mzsh-umami
uid=$(id -u "$account")
[[ -f "$base/config/postgres.env" && -f "$base/config/umami.env" ]]
install -d -m700 -o "$account" -g "$account" "$base/backups" "$base/pgdata" "$base/state"
chown root:"$account" "$base" "$base/config"
chmod 751 "$base"
chmod 750 "$base/config"
install -d -m755 -o root -g root "$base/bin"
install -d -m750 -o root -g "$account" /run/lock/mzsh-umami
[[ -e /run/lock/mzsh-umami/maintenance.lock ]] || install -m640 -o root -g "$account" /dev/null /run/lock/mzsh-umami/maintenance.lock
install -d -m700 -o root -g root /var/lib/mzsh-umami-maintenance
cat > /etc/tmpfiles.d/mzsh-umami.conf <<'EOF'
d /run/lock/mzsh-umami 0750 root mzsh-umami -
f /run/lock/mzsh-umami/maintenance.lock 0640 root mzsh-umami -
EOF
install -m755 "$src/backup.sh" "$src/fingerprint.sh" "$src/image-metadata.sh" "$src/update.sh" "$src/verify-auth.mjs" "$base/bin/"
install -m755 "$src/maintenance.sh" "$base/bin/maintenance.sh"
pg='docker.io/library/postgres@sha256:66aafa11cf15800a3c94763f7e11d1e7b2e37e5e84bc4ce027cb6e1e4bfaf4df'
image='ghcr.io/umami-software/umami@sha256:6cd9d24a836fac5c226c3c90cb25141d4560b7270b7827f393ccf09bf3f83b18'
printf '%s\n' "$image" > "$base/config/image"
printf 'v3.4.0\n' > "$base/config/version"
chmod 600 "$base/config"/*
find "$base/config" -maxdepth 1 -type f -exec chown "$account:$account" {} +
chown -R "$account:$account" "$base/backups"
cd /tmp
sudo -u "$account" env HOME="/home/$account" XDG_RUNTIME_DIR="/run/user/$uid" podman unshare chown 999:999 "$base/pgdata"
cat > /etc/systemd/system/mzsh-postgres.service <<EOF
[Unit]
Description=Mzsh private PostgreSQL 17 (rootless Podman)
After=network.target user-runtime-dir@$uid.service
Requires=user-runtime-dir@$uid.service
[Service]
User=$account
Group=$account
Environment=HOME=/home/$account
Environment=XDG_RUNTIME_DIR=/run/user/$uid
WorkingDirectory=$base
ExecStartPre=-/usr/bin/podman rm mzsh-postgres
ExecStart=/usr/bin/podman run --name mzsh-postgres --network host --pull never --user 999:999 --env-file $base/config/postgres.env -v $base/pgdata:/var/lib/postgresql/data $pg postgres -c listen_addresses=127.0.0.1 -c max_connections=50 -c shared_buffers=64MB
ExecStop=/usr/bin/podman stop -t 30 mzsh-postgres
Restart=on-failure
RestartSec=5
TimeoutStopSec=45
UMask=0077
[Install]
WantedBy=multi-user.target
EOF
cat > "$base/bin/serve.sh" <<'EOF'
#!/bin/bash
set -euo pipefail
image=$(cat /srv/mzsh-umami/config/image)
[[ "$image" =~ ^ghcr.io/umami-software/umami@sha256:[0-9a-f]{64}$ ]] || exit 1
exec podman run --name mzsh-umami --network host --pull never --env-file /srv/mzsh-umami/config/umami.env "$image"
EOF
chmod 755 "$base/bin/serve.sh"
chown root:root "$base/bin/serve.sh"
cat > /etc/systemd/system/mzsh-umami.service <<EOF
[Unit]
Description=Mzsh Umami (rootless Podman)
After=mzsh-postgres.service
Requires=mzsh-postgres.service
[Service]
User=$account
Group=$account
Environment=HOME=/home/$account
Environment=XDG_RUNTIME_DIR=/run/user/$uid
WorkingDirectory=$base
ExecStartPre=/usr/bin/podman exec mzsh-postgres pg_isready -U umami -d umami -q
ExecStartPre=-/usr/bin/podman rm mzsh-umami
ExecStart=$base/bin/serve.sh
ExecStop=/usr/bin/podman stop -t 20 mzsh-umami
Restart=on-failure
RestartSec=5
TimeoutStopSec=30
UMask=0077
[Install]
WantedBy=multi-user.target
EOF
cat > /etc/systemd/system/mzsh-umami-backup.service <<EOF
[Unit]
Description=Mzsh Umami online dump and isolated restore verification
After=mzsh-postgres.service
Requires=mzsh-postgres.service
[Service]
Type=oneshot
User=$account
Group=$account
Environment=HOME=/home/$account
Environment=XDG_RUNTIME_DIR=/run/user/$uid
ExecStart=$base/bin/backup.sh
UMask=0077
EOF
cat > /etc/systemd/system/mzsh-umami-backup.timer <<'EOF'
[Unit]
Description=Daily verified Umami backup
[Timer]
OnCalendar=*-*-* 03:30:00 Asia/Singapore
Persistent=true
[Install]
WantedBy=timers.target
EOF
systemctl daemon-reload
systemctl enable mzsh-postgres mzsh-umami mzsh-umami-backup.timer
# 首次迁移仅启动PG；完成恢复和一致性核验后才启动Umami。
systemctl start mzsh-postgres
cat > /etc/systemd/system/mzsh-umami-update.service <<EOF
[Unit]
Description=Check Umami 3.4.x releases and apply verified Sunday patches
After=mzsh-postgres.service
Requires=mzsh-postgres.service
[Service]
Type=oneshot
ExecStart=$base/bin/maintenance.sh
UMask=0077
TimeoutStartSec=20min
EOF
cat > /etc/systemd/system/mzsh-umami-update.timer <<'EOF'
[Unit]
Description=Daily release check; Sunday 04:30 verified patch window
[Timer]
OnCalendar=*-*-* 04:30:00 Asia/Singapore
Persistent=true
[Install]
WantedBy=timers.target
EOF
systemctl daemon-reload
systemctl enable --now mzsh-umami-backup.timer
if [[ -f "$base/config/network.env" ]]; then
  systemctl enable --now mzsh-umami-update.timer
else
  systemctl disable --now mzsh-umami-update.timer
  echo 'Release checks paused: independent outbound configuration is not yet authorized'
fi

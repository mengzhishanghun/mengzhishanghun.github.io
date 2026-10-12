#!/bin/bash
set -euo pipefail
umask 077
base=/srv/mzsh-umami
exec 9< /run/lock/mzsh-umami/maintenance.lock
flock -n 9 || { echo 'Umami maintenance already active'; exit 1; }
stamp=$(date -u +%Y%m%dT%H%M%SZ)-$$
dump="$base/backups/umami-$stamp.dump"
verify="umami_verify_$$"
cleanup() { podman exec mzsh-postgres dropdb -Uumami --if-exists "$verify" >/dev/null; }
trap cleanup EXIT
podman exec mzsh-postgres pg_dump -Uumami -dumami -Fc > "$dump"
podman exec -i mzsh-postgres pg_restore --list < "$dump" > "$dump.list"
podman exec mzsh-postgres createdb -Uumami "$verify"
podman exec -i mzsh-postgres pg_restore -Uumami -d "$verify" --exit-on-error --no-owner < "$dump"
"$base/bin/fingerprint.sh" "$verify" > "$dump.restored-fingerprint"
podman exec mzsh-postgres pg_dump -Uumami -d "$verify" --schema-only --no-owner --no-privileges > "$dump.schema"
chmod 600 "$dump"*
printf 'Umami dump and isolated restore verified: %s\n' "$stamp"

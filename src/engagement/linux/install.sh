#!/bin/bash
set -euo pipefail
[[ $(id -u) == 0 ]] || exit 1
src=$(cd "$(dirname "$0")" && pwd -P)
base=/srv/mzsh-engagement
account=mzsh-engagement
install -d -m700 -o "$account" -g "$account" "$base/app" "$base/config" "$base/data" "$base/backups"
registry=${1:-"$src/../../../dist/services/engagement/articles.json"}
[[ -f "$registry" && ! -L "$registry" ]] || exit 1
install -m644 "$src/../service.mjs" "$base/app/"
install -m644 "$registry" "$base/app/articles.json"
install -m644 "$src/backup.mjs" "$base/app/backup.mjs"
node=/opt/mzsh-node/node-v26.11.0-linux-x64/bin/node
[[ $("$node" --version) == v26.11.0 ]] || exit 1
if [[ ! -e "$base/config/service.json" ]]; then
  printf '%s\n' '{"appDir":"/srv/mzsh-engagement/app","db":"/srv/mzsh-engagement/data/counts.sqlite","registry":"/srv/mzsh-engagement/app/articles.json","backupDir":"/srv/mzsh-engagement/backups","host":"127.0.0.1","port":3010,"origin":"https://mzsh.me"}' > "$base/config/service.json"
fi
chown -R "$account:$account" "$base"
chmod 600 "$base/config/service.json"
cat > /etc/systemd/system/mzsh-engagement.service <<EOF
[Unit]
Description=Mzsh private article likes
After=network.target
[Service]
User=$account
Group=$account
WorkingDirectory=$base
ExecStart=$node $base/app/service.mjs $base/config/service.json
Restart=on-failure
RestartSec=5
UMask=0077
NoNewPrivileges=true
ProtectSystem=strict
ProtectHome=true
ReadWritePaths=$base/data
PrivateTmp=true
[Install]
WantedBy=multi-user.target
EOF
cat > /etc/systemd/system/mzsh-engagement-backup.service <<EOF
[Unit]
Description=Mzsh likes online SQLite backup and isolated restore check
After=mzsh-engagement.service
[Service]
Type=oneshot
User=$account
Group=$account
ExecStart=$node $base/app/backup.mjs $base/config/service.json
UMask=0077
NoNewPrivileges=true
ProtectSystem=strict
ProtectHome=true
ReadWritePaths=$base/backups
PrivateTmp=true
EOF
cat > /etc/systemd/system/mzsh-engagement-backup.timer <<'EOF'
[Unit]
Description=Daily verified likes backup
[Timer]
OnCalendar=*-*-* 03:40:00 Asia/Singapore
Persistent=true
[Install]
WantedBy=timers.target
EOF
systemctl daemon-reload
systemctl enable --now mzsh-engagement mzsh-engagement-backup.timer

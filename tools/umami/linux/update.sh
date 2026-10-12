#!/bin/bash
# 每日检查正式3.4.x；仅--apply的周日窗口允许经过隔离验证后切换。
set -euo pipefail
umask 077
base=/srv/mzsh-umami
state="$base/state"
[[ -f "$base/config/network.env" && ! -L "$base/config/network.env" && $(stat -c %a "$base/config/network.env") == 600 ]] || { echo 'Update paused: private outbound proxy configuration missing'; exit 1; }
set -a
source "$base/config/network.env"
set +a
mode=${UPDATE_NETWORK_MODE:-proxy}
curl_proxy=()
if [[ "$mode" == proxy ]]; then
  [[ -n ${https_proxy:-} && -n ${http_proxy:-} ]] || { echo 'Update paused: explicit outbound proxy required'; exit 1; }
  curl_proxy=(--proxy "$https_proxy")
elif [[ "$mode" == direct ]]; then
  unset https_proxy http_proxy HTTPS_PROXY HTTP_PROXY ALL_PROXY all_proxy
  curl_proxy=(--noproxy '*')
else
  echo 'Update paused: unknown outbound mode'
  exit 1
fi
exec 9> "$state/update.lock"
flock -n 9 || exit 1
response="$state/releases.json"
rm -f "$state/update-candidate" "$state/update-candidate-version"
curl --fail --silent --show-error --connect-timeout 15 --max-time 60 "${curl_proxy[@]}" https://api.github.com/repos/umami-software/umami/releases?per_page=100 -o "$response"
latest=$(jq -r '.[] | select(.draft == false and .prerelease == false) | .tag_name | select(test("^v3\\.4\\.[0-9]+$"))' "$response" | sort -V | tail -1)
[[ "$latest" =~ ^v3\.4\.[0-9]+$ ]] || exit 1
current=$(cat "$base/config/version")
printf 'Current %s; latest official compatible line %s\n' "$current" "$latest"
[[ "$latest" != "$current" && ${1:-} == --apply ]] || exit 0
[[ $(printf '%s\n%s\n' "$current" "$latest" | sort -V | tail -1) == "$latest" ]] || exit 0
tag="ghcr.io/umami-software/umami:${latest#v}"
podman pull --platform linux/amd64 "$tag"
digest=$(podman image inspect "$tag" --format '{{.Digest}}')
[[ "$digest" =~ ^sha256:[0-9a-f]{64}$ ]] || exit 1
candidate="ghcr.io/umami-software/umami@$digest"
old=$(cat "$base/config/image")
"$base/bin/image-metadata.sh" "$old" > "$state/metadata-current"
"$base/bin/image-metadata.sh" "$candidate" > "$state/metadata-candidate"
if ! cmp -s "$state/metadata-current" "$state/metadata-candidate"; then
  printf '%s\n' "$candidate" > "$state/metadata-blocked"
  echo 'Update paused: schema, migrations or runtime metadata changed; expert review required'
  exit 1
fi
# 只输出私有候选指针；root维护入口另行执行备份、隔离恢复和认证门禁。
printf '%s\n' "$candidate" > "$state/update-candidate"
printf '%s\n' "$latest" > "$state/update-candidate-version"
echo 'Compatible candidate pinned; isolated restore and authentication gate required before installation'

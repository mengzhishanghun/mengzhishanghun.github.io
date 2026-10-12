#!/bin/bash
set -euo pipefail
image=$1
[[ "$image" =~ ^ghcr.io/umami-software/umami@sha256:[0-9a-f]{64}$ ]] || exit 1
podman run --rm --network none --entrypoint sh "$image" -c '
  node -e '\''const p=require("./package.json"); console.log(JSON.stringify({node:process.version,engines:p.engines,dependencies:p.dependencies},Object.keys({node:1,engines:1,dependencies:1,...p.dependencies,...p.engines}).sort()))'\''
  find prisma -type f -print0 | sort -z | xargs -0 sha256sum
  sha256sum scripts/check-db.js prisma.config.ts
'

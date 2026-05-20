#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."

docker compose build fe
docker compose up -d fe

echo "프론트 → http://YOUR_DEPLOY_HOST:8081"

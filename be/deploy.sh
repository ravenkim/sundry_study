#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."

docker compose build be
docker compose up -d mysql be

echo "백엔드 → http://YOUR_DEPLOY_HOST:8080"
echo "Swagger → http://YOUR_DEPLOY_HOST:8080/swagger-ui.html"

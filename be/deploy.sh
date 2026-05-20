#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."

if docker ps --format '{{.Names}}' | grep -q '^ecoreport-mysql$'; then
    echo "[be] MySQL 이미 실행 중 — 건너뜀"
else
    docker compose up -d mysql
fi

docker compose build be
docker compose up -d be

echo "백엔드 → http://YOUR_DEPLOY_HOST:8080"
echo "Swagger → http://YOUR_DEPLOY_HOST:8080/swagger-ui.html"

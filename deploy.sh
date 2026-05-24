#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"

if [[ ! -f .env ]]; then
  echo "[deploy] .env 가 없습니다. 먼저 실행하세요:"
  echo "  cp .env.example .env"
  echo "  # .env 에 DB·OAuth·JWT·FRONTEND_URL·VITE_API_HOST 값을 채운 뒤 다시 deploy"
  echo "  # 서버 env 체크리스트: docs/기획/캠퍼스_에너지_절약/04_기술_기획/배포_가이드.md §4"
  exit 1
fi

echo "[1/2] 백엔드 배포 (MySQL + Flyway 스키마)..."
bash be/deploy.sh

echo "[2/2] 프론트 배포..."
bash fe/deploy.sh

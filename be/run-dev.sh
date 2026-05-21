#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$(dirname "$0")"

if [[ ! -f "${ROOT}/.env" ]]; then
  echo "[be] ${ROOT}/.env 없음 — cp .env.example .env"
  exit 1
fi

# shellcheck source=/dev/null
set -a && source "${ROOT}/.env" && set +a

export DB_URL="${DB_URL:-jdbc:mysql://localhost:3306/${MYSQL_DATABASE:-DBname}?serverTimezone=Asia/Seoul&characterEncoding=UTF-8}"
export DB_USERNAME="${DB_USERNAME:-${SPRING_DATASOURCE_USERNAME:-}}"
export DB_PASSWORD="${DB_PASSWORD:-${SPRING_DATASOURCE_PASSWORD:-}}"

exec ./gradlew bootRun "$@"

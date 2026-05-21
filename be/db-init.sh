#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
BE_DIR="$(cd "$(dirname "$0")" && pwd)"

if [[ ! -f "${ROOT}/.env" ]]; then
  echo "[db-init] ${ROOT}/.env 없음 — cp .env.example .env"
  exit 1
fi
# shellcheck source=/dev/null
set -a && source <(sed 's/\r$//' "${ROOT}/.env") && set +a

DB_NAME="${MYSQL_DATABASE:-DBname}"
DB_USER="${MYSQL_USER:-${SPRING_DATASOURCE_USERNAME:-${DB_USERNAME:-}}}"
DB_PASS="${MYSQL_PASSWORD:-${SPRING_DATASOURCE_PASSWORD:-${DB_PASSWORD:-}}}"

if [[ -z "${DB_USER}" || -z "${DB_PASS}" ]]; then
  echo "[db-init] MYSQL_USER/MYSQL_PASSWORD 또는 DB_USERNAME/DB_PASSWORD 를 .env 에 설정하세요."
  exit 1
fi

SQL="
SET GLOBAL validate_password.policy = LOW;
SET GLOBAL validate_password.length = 4;

CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\`
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE USER IF NOT EXISTS '${DB_USER}'@'%' IDENTIFIED BY '${DB_PASS}';

GRANT ALL PRIVILEGES ON \`${DB_NAME}\`.* TO '${DB_USER}'@'%';

FLUSH PRIVILEGES;
"

echo "[db-init] MySQL 접속 확인..."

if sudo mysql -e "SELECT 1" >/dev/null 2>&1; then
    echo "[db-init] sudo mysql 사용"
    sudo mysql <<< "$SQL"
else
    echo "[db-init] root 비밀번호를 입력하세요"
    mysql -u root -p <<< "$SQL"
fi

echo "[db-init] 완료 — DB: ${DB_NAME}, USER: ${DB_USER}"

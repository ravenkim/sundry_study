#!/usr/bin/env bash
set -euo pipefail

DB_NAME="DBname"
DB_USER="your_mysql_user"
DB_PASS="your_mysql_user"

SQL="
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

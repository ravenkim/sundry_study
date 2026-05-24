#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
BE_DIR="$ROOT/be"
cd "$ROOT"

if [[ ! -f "${ROOT}/.env" ]]; then
  echo "[be] ${ROOT}/.env 가 없습니다: cp .env.example .env"
  exit 1
fi

export DOCKER_BUILDKIT=1

# shellcheck source=/dev/null
set -a && source <(sed 's/\r$//' "${ROOT}/.env") && set +a
DEPLOY_HOST="${DEPLOY_PUBLIC_HOST:-localhost}"

MYSQL_USER="${MYSQL_USER:-}"
MYSQL_PASSWORD="${MYSQL_PASSWORD:-}"
MYSQL_DATABASE="${MYSQL_DATABASE:-energy_db}"

wait_for_mysql() {
  local attempt=0
  echo "[be] MySQL 준비 대기..."
  until docker exec ecoreport-mysql mysql -u"${MYSQL_USER}" -p"${MYSQL_PASSWORD}" "${MYSQL_DATABASE}" -e "SELECT 1" >/dev/null 2>&1; do
    attempt=$((attempt + 1))
    if [[ "${attempt}" -ge 30 ]]; then
      echo "[be] MySQL 연결 시간 초과"
      exit 1
    fi
    sleep 2
  done
  echo "[be] MySQL 연결 OK (스키마는 BE 기동 시 Flyway가 적용)"
}

deps_hash() {
  sha256sum \
    "$BE_DIR/Dockerfile.deps" \
    "$BE_DIR/Dockerfile" \
    "$BE_DIR/build.gradle" \
    "$BE_DIR/settings.gradle" \
    "$BE_DIR/gradle/wrapper/gradle-wrapper.properties" \
    "$ROOT/db/migration/"*.sql \
    | sha256sum | awk '{print $1}'
}

HASH=$(deps_hash)
DEPS_IMAGE="ecoreport-be-deps:${HASH}"

if docker ps --format '{{.Names}}' | grep -q '^ecoreport-mysql$'; then
  echo "[be] MySQL 이미 실행 중"
else
  echo "[be] MySQL 기동..."
  docker compose up -d mysql
fi

if [[ -n "${MYSQL_USER}" && -n "${MYSQL_PASSWORD}" ]]; then
  wait_for_mysql
fi

if docker image inspect "$DEPS_IMAGE" >/dev/null 2>&1; then
  echo "[be] 의존성 변경 없음 — Gradle dependencies 생략 (${DEPS_IMAGE})"
else
  echo "[be] build.gradle / settings.gradle 변경 — 의존성 다운로드 중..."
  docker build -f "$BE_DIR/Dockerfile.deps" -t "$DEPS_IMAGE" "$BE_DIR"
fi

export DEPS_IMAGE
docker compose build be
docker compose up -d be

wait_for_be() {
  # 배포 서버 내부 헬스체크 — DEPLOY_PUBLIC_HOST(공인 IP/도메인)는 hairpin NAT 등으로
  # 서버에서 자기 자신에게 접속되지 않는 경우가 많아 127.0.0.1 고정
  local health_host="127.0.0.1"
  local port="${SERVER_PORT:-8080}"
  local attempt=0
  echo "[be] 백엔드 준비 대기 (http://${health_host}:${port}/ping)..."
  until curl -sf "http://${health_host}:${port}/ping" >/dev/null 2>&1; do
    attempt=$((attempt + 1))
    if (( attempt % 5 == 0 )); then
      echo "[be]   ... 대기 중 (${attempt}/60, BE 로그: docker compose logs --tail 20 be)"
    fi
    if [[ "${attempt}" -ge 60 ]]; then
      echo "[be] 백엔드 기동 시간 초과 — 최근 로그:"
      docker compose logs --tail 40 be || true
      exit 1
    fi
    sleep 2
  done
  echo "[be] 백엔드 OK"
}

wait_for_be

echo "백엔드 → http://${DEPLOY_HOST}:8080"
echo "Swagger → http://${DEPLOY_HOST}:8080/swagger-ui.html"

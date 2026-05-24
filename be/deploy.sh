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
  local err=""
  echo "[be] MySQL 준비 대기..."
  while true; do
    err="$(docker exec ecoreport-mysql mysql \
      -u"${MYSQL_USER}" -p"${MYSQL_PASSWORD}" "${MYSQL_DATABASE}" \
      -e "SELECT 1" 2>&1)" && break

    attempt=$((attempt + 1))
    if [[ "${attempt}" -ge 30 ]]; then
      if echo "${err}" | grep -qiE 'Access denied|1045'; then
        echo "[be] MySQL 인증 실패 — .env 의 MYSQL_* 와 DB 볼륨 계정이 불일치합니다."
        echo "[be]   docker compose down -v && bash deploy.sh 로 재초기화하세요."
      else
        echo "[be] MySQL 연결 시간 초과"
      fi
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
BE_STATE_DIR="${ROOT}/.deploy"
BE_APP_HASH_FILE="${BE_STATE_DIR}/be.app.sha256"
BE_ENV_HASH_FILE="${BE_STATE_DIR}/be.env.sha256"

env_hash() {
  {
    echo "${SPRING_DATASOURCE_URL:-}"
    echo "${SPRING_DATASOURCE_USERNAME:-}"
    echo "${SPRING_DATASOURCE_PASSWORD:-}"
    echo "${MYSQL_USER:-}"
    echo "${MYSQL_PASSWORD:-}"
    echo "${MYSQL_DATABASE:-energy_db}"
  } | sha256sum | awk '{print $1}'
}

app_build_hash() {
  {
    sha256sum "$BE_DIR/Dockerfile" "$ROOT/db/migration/"*.sql
    find "$BE_DIR/src" -type f -print0 | sort -z | xargs -0 sha256sum 2>/dev/null || true
    echo "${DEPS_IMAGE}"
  } | sha256sum | awk '{print $1}'
}

be_is_healthy() {
  curl -sf "http://127.0.0.1:${SERVER_PORT:-8080}/ping" >/dev/null 2>&1
}

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

APP_HASH="$(app_build_hash)"
ENV_HASH="$(env_hash)"
STORED_APP_HASH=""
STORED_ENV_HASH=""
if [[ -f "${BE_APP_HASH_FILE}" ]]; then
  STORED_APP_HASH="$(cat "${BE_APP_HASH_FILE}")"
fi
if [[ -f "${BE_ENV_HASH_FILE}" ]]; then
  STORED_ENV_HASH="$(cat "${BE_ENV_HASH_FILE}")"
fi

BE_NEEDS_DEPLOY=1
if [[ "${APP_HASH}" == "${STORED_APP_HASH}" ]] \
    && [[ "${ENV_HASH}" == "${STORED_ENV_HASH}" ]] \
    && docker ps --format '{{.Names}}' | grep -q '^ecoreport-be$' \
    && be_is_healthy; then
  echo "[be] 소스·의존성·env 변경 없음 — BE 빌드·재시작 생략"
  BE_NEEDS_DEPLOY=0
else
  if [[ "${ENV_HASH}" != "${STORED_ENV_HASH}" ]] && [[ -n "${STORED_ENV_HASH}" ]]; then
    echo "[be] .env DB 설정 변경 — BE 재시작"
  fi
  docker compose build be
  docker compose up -d --force-recreate be
  mkdir -p "${BE_STATE_DIR}"
  echo "${APP_HASH}" > "${BE_APP_HASH_FILE}"
  echo "${ENV_HASH}" > "${BE_ENV_HASH_FILE}"
fi

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

if [[ "${BE_NEEDS_DEPLOY}" -eq 1 ]] && [[ -z "${DEPLOY_NO_WAIT:-}" ]]; then
  wait_for_be
elif [[ "${BE_NEEDS_DEPLOY}" -eq 0 ]]; then
  echo "[be] 백엔드 OK (이미 실행 중)"
fi

echo "백엔드 → http://${DEPLOY_HOST}:8080"
echo "Swagger → http://${DEPLOY_HOST}:8080/swagger-ui.html"

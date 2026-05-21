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
set -a && source "${ROOT}/.env" && set +a
DEPLOY_HOST="${DEPLOY_PUBLIC_HOST:-localhost}"

deps_hash() {
  sha256sum \
    "$BE_DIR/build.gradle" \
    "$BE_DIR/settings.gradle" \
    "$BE_DIR/gradle/wrapper/gradle-wrapper.properties" \
    | sha256sum | awk '{print $1}'
}

HASH=$(deps_hash)
DEPS_IMAGE="ecoreport-be-deps:${HASH}"

if docker ps --format '{{.Names}}' | grep -q '^ecoreport-mysql$'; then
  echo "[be] MySQL 이미 실행 중 — 건너뜀"
else
  docker compose up -d mysql
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

echo "백엔드 → http://${DEPLOY_HOST}:8080"
echo "Swagger → http://${DEPLOY_HOST}:8080/swagger-ui.html"

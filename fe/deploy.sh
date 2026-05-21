#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
FE_DIR="$ROOT/fe"
cd "$ROOT"

if [[ ! -f "${ROOT}/.env" ]]; then
  echo "[fe] ${ROOT}/.env 가 없습니다: cp .env.example .env"
  exit 1
fi

# shellcheck source=/dev/null
set -a && source "${ROOT}/.env" && set +a
DEPLOY_HOST="${DEPLOY_PUBLIC_HOST:-localhost}"

# Docker 빌드 ARG — fe/.env.production 없이 루트 .env 의 VITE_API_HOST 전달
# 비우면 same-origin (nginx/Cloudflare 프록시). 미설정 시 fallback URL 사용
if [[ -z "${VITE_API_HOST+x}" ]]; then
  export VITE_API_HOST="http://${DEPLOY_HOST}:${SERVER_PORT:-8080}"
fi
echo "[fe] Docker build VITE_API_HOST='${VITE_API_HOST}'"

export DOCKER_BUILDKIT=1

deps_hash() {
  sha256sum "$FE_DIR/package.json" "$FE_DIR/yarn.lock" "$FE_DIR/.yarnrc.yml" | sha256sum | awk '{print $1}'
}

HASH=$(deps_hash)
DEPS_IMAGE="ecoreport-fe-deps:${HASH}"

if docker image inspect "$DEPS_IMAGE" >/dev/null 2>&1; then
  echo "[fe] 의존성 변경 없음 — yarn install 생략 (${DEPS_IMAGE})"
else
  echo "[fe] package.json / yarn.lock 변경 — 의존성 설치 중..."
  docker build -f "$FE_DIR/Dockerfile.deps" -t "$DEPS_IMAGE" "$FE_DIR"
fi

export DEPS_IMAGE
docker compose build fe
docker compose up -d fe

echo "프론트 → http://${DEPLOY_HOST}:8081"

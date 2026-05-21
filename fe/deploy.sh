#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
FE_DIR="$ROOT/fe"
cd "$ROOT"

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

echo "프론트 → http://YOUR_DEPLOY_HOST:8081"

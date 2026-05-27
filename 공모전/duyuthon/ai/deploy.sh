#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
AI_DIR="${ROOT}/ai/for_deploy/campus_api"
cd "$ROOT"

if [[ ! -f "${ROOT}/.env" ]]; then
  echo "[ai] ${ROOT}/.env 가 없습니다: cp .env.example .env"
  exit 1
fi

# shellcheck source=/dev/null
set -a && source <(sed 's/\r$//' "${ROOT}/.env") && set +a

GCP_SA_KEY_PATH="${GCP_SA_KEY_PATH:-./secrets/gcp-sa.json}"
AI_PORT="${AI_PORT:-8082}"
AC_MODEL_PATH="${AI_DIR}/models/ac_best.pt"

if [[ "${GCP_SA_KEY_PATH}" != /* ]]; then
  RESOLVED_GCP_KEY="${ROOT}/${GCP_SA_KEY_PATH#./}"
else
  RESOLVED_GCP_KEY="${GCP_SA_KEY_PATH}"
fi

if [[ ! -f "${RESOLVED_GCP_KEY}" ]]; then
  echo "[ai] GCP 서비스 계정 키가 없습니다: ${GCP_SA_KEY_PATH}"
  echo "[ai]   Vertex AI(Gemini) 호출에 필요합니다. secrets/gcp-sa.json 을 배치하세요."
  exit 1
fi

if [[ ! -f "${AC_MODEL_PATH}" ]]; then
  echo "[ai] 에어컨 YOLO 가중치가 없습니다: ${AC_MODEL_PATH}"
  echo "[ai]   학습 산출물 ac_best.pt 를 models/ 에 배치하세요."
  exit 1
fi

export DOCKER_BUILDKIT=1
export COMPOSE_DOCKER_CLI_BUILD=1

AI_STATE_DIR="${ROOT}/.deploy"

deps_hash() {
  sha256sum "${AI_DIR}/Dockerfile.deps" "${AI_DIR}/requirements.txt" \
    | sha256sum | awk '{print $1}'
}

DEPS_HASH="$(deps_hash)"
DEPS_IMAGE="ecoreport-ai-deps:${DEPS_HASH}"
DEPS_CACHE_TAG="ecoreport-ai-deps:local"
AI_DEPS_HASH_FILE="${AI_STATE_DIR}/ai.deps.sha256"

mkdir -p "${AI_STATE_DIR}"

if docker image inspect "${DEPS_IMAGE}" >/dev/null 2>&1; then
  echo "[ai] deps 캐시 hit — pip·apt·YOLO 다운로드 생략 (${DEPS_IMAGE})"
else
  echo "[ai] deps 이미지 없음 — pip·YOLO 다운로드 (CPU torch ~150MB, 최초 1회 · 이후 이미지 재사용)"
  build_cache_args=()
  if docker image inspect "${DEPS_CACHE_TAG}" >/dev/null 2>&1; then
    build_cache_args=(--cache-from "${DEPS_CACHE_TAG}")
  fi
  docker build \
    "${build_cache_args[@]}" \
    -f "${AI_DIR}/Dockerfile.deps" \
    -t "${DEPS_IMAGE}" \
    -t "${DEPS_CACHE_TAG}" \
    "${AI_DIR}"
  echo "${DEPS_HASH}" > "${AI_DEPS_HASH_FILE}"
fi

export AI_DEPS_IMAGE="${DEPS_IMAGE}"
unset DEPS_IMAGE

app_build_hash() {
  {
    sha256sum "${AI_DIR}/Dockerfile" "${AI_DIR}/main.py"
    echo "${DEPS_HASH}"
  } | sha256sum | awk '{print $1}'
}

AI_APP_HASH_FILE="${AI_STATE_DIR}/ai.app.sha256"

APP_HASH="$(app_build_hash)"
STORED_APP_HASH=""
if [[ -f "${AI_APP_HASH_FILE}" ]]; then
  STORED_APP_HASH="$(cat "${AI_APP_HASH_FILE}")"
fi

ai_is_ready() {
  curl -sf "http://127.0.0.1:${AI_PORT}/ready" >/dev/null 2>&1
}

ai_ready_http_code() {
  curl -s -o /dev/null -w '%{http_code}' "http://127.0.0.1:${AI_PORT}/ready" 2>/dev/null || echo "000"
}

# healthcheck는 /ready 인데 구버전 이미지는 404 → unhealthy 무한 대기 방지
ai_image_stale() {
  docker ps --format '{{.Names}}' | grep -q '^ecoreport-ai$' \
    && [[ "$(ai_ready_http_code)" == "404" ]]
}

ai_container_restarting() {
  local status
  status="$(docker inspect -f '{{.State.Status}}' ecoreport-ai 2>/dev/null || echo missing)"
  [[ "${status}" == "restarting" ]]
}

# fe/deploy.sh 가 FE deps 로 AI 를 잘못 빌드한 경우 (Node.js + uvicorn 오류)
ai_runtime_broken() {
  docker compose logs --tail 10 ai 2>/dev/null \
    | grep -qE 'Cannot find module.*uvicorn|Node\.js v[0-9]'
}

AI_NEEDS_DEPLOY=1
if ai_image_stale; then
  echo "[ai] 구버전 AI 이미지 감지 (/ready 404) — 강제 재빌드"
elif ai_runtime_broken; then
  echo "[ai] 잘못된 AI 이미지 감지 (Node.js 런타임) — 강제 재빌드"
elif [[ "${APP_HASH}" == "${STORED_APP_HASH}" ]] \
    && docker ps --format '{{.Names}}' | grep -q '^ecoreport-ai$' \
    && ai_is_ready \
    && ! ai_container_restarting; then
  echo "[ai] 소스 변경 없음 — AI 빌드·재시작 생략"
  AI_NEEDS_DEPLOY=0
fi

if [[ "${AI_NEEDS_DEPLOY}" -eq 1 ]]; then
  echo "[ai] AI 이미지 빌드 중..."
  docker compose build ai
  docker compose up -d --force-recreate ai
  mkdir -p "${AI_STATE_DIR}"
  echo "${APP_HASH}" > "${AI_APP_HASH_FILE}"
fi

wait_for_ai() {
  local attempt=0
  echo "[ai] AI 준비 대기 (http://127.0.0.1:${AI_PORT}/ready)..."
  until curl -sf "http://127.0.0.1:${AI_PORT}/ready" >/dev/null 2>&1; do
    attempt=$((attempt + 1))
    if (( attempt % 5 == 0 )); then
      echo "[ai]   ... 대기 중 (${attempt}/60, YOLO 모델 로딩 포함)"
      if ai_container_restarting; then
        echo "[ai]   AI 컨테이너 재시작 루프 — 최근 로그:"
        docker compose logs --tail 15 ai 2>/dev/null | sed 's/^/    /' || true
      fi
    fi
    if [[ "${attempt}" -ge 60 ]]; then
      echo "[ai] AI 기동 시간 초과 — 최근 로그:"
      docker compose logs --tail 40 ai || true
      exit 1
    fi
    sleep 2
  done
  echo "[ai] AI OK"
}

if [[ "${AI_NEEDS_DEPLOY}" -eq 1 ]] && [[ -z "${DEPLOY_NO_WAIT:-}" ]]; then
  wait_for_ai
elif [[ "${AI_NEEDS_DEPLOY}" -eq 0 ]]; then
  if ai_is_ready; then
    echo "[ai] AI OK (이미 실행 중)"
  else
    wait_for_ai
  fi
fi

echo "AI → http://${DEPLOY_PUBLIC_HOST:-localhost}:${AI_PORT}"

#!/usr/bin/env bash
# EcoReport 프론트엔드 배포
#   bash deploy.sh          → 프로젝트 루트 통합 배포 (FE+BE+MySQL)
#   bash deploy.sh build    → 프로덕션 빌드
#   bash deploy.sh cloudrun → Cloud Run만 배포

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"

if [[ $# -eq 0 ]]; then
    exec bash "$ROOT_DIR/deploy.sh"
fi

if [[ "${1:-}" == "-h" || "${1:-}" == "--help" || "${1:-}" == "help" ]]; then
    cat <<'EOF'
EcoReport 프론트엔드

  bash deploy.sh              통합 배포 (루트 deploy.sh 실행)
  bash deploy.sh build        yarn build
  bash deploy.sh docker       Docker 이미지 빌드
  bash deploy.sh run          단독 컨테이너 실행
  bash deploy.sh preview      vite preview
  bash deploy.sh cloudrun     Cloud Run 배포
EOF
    exit 0
fi

cd "$SCRIPT_DIR"

TARGET="${1:-}"
shift || true

SKIP_INSTALL=false
ENV_FILE="${ENV_FILE:-.env.production}"
IMAGE_TAG="${IMAGE_TAG:-ecoreport-fe:local}"
HOST_PORT="${HOST_PORT:-8081}"
GCP_REGION="${GCP_REGION:-asia-northeast3}"
CLOUD_RUN_SERVICE="${CLOUD_RUN_SERVICE:-ecoreport-fe}"
IMAGE_NAME="${IMAGE_NAME:-ecoreport-fe}"

log() { printf '\033[1;34m[fe:deploy]\033[0m %s\n' "$*"; }
die() { printf '\033[1;31m[fe:deploy:error]\033[0m %s\n' "$*" >&2; exit 1; }

while [[ $# -gt 0 ]]; do
    case "$1" in
        --skip-install) SKIP_INSTALL=true; shift ;;
        --env-file) ENV_FILE="${2:?}"; shift 2 ;;
        --api-host) VITE_API_HOST="${2:?}"; shift 2 ;;
        --tag) IMAGE_TAG="${2:?}"; shift 2 ;;
        --port) HOST_PORT="${2:?}"; shift 2 ;;
        *) die "알 수 없는 옵션: $1" ;;
    esac
done

require_cmd() { command -v "$1" >/dev/null 2>&1 || die "'$1' 필요"; }

run_yarn() {
    if [[ -x "$SCRIPT_DIR/.yarn/releases/yarn-4.9.4.cjs" ]]; then
        node "$SCRIPT_DIR/.yarn/releases/yarn-4.9.4.cjs" "$@"
    else
        yarn "$@"
    fi
}

load_env() {
    if [[ -n "${VITE_API_HOST:-}" ]]; then return; fi
    if [[ -f "$ENV_FILE" ]]; then
        set -a; source "$ENV_FILE"; set +a
    else
        VITE_API_HOST="${VITE_API_HOST:-http://localhost:8080}"
    fi
}

build_app() {
    [[ "$SKIP_INSTALL" != true ]] && run_yarn install --immutable
    load_env
    VITE_API_HOST="$VITE_API_HOST" run_yarn build
}

build_image() {
    require_cmd docker
    load_env
    docker build --build-arg "VITE_API_HOST=${VITE_API_HOST}" -t "$IMAGE_TAG" .
}

run_container() {
    build_image
    docker run --rm -p "${HOST_PORT}:80" --name ecoreport-fe "$IMAGE_TAG"
}

deploy_cloudrun() {
    require_cmd docker
    require_cmd gcloud
    build_image
    local project="${GCP_PROJECT:-$(gcloud config get-value project 2>/dev/null || true)}"
    [[ -n "$project" ]] || die "GCP_PROJECT 설정 필요"

    local tag image
    tag="$(git rev-parse --short HEAD 2>/dev/null || date +%Y%m%d%H%M%S)"
    image="gcr.io/${project}/${IMAGE_NAME}:${tag}"
    docker tag "$IMAGE_TAG" "$image"
    docker push "$image"
    gcloud run deploy "$CLOUD_RUN_SERVICE" \
        --image "$image" --region "$GCP_REGION" \
        --platform managed --allow-unauthenticated --port 80
}

case "$TARGET" in
    build) build_app ;;
    docker) build_image ;;
    run) run_container ;;
    preview)
        build_app
        run_yarn preview --host 0.0.0.0 --port 4173
        ;;
    cloudrun) deploy_cloudrun ;;
    *) die "알 수 없는 명령: $TARGET" ;;
esac

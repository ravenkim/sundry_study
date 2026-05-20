#!/usr/bin/env bash
# EcoReport 백엔드 배포
#   bash deploy.sh          → 프로젝트 루트 통합 배포 (FE+BE+MySQL)
#   bash deploy.sh build    → JAR 빌드
#   bash deploy.sh cloudrun → Cloud Run만 배포

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"

if [[ $# -eq 0 ]]; then
    exec bash "$ROOT_DIR/deploy.sh"
fi

if [[ "${1:-}" == "-h" || "${1:-}" == "--help" || "${1:-}" == "help" ]]; then
    cat <<'EOF'
EcoReport 백엔드

  bash deploy.sh              통합 배포 (루트 deploy.sh 실행)
  bash deploy.sh build        Gradle bootJar
  bash deploy.sh docker       Docker 이미지 빌드
  bash deploy.sh run          단독 컨테이너 실행
  bash deploy.sh cloudrun     Cloud Run 배포
EOF
    exit 0
fi

cd "$SCRIPT_DIR"

TARGET="${1:-}"
shift || true

ENV_FILE="${ENV_FILE:-.env.docker}"
IMAGE_TAG="${IMAGE_TAG:-ecoreport-be:local}"
GCP_REGION="${GCP_REGION:-asia-northeast3}"
CLOUD_RUN_SERVICE="${CLOUD_RUN_SERVICE:-ecoreport-be}"
IMAGE_NAME="${IMAGE_NAME:-ecoreport-be}"
DOCKER_NETWORK="${DOCKER_NETWORK:-}"

log() { printf '\033[1;34m[be:deploy]\033[0m %s\n' "$*"; }
die() { printf '\033[1;31m[be:deploy:error]\033[0m %s\n' "$*" >&2; exit 1; }

while [[ $# -gt 0 ]]; do
    case "$1" in
        --env-file) ENV_FILE="${2:?}"; shift 2 ;;
        --tag) IMAGE_TAG="${2:?}"; shift 2 ;;
        --network) DOCKER_NETWORK="${2:?}"; shift 2 ;;
        *) die "알 수 없는 옵션: $1" ;;
    esac
done

require_cmd() { command -v "$1" >/dev/null 2>&1 || die "'$1' 필요"; }

build_jar() {
    log "Gradle bootJar..."
    chmod +x ./gradlew
    ./gradlew bootJar -x test --no-daemon
}

build_image() {
    require_cmd docker
    docker build -t "$IMAGE_TAG" .
}

run_container() {
    require_cmd docker
    build_image
    local -a args=(--rm -p 8080:8080 --name ecoreport-be)
    [[ -f "$ENV_FILE" ]] && args+=(--env-file "$ENV_FILE")
    [[ -n "$DOCKER_NETWORK" ]] && args+=(--network "$DOCKER_NETWORK")
    docker run "${args[@]}" "$IMAGE_TAG"
}

deploy_cloudrun() {
    require_cmd docker
    require_cmd gcloud
    local project="${GCP_PROJECT:-$(gcloud config get-value project 2>/dev/null || true)}"
    [[ -n "$project" ]] || die "GCP_PROJECT 설정 필요"

    local tag image
    tag="$(git rev-parse --short HEAD 2>/dev/null || date +%Y%m%d%H%M%S)"
    image="gcr.io/${project}/${IMAGE_NAME}:${tag}"

    docker build -t "$image" .
    docker push "$image"

    local -a args=(
        run deploy "$CLOUD_RUN_SERVICE"
        --image "$image" --region "$GCP_REGION"
        --platform managed --allow-unauthenticated --port 8080
    )
    [[ -f "$ENV_FILE" ]] && args+=(--env-vars-file "$ENV_FILE")

    gcloud "${args[@]}"
    log "Cloud Run 배포 완료"
}

case "$TARGET" in
    build) build_jar ;;
    docker) build_image ;;
    run) run_container ;;
    cloudrun) deploy_cloudrun ;;
    *) die "알 수 없는 명령: $TARGET" ;;
esac

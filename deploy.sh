#!/usr/bin/env bash
# EcoReport 통합 배포 — 인자 없이 실행 시 FE + BE + MySQL 자동 배포
#
#   bash deploy.sh              # 로컬 Docker Compose (기본)
#   bash deploy.sh cloudrun     # GCP Cloud Run (GCP_PROJECT 필요)
#   bash deploy.sh down         # 컨테이너 중지
#   bash deploy.sh logs         # 로그 보기
#
# 환경 변수:
#   VITE_API_HOST     FE 빌드용 API URL (기본: http://localhost:8080)
#   GCP_PROJECT       Cloud Run 프로젝트
#   GCP_REGION        기본 asia-northeast3

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$ROOT_DIR"

TARGET="${1:-deploy}"
shift || true

GCP_REGION="${GCP_REGION:-asia-northeast3}"
BE_SERVICE="${BE_SERVICE:-ecoreport-be}"
FE_SERVICE="${FE_SERVICE:-ecoreport-fe}"

usage() {
    cat <<'EOF'
EcoReport 통합 배포

  bash deploy.sh              FE + BE + MySQL Docker 배포 (기본)
  bash deploy.sh down         컨테이너 중지·삭제
  bash deploy.sh logs         로그 스트리밍
  bash deploy.sh ps           실행 상태 확인
  bash deploy.sh cloudrun     BE·FE Cloud Run 배포

환경 변수: VITE_API_HOST, GCP_PROJECT, GCP_REGION

서브 명령 (개별 작업):
  be/build, be/docker, fe/build, fe/docker — ./be/deploy.sh build 등 사용
EOF
}

log() { printf '\033[1;32m[deploy]\033[0m %s\n' "$*"; }
die() { printf '\033[1;31m[deploy:error]\033[0m %s\n' "$*" >&2; exit 1; }

if [[ "$TARGET" == "-h" || "$TARGET" == "--help" || "$TARGET" == "help" ]]; then
    usage
    exit 0
fi

while [[ $# -gt 0 ]]; do
    case "$1" in
        *)
            die "알 수 없는 옵션: $1"
            ;;
    esac
done

require_cmd() {
    command -v "$1" >/dev/null 2>&1 || die "'$1'이 필요합니다. Docker Desktop(WSL 연동)을 확인하세요."
}

docker_compose() {
    if docker compose version >/dev/null 2>&1; then
        docker compose "$@"
    elif command -v docker-compose >/dev/null 2>&1; then
        docker-compose "$@"
    else
        die "docker compose를 사용할 수 없습니다."
    fi
}

wait_for_be() {
    local i=0
    log "백엔드 기동 대기..."
    while [[ $i -lt 60 ]]; do
        if curl -sf http://localhost:8080/actuator/health >/dev/null 2>&1; then
            log "백엔드 준비 완료"
            return 0
        fi
        sleep 2
        i=$((i + 1))
    done
    log "백엔드 health 체크 시간 초과 — 로그: bash deploy.sh logs"
}

deploy_local() {
    require_cmd docker
    [[ -f docker-compose.yml ]] || die "docker-compose.yml이 없습니다."

    log "Docker Compose 빌드 및 배포..."
    docker_compose up --build -d

    wait_for_be

    printf '\n'
    log '배포 완료'
    printf '  프론트  → http://localhost:8081\n'
    printf '  백엔드  → http://localhost:8080\n'
    printf '  API문서 → http://localhost:8080/swagger-ui.html\n'
    printf '  헬스   → http://localhost:8080/actuator/health\n'
    printf '\n'
    printf '  중지: bash deploy.sh down\n'
    printf '  로그: bash deploy.sh logs\n'
}

deploy_cloudrun() {
    require_cmd docker
    require_cmd gcloud

    local project="${GCP_PROJECT:-}"
    if [[ -z "$project" ]]; then
        project="$(gcloud config get-value project 2>/dev/null || true)"
    fi
    [[ -n "$project" ]] || die "GCP_PROJECT를 설정하세요."

    local tag
    tag="$(git rev-parse --short HEAD 2>/dev/null || date +%Y%m%d%H%M%S)"

    log "백엔드 Cloud Run 배포..."
    GCP_PROJECT="$project" GCP_REGION="$GCP_REGION" \
        bash "$ROOT_DIR/be/deploy.sh" cloudrun

    local be_url
    be_url="$(gcloud run services describe "$BE_SERVICE" \
        --region "$GCP_REGION" \
        --project "$project" \
        --format='value(status.url)' 2>/dev/null || true)"

    if [[ -z "$be_url" ]]; then
        die "백엔드 Cloud Run URL을 가져오지 못했습니다. BE_SERVICE=${BE_SERVICE}"
    fi

    log "프론트 빌드 (API=${be_url})..."
    VITE_API_HOST="$be_url" GCP_PROJECT="$project" GCP_REGION="$GCP_REGION" \
        bash "$ROOT_DIR/fe/deploy.sh" cloudrun

    local fe_url
    fe_url="$(gcloud run services describe "$FE_SERVICE" \
        --region "$GCP_REGION" \
        --project "$project" \
        --format='value(status.url)' 2>/dev/null || true)"

    printf '\n'
    log 'Cloud Run 배포 완료'
    printf '  프론트  → %s\n' "${fe_url:-(확인 필요)}"
    printf '  백엔드  → %s\n' "$be_url"
}

main() {
    case "$TARGET" in
        deploy|"")
            deploy_local
            ;;
        down|stop)
            docker_compose down
            log "컨테이너 중지됨"
            ;;
        logs)
            docker_compose logs -f
            ;;
        ps|status)
            docker_compose ps
            ;;
        cloudrun)
            deploy_cloudrun
            ;;
        *)
            die "알 수 없는 명령: $TARGET (bash deploy.sh --help)"
            ;;
    esac
}

main

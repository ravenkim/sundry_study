#!/usr/bin/env bash
# Cloudflare Quick Tunnel — FE nginx(8081)을 외부 HTTPS로 노출
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
ORIGIN="${TUNNEL_ORIGIN_URL:-http://127.0.0.1:8081}"

log() { echo "[tunnel] $*"; }

wait_for_origin() {
  log "origin 대기: ${ORIGIN}"
  local attempt=0
  until curl -sf "${ORIGIN}/" >/dev/null 2>&1; do
    attempt=$((attempt + 1))
    if [[ "${attempt}" -ge 30 ]]; then
      log "origin 응답 없음 — bash deploy.sh 후 다시 시도"
      exit 1
    fi
    sleep 2
  done
  log "origin OK (FE 정적)"
}

verify_origin_api() {
  log "origin API 프록시 확인 (FE nginx → BE)..."
  local response
  response="$(curl -sf -X POST "${ORIGIN}/api/auth/login" \
    -H 'Content-Type: application/json' \
    -d '{"userName":"admin","password":"admin1234!"}' 2>/dev/null || true)"
  if echo "${response}" | grep -q '"code":10001'; then
    log "origin API OK (로그인 FE → BE)"
    return 0
  fi
  log "origin API 실패 — BE Restarting 이면 Tunnel에서 /api/* 502"
  log "  docker compose ps"
  log "  docker compose logs --tail 80 be"
  log "  curl -i ${ORIGIN}/ping"
  exit 1
}

resolve_cloudflared() {
  if command -v cloudflared >/dev/null 2>&1; then
    command -v cloudflared
    return 0
  fi
  if [[ -x "${ROOT}/cloudflared" ]]; then
    echo "${ROOT}/cloudflared"
    return 0
  fi
  return 1
}

if ! CLOUDFLARED="$(resolve_cloudflared)"; then
  log "cloudflared 없음 — Quick Tunnel 설치 필요"
  exit 1
fi

wait_for_origin
verify_origin_api
log "Quick Tunnel 시작 (origin=${ORIGIN})"
log "새 URL → .env FRONTEND_URL 갱신 후 bash be/deploy.sh (OAuth용)"
log "VITE_API_HOST 는 비워 두세요 — same-origin /api 프록시"

exec "${CLOUDFLARED}" tunnel --url "${ORIGIN}"

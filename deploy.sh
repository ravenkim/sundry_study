#!/usr/bin/env bash
# EcoReport 통합 배포 — bash deploy.sh 한 번이면 MySQL·Flyway·BE·FE까지 자동 처리
set -euo pipefail

ROOT="$(cd "$(dirname "$0")" && pwd)"
cd "$ROOT"

DEPLOY_STATE_DIR="${ROOT}/.deploy"
MIGRATION_HASH_FILE="${DEPLOY_STATE_DIR}/migration.version.sha256"

log() { echo "[deploy] $*"; }
log_db() { echo "[deploy][db] $*"; }

ensure_env() {
  if [[ ! -f "${ROOT}/.env" ]]; then
    if [[ ! -f "${ROOT}/.env.example" ]]; then
      log ".env / .env.example 모두 없습니다."
      exit 1
    fi
    cp "${ROOT}/.env.example" "${ROOT}/.env"
    log ".env 없어서 .env.example 을 복사했습니다."
    log ".env 에 MYSQL_* · JWT_SECRET 등을 설정한 뒤 다시 실행하세요."
    exit 1
  fi
}

versioned_migration_hash() {
  sha256sum "${ROOT}/db/migration"/V*.sql 2>/dev/null | sha256sum | awk '{print $1}'
}

log_db_migration_files() {
  log_db "마이그레이션 SQL (db/migration/):"
  local found=0
  for f in "${ROOT}/db/migration"/V*.sql; do
    [[ -f "${f}" ]] || continue
    log_db "  $(basename "${f}")"
    found=1
  done
  for f in "${ROOT}/db/migration"/R__*.sql; do
    [[ -f "${f}" ]] || continue
    log_db "  $(basename "${f}") (시드)"
    found=1
  done
  if [[ "${found}" -eq 0 ]]; then
    log_db "  (파일 없음)"
  fi
}

ensure_mysql_for_db_check() {
  load_env
  if docker ps --format '{{.Names}}' | grep -q '^ecoreport-mysql$'; then
    return 0
  fi
  log_db "MySQL 기동 (구 DB 검사)..."
  docker compose up -d mysql
  local attempt=0
  until docker exec ecoreport-mysql mysqladmin ping -h localhost --silent 2>/dev/null; do
    attempt=$((attempt + 1))
    if [[ "${attempt}" -ge 30 ]]; then
      log_db "MySQL 기동 시간 초과"
      exit 1
    fi
    sleep 2
  done
}

maybe_reset_legacy_db() {
  load_env

  if [[ -z "${MYSQL_USER:-}" || -z "${MYSQL_PASSWORD:-}" ]]; then
    return 0
  fi

  if ! docker ps --format '{{.Names}}' | grep -q '^ecoreport-mysql$'; then
    return 0
  fi

  local flyway_exists legacy_exists
  flyway_exists="$(mysql_exec \
    "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema='${MYSQL_DATABASE:-energy_db}' AND table_name='flyway_schema_history';" \
    2>/dev/null || echo "0")"
  legacy_exists="$(mysql_exec \
    "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema='${MYSQL_DATABASE:-energy_db}' AND table_name='building_db';" \
    2>/dev/null || echo "0")"

  if [[ "${legacy_exists}" -gt 0 ]]; then
    log_db "구 스키마(building_db) 감지 — MySQL 볼륨 초기화 후 Flyway 재적용"
    docker compose down -v 2>/dev/null || true
    return 0
  fi

  if [[ "${flyway_exists}" -eq 0 ]]; then
    local table_count
    table_count="$(mysql_exec \
      "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema='${MYSQL_DATABASE:-energy_db}' AND table_type='BASE TABLE';" \
      2>/dev/null || echo "0")"
    if [[ "${table_count}" -gt 0 ]]; then
      log_db "Flyway 이력 없는 기존 DB 감지 — MySQL 볼륨 초기화"
      docker compose down -v 2>/dev/null || true
    fi
  fi
}

maybe_reset_db_on_schema_change() {
  local current stored=""
  current="$(versioned_migration_hash)"
  if [[ -z "${current}" ]]; then
    log_db "db/migration/V*.sql 없음 — 스키마 마이그레이션 파일을 확인하세요."
    exit 1
  fi

  if [[ -f "${MIGRATION_HASH_FILE}" ]]; then
    stored="$(cat "${MIGRATION_HASH_FILE}")"
  fi

  if [[ "${current}" == "${stored}" ]]; then
    log_db "스키마 변경 없음 — 기존 MySQL 볼륨 유지 (해시: ${current:0:12}...)"
    return 0
  fi

  if [[ -n "${stored}" ]]; then
    log_db "V*.sql 변경 감지 — MySQL 볼륨 초기화 후 Flyway 재적용"
    log_db "  이전 해시: ${stored:0:12}... → 현재: ${current:0:12}..."
    docker compose down -v 2>/dev/null || true
    log_db "  mysql_data 볼륨 삭제 완료"
  else
    log_db "최초 배포 — BE 기동 시 Flyway가 스키마·시드를 적용합니다"
    log_db "  스키마 해시: ${current:0:12}..."
  fi

  mkdir -p "${DEPLOY_STATE_DIR}"
  echo "${current}" > "${MIGRATION_HASH_FILE}"
}

load_env() {
  # shellcheck source=/dev/null
  set -a && source <(sed 's/\r$//' "${ROOT}/.env") && set +a
}

mysql_exec() {
  local sql="$1"
  if ! docker ps --format '{{.Names}}' | grep -q '^ecoreport-mysql$'; then
    return 1
  fi
  docker exec ecoreport-mysql mysql \
    -u"${MYSQL_USER}" -p"${MYSQL_PASSWORD}" "${MYSQL_DATABASE:-energy_db}" \
    -N -e "${sql}" 2>/dev/null
}

print_flyway_from_be_logs() {
  log_db "Flyway (BE 컨테이너 로그):"
  local lines
  lines="$(docker compose logs be 2>/dev/null \
    | grep -iE 'Flyway|DbMigrate|Migrating schema|Successfully applied|Schema .* is up to date' \
    | tail -8 || true)"
  if [[ -z "${lines}" ]]; then
    log_db "  (아직 Flyway 로그 없음 — BE 기동 중일 수 있음)"
    return
  fi
  while IFS= read -r line; do
    log_db "  ${line#*| }"
  done <<< "${lines}"
}

report_db_status() {
  load_env

  if [[ -z "${MYSQL_USER:-}" || -z "${MYSQL_PASSWORD:-}" ]]; then
    log_db "MYSQL_USER/MYSQL_PASSWORD 미설정 — DB 상태 조회 생략"
    return
  fi

  if ! docker ps --format '{{.Names}}' | grep -q '^ecoreport-mysql$'; then
    log_db "MySQL 컨테이너 미실행 — DB 상태 조회 생략"
    return
  fi

  log_db "MySQL: ${MYSQL_DATABASE:-energy_db} @ ecoreport-mysql"

  local history
  history="$(mysql_exec "SELECT CONCAT('[', installed_rank, '] v', IFNULL(version,'R'), ' ', description, IF(success=1,' OK',' FAIL')) FROM flyway_schema_history ORDER BY installed_rank;" 2>/dev/null || true)"
  if [[ -n "${history}" ]]; then
    log_db "Flyway 적용 이력:"
    while IFS= read -r row; do
      log_db "  ${row}"
    done <<< "${history}"
  else
    log_db "Flyway 이력 없음 (BE 기동 전이거나 최초 migrate 대기 중)"
  fi

  local tables
  tables="$(mysql_exec "SHOW TABLES;" 2>/dev/null || true)"
  if [[ -n "${tables}" ]]; then
    log_db "테이블 ($(echo "${tables}" | wc -l | tr -d ' ')개): $(echo "${tables}" | paste -sd ', ' -)"
  fi

  local members affiliations locations
  members="$(mysql_exec "SELECT COUNT(*) FROM member_db;" 2>/dev/null || echo "?")"
  affiliations="$(mysql_exec "SELECT COUNT(*) FROM affiliation_db;" 2>/dev/null || echo "?")"
  locations="$(mysql_exec "SELECT COUNT(*) FROM location_node_db;" 2>/dev/null || echo "?")"
  log_db "시드 데이터: affiliation=${affiliations}, location_node=${locations}, member=${members}"
}

wait_for_be() {
  load_env
  # 서버 내부 헬스체크 — DEPLOY_PUBLIC_HOST 는 요약 URL 출력용만 사용
  local health_host="127.0.0.1"
  local port="${SERVER_PORT:-8080}"
  local attempt=0

  log "백엔드 준비 대기 (http://${health_host}:${port}/ping) — Flyway migrate 포함..."
  until curl -sf "http://${health_host}:${port}/ping" >/dev/null 2>&1; do
    attempt=$((attempt + 1))
    if (( attempt % 5 == 0 )); then
      log "  ... 대기 중 (${attempt}/60)"
    fi
    if [[ "${attempt}" -ge 60 ]]; then
      log "백엔드 기동 시간 초과 — 최근 로그:"
      docker compose logs --tail 40 be || true
      print_flyway_from_be_logs
      exit 1
    fi
    sleep 2
  done
  log "백엔드 OK"
  print_flyway_from_be_logs
  report_db_status
}

wait_for_fe() {
  load_env
  local health_host="127.0.0.1"
  local attempt=0

  log "프론트 준비 대기 (http://${health_host}:8081)..."
  until curl -sf "http://${health_host}:8081/" >/dev/null 2>&1; do
    attempt=$((attempt + 1))
    if [[ "${attempt}" -ge 30 ]]; then
      log "프론트 기동 시간 초과 — docker compose logs fe"
      exit 1
    fi
    sleep 2
  done
  log "프론트 OK"
}

smoke_test() {
  load_env
  local health_host="127.0.0.1"
  local port="${SERVER_PORT:-8080}"
  local response

  log "로그인 스모크 테스트 (admin)..."
  response="$(curl -sf -X POST "http://${health_host}:${port}/login" \
    -H 'Content-Type: application/json' \
    -d '{"userName":"admin","password":"admin1234!"}' 2>/dev/null || true)"

  if echo "${response}" | grep -q '"code":10001'; then
    log "로그인 OK"
  else
    log "로그인 스모크 테스트 실패 (BE 로그 확인: docker compose logs be)"
  fi
}

print_summary() {
  load_env
  local host="${DEPLOY_PUBLIC_HOST:-localhost}"
  local port="${SERVER_PORT:-8080}"

  echo ""
  echo "========================================"
  echo "  EcoReport 배포 완료"
  echo "========================================"
  echo "  FE       → http://${host}:8081"
  echo "  BE       → http://${host}:${port}"
  echo "  Swagger  → http://${host}:${port}/swagger-ui.html"
  echo "  Health   → http://${host}:${port}/actuator/health"
  echo ""
  echo "  더미 계정: admin / admin1234!  |  user / user1234!"
  echo ""
  echo "  로그 보기: docker compose logs -f"
  echo "  중지:      docker compose down"
  echo "  DB 초기화: docker compose down -v && bash deploy.sh"
  echo "========================================"
}

main() {
  ensure_env
  log_db "=== DB 배포 시작 ==="
  log_db_migration_files
  ensure_mysql_for_db_check
  maybe_reset_legacy_db
  maybe_reset_db_on_schema_change

  log "[1/2] 백엔드 (MySQL + Flyway + BE)..."
  bash "${ROOT}/be/deploy.sh"

  log "[2/2] 프론트..."
  bash "${ROOT}/fe/deploy.sh"

  wait_for_be
  wait_for_fe
  smoke_test
  log_db "=== DB 배포 완료 ==="
  print_summary
}

main "$@"

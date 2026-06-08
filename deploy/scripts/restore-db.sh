#!/usr/bin/env bash
set -euo pipefail

APP_DIR="${APP_DIR:-/opt/twenty}"
COMPOSE_FILE="${COMPOSE_FILE:-${APP_DIR}/docker-compose.yml}"
ENV_FILE="${ENV_FILE:-${APP_DIR}/.env}"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

log() {
  printf '[restore-db] %s\n' "$*"
}

if [ "$#" -ne 1 ]; then
  log "ERROR: Usage: $0 /absolute/path/to/dump.sql" >&2
  exit 1
fi

DUMP_FILE="$1"

if [ ! -s "${DUMP_FILE}" ]; then
  log "ERROR: Dump file does not exist or is empty: ${DUMP_FILE}" >&2
  exit 1
fi

if [ ! -f "${COMPOSE_FILE}" ]; then
  log "ERROR: Compose file not found: ${COMPOSE_FILE}" >&2
  exit 1
fi

if [ ! -f "${ENV_FILE}" ]; then
  log "ERROR: Env file not found: ${ENV_FILE}" >&2
  exit 1
fi

cd "${APP_DIR}"
DOCKER_COMPOSE=(docker compose --env-file "${ENV_FILE}" -f "${COMPOSE_FILE}")

start_application() {
  log "Starting application services"
  "${DOCKER_COMPOSE[@]}" up -d server worker
}

log "Creating safety backup before restore"
APP_DIR="${APP_DIR}" COMPOSE_FILE="${COMPOSE_FILE}" ENV_FILE="${ENV_FILE}" bash "${SCRIPT_DIR}/backup-db.sh"

log "Stopping application services before database restore"
"${DOCKER_COMPOSE[@]}" stop server worker || true
trap start_application EXIT

log "Restoring PostgreSQL database from ${DUMP_FILE}"
cat "${DUMP_FILE}" | "${DOCKER_COMPOSE[@]}" exec -T db sh -c '
  set -e
  db_name="${POSTGRES_DB:-default}"
  db_user="${POSTGRES_USER:-postgres}"

  psql -v ON_ERROR_STOP=1 -U "${db_user}" -d postgres -v dbname="${db_name}" -c \
    "SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname = :'dbname' AND pid <> pg_backend_pid();"

  dropdb -U "${db_user}" --if-exists "${db_name}"
  createdb -U "${db_user}" -O "${db_user}" "${db_name}"
  psql -v ON_ERROR_STOP=1 -U "${db_user}" -d "${db_name}"
'

log "Database restore completed"

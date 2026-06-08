#!/usr/bin/env bash
set -euo pipefail

APP_DIR="${APP_DIR:-/opt/twenty}"
COMPOSE_FILE="${COMPOSE_FILE:-${APP_DIR}/docker-compose.yml}"
ENV_FILE="${ENV_FILE:-${APP_DIR}/.env}"
BACKUP_DIR="${DB_BACKUP_DIR:-${APP_DIR}/backups/db}"
TIMESTAMP="$(date +%Y%m%d_%H%M%S)"
BACKUP_FILE="${BACKUP_DIR}/twenty_prod_${TIMESTAMP}.sql"

log() {
  printf '[backup-db] %s\n' "$*"
}

if [ ! -f "${COMPOSE_FILE}" ]; then
  log "ERROR: Compose file not found: ${COMPOSE_FILE}" >&2
  exit 1
fi

if [ ! -f "${ENV_FILE}" ]; then
  log "ERROR: Env file not found: ${ENV_FILE}" >&2
  exit 1
fi

mkdir -p "${BACKUP_DIR}"

cd "${APP_DIR}"
DOCKER_COMPOSE=(docker compose --env-file "${ENV_FILE}" -f "${COMPOSE_FILE}")

log "Ensuring database service is running"
"${DOCKER_COMPOSE[@]}" up -d db

if [ -z "$("${DOCKER_COMPOSE[@]}" ps -q db 2>/dev/null)" ]; then
  log "ERROR: Database container is not available. Start the Compose stack before running a DB backup." >&2
  exit 1
fi

log "Creating PostgreSQL backup at ${BACKUP_FILE}"
"${DOCKER_COMPOSE[@]}" exec -T db sh -c 'pg_dump -U "$POSTGRES_USER" -d "$POSTGRES_DB"' > "${BACKUP_FILE}"

if [ ! -s "${BACKUP_FILE}" ]; then
  log "ERROR: Backup file was not created or is empty: ${BACKUP_FILE}" >&2
  exit 1
fi

log "Backup created: ${BACKUP_FILE}"

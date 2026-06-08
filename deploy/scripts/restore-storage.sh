#!/usr/bin/env bash
set -euo pipefail

APP_DIR="${APP_DIR:-/opt/twenty}"
COMPOSE_FILE="${COMPOSE_FILE:-${APP_DIR}/docker-compose.yml}"
ENV_FILE="${ENV_FILE:-${APP_DIR}/.env}"
STORAGE_VOLUME="${STORAGE_VOLUME:-twenty_server-local-data}"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

log() {
  printf '[restore-storage] %s\n' "$*"
}

if [ "$#" -ne 1 ]; then
  log "ERROR: Usage: $0 /absolute/path/to/storage.tar.gz" >&2
  exit 1
fi

ARCHIVE_FILE="$(readlink -f "$1")"

if [ ! -f "${ARCHIVE_FILE}" ]; then
  log "ERROR: Storage archive does not exist: ${ARCHIVE_FILE}" >&2
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

ARCHIVE_DIR="$(dirname "${ARCHIVE_FILE}")"
ARCHIVE_BASENAME="$(basename "${ARCHIVE_FILE}")"

cd "${APP_DIR}"
DOCKER_COMPOSE=(docker compose --env-file "${ENV_FILE}" -f "${COMPOSE_FILE}")

start_application() {
  log "Starting application services"
  "${DOCKER_COMPOSE[@]}" up -d server worker
}

log "Creating safety backup before storage restore"
APP_DIR="${APP_DIR}" bash "${SCRIPT_DIR}/backup-storage.sh"

log "Stopping application services before storage restore"
"${DOCKER_COMPOSE[@]}" stop server worker || true
trap start_application EXIT

if ! docker volume inspect "${STORAGE_VOLUME}" >/dev/null 2>&1; then
  log "Storage volume does not exist; creating ${STORAGE_VOLUME}"
  docker volume create "${STORAGE_VOLUME}" >/dev/null
fi

log "Restoring storage archive ${ARCHIVE_FILE} into volume ${STORAGE_VOLUME}"
docker run --rm \
  -e ARCHIVE_BASENAME="${ARCHIVE_BASENAME}" \
  -v "${STORAGE_VOLUME}:/storage" \
  -v "${ARCHIVE_DIR}:/archive:ro" \
  alpine:3.20 \
  sh -c '
    set -e
    mkdir -p /tmp/restore
    tar -xzf "/archive/${ARCHIVE_BASENAME}" -C /tmp/restore

    rm -rf /storage/* /storage/.[!.]* /storage/..?* 2>/dev/null || true

    if [ -d /tmp/restore/.local-storage ]; then
      cp -a /tmp/restore/.local-storage/. /storage/
    elif [ -d /tmp/restore/local-storage ]; then
      cp -a /tmp/restore/local-storage/. /storage/
    else
      cp -a /tmp/restore/. /storage/
    fi
  '

log "Storage restore completed"

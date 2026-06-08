#!/usr/bin/env bash
set -euo pipefail

APP_DIR="${APP_DIR:-/opt/twenty}"
STORAGE_VOLUME="${STORAGE_VOLUME:-twenty_server-local-data}"
BACKUP_DIR="${STORAGE_BACKUP_DIR:-${APP_DIR}/backups/storage}"
TIMESTAMP="$(date +%Y%m%d_%H%M%S)"
BACKUP_FILE="${BACKUP_DIR}/twenty_storage_${TIMESTAMP}.tar.gz"

log() {
  printf '[backup-storage] %s\n' "$*"
}

mkdir -p "${BACKUP_DIR}"

if ! docker volume inspect "${STORAGE_VOLUME}" >/dev/null 2>&1; then
  log "WARNING: Storage volume does not exist, skipping storage backup: ${STORAGE_VOLUME}"
  exit 0
fi

log "Creating storage backup from volume ${STORAGE_VOLUME} at ${BACKUP_FILE}"
docker run --rm \
  -e BACKUP_NAME="$(basename "${BACKUP_FILE}")" \
  -v "${STORAGE_VOLUME}:/storage:ro" \
  -v "${BACKUP_DIR}:/backup" \
  alpine:3.20 \
  sh -c 'cd /storage && tar -czf "/backup/${BACKUP_NAME}" .'

if [ ! -s "${BACKUP_FILE}" ]; then
  log "ERROR: Storage backup file was not created or is empty: ${BACKUP_FILE}" >&2
  exit 1
fi

log "Storage backup created: ${BACKUP_FILE}"

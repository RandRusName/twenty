#!/usr/bin/env bash
set -euo pipefail

APP_DIR="${APP_DIR:-/opt/twenty}"
BACKUP_RETENTION_DAYS="${BACKUP_RETENTION_DAYS:-14}"
MIN_BACKUPS_TO_KEEP="${MIN_BACKUPS_TO_KEEP:-3}"
DB_BACKUP_DIR="${DB_BACKUP_DIR:-${APP_DIR}/backups/db}"
STORAGE_BACKUP_DIR="${STORAGE_BACKUP_DIR:-${APP_DIR}/backups/storage}"

log() {
  printf '[cleanup-backups] %s\n' "$*"
}

cleanup_directory() {
  backup_dir="$1"
  pattern="$2"

  if [ ! -d "${backup_dir}" ]; then
    log "Backup directory does not exist, skipping: ${backup_dir}"
    return
  fi

  mapfile -t backup_files < <(
    find "${backup_dir}" -maxdepth 1 -type f -name "${pattern}" -printf '%T@ %p\n' |
      sort -rn |
      cut -d ' ' -f 2-
  )

  for index in "${!backup_files[@]}"; do
    backup_file="${backup_files[$index]}"

    if [ "${index}" -lt "${MIN_BACKUPS_TO_KEEP}" ]; then
      log "Keeping recent backup: ${backup_file}"
      continue
    fi

    if [ -n "$(find "${backup_file}" -maxdepth 0 -type f -mtime +"${BACKUP_RETENTION_DAYS}" -print)" ]; then
      log "Deleting old backup: ${backup_file}"
      rm -f "${backup_file}"
    else
      log "Keeping backup within retention window: ${backup_file}"
    fi
  done
}

if ! [[ "${BACKUP_RETENTION_DAYS}" =~ ^[0-9]+$ ]]; then
  log "ERROR: BACKUP_RETENTION_DAYS must be a non-negative integer" >&2
  exit 1
fi

if ! [[ "${MIN_BACKUPS_TO_KEEP}" =~ ^[0-9]+$ ]]; then
  log "ERROR: MIN_BACKUPS_TO_KEEP must be a non-negative integer" >&2
  exit 1
fi

cleanup_directory "${DB_BACKUP_DIR}" 'twenty_prod_*.sql'
cleanup_directory "${STORAGE_BACKUP_DIR}" 'twenty_storage_*.tar.gz'

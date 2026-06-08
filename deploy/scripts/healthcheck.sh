#!/usr/bin/env bash
set -euo pipefail

APP_DIR="${APP_DIR:-/opt/twenty}"
ENV_FILE="${ENV_FILE:-${APP_DIR}/.env}"
RETRIES="${HEALTHCHECK_RETRIES:-30}"
SLEEP_SECONDS="${HEALTHCHECK_SLEEP_SECONDS:-5}"

log() {
  printf '[healthcheck] %s\n' "$*"
}

if [ ! -f "${ENV_FILE}" ]; then
  log "ERROR: Env file not found: ${ENV_FILE}" >&2
  exit 1
fi

SERVER_URL="$(
  grep -E '^SERVER_URL=' "${ENV_FILE}" | tail -n 1 | cut -d '=' -f 2- | sed -e 's/^"//' -e 's/"$//' -e "s/^'//" -e "s/'$//"
)"

if [ -z "${SERVER_URL}" ]; then
  log "ERROR: SERVER_URL is not set in ${ENV_FILE}" >&2
  exit 1
fi

HEALTH_URL="${SERVER_URL%/}/healthz"
log "Checking ${HEALTH_URL}"

for attempt in $(seq 1 "${RETRIES}"); do
  if curl --fail --silent --show-error --max-time 10 "${HEALTH_URL}" >/dev/null; then
    log "CRM is healthy"
    exit 0
  fi

  log "Healthcheck attempt ${attempt}/${RETRIES} failed; retrying in ${SLEEP_SECONDS}s"
  sleep "${SLEEP_SECONDS}"
done

log "ERROR: CRM did not become healthy after ${RETRIES} attempts" >&2
exit 1

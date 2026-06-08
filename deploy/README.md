# Twenty Production Deploy With Jenkins

This deployment flow is for a self-hosted Twenty CRM running on a production VPS with Jenkins and Docker Compose. Normal deploys build and update the application image only; production PostgreSQL data and local storage stay in Docker named volumes.

## Production deploy

Prepare the VPS:

```bash
sudo mkdir -p /opt/twenty/backups/db /opt/twenty/backups/storage /opt/twenty/migration /opt/twenty/releases
sudo chown -R jenkins:jenkins /opt/twenty
docker --version
docker compose version
sudo usermod -aG docker jenkins
```

Restart the Jenkins agent/session after adding the `jenkins` user to the `docker` group.

Create a Jenkins secret file credential named `twenty-production-env` with the production `.env` contents. Keep this file out of git. For the bundled PostgreSQL and Redis services, a minimal production file looks like this:

```env
SERVER_URL=https://crm.example.com
TAG=latest

PG_DATABASE_USER=postgres
PG_DATABASE_PASSWORD=replace-with-a-strong-password
PG_DATABASE_NAME=default
PG_DATABASE_URL=postgres://postgres:replace-with-a-strong-password@db:5432/default
REDIS_URL=redis://redis:6379

APP_SECRET=replace-with-a-random-secret
ENCRYPTION_KEY=replace-with-a-random-secret
FALLBACK_ENCRYPTION_KEY=

STORAGE_TYPE=local
STORAGE_LOCAL_PATH=.local-storage

# Enable all enterprise features without a license key
IS_ENTERPRISE_ENABLED=true
```

Generate secrets with commands such as:

```bash
openssl rand -base64 32
openssl rand -hex 32
```

Run the Jenkins job with:

```text
DEPLOY_ENV=production
RUN_LOCAL_DATA_MIGRATION=false
APP_TAG=<release-or-commit-tag>
PROD_ENV_CREDENTIAL_ID=twenty-production-env
APP_DIR=/opt/twenty
BACKUP_RETENTION_DAYS=14
```

The pipeline builds `twenty-local:${APP_TAG}` from the checked-out repository, copies `deploy/docker-compose.prod.yml` to `/opt/twenty/docker-compose.yml`, installs `/opt/twenty/.env` from the Jenkins credential, runs a pre-deploy DB backup when a DB container already exists, and deploys with:

```bash
cd /opt/twenty
docker compose --env-file .env -f docker-compose.yml up -d --remove-orphans
```

Verify production:

```bash
cd /opt/twenty
docker compose ps
curl -f "$(grep '^SERVER_URL=' .env | cut -d= -f2-)/healthz"
```

## One-time local migration

Use this only once to move data from the local CRM to production. Do not implement or use a CRM UI button for this; this is an infrastructure-level PostgreSQL dump/restore plus local storage archive restore.

1. Stop local CRM writes or put the local CRM into a maintenance window.
2. Create a local PostgreSQL dump.
3. Create a local storage archive if `STORAGE_TYPE=local` is used.
4. Upload the dump and optional archive to the VPS.
5. Run Jenkins with `RUN_LOCAL_DATA_MIGRATION=true`.
6. Verify production data in the CRM.
7. Confirm `/opt/twenty/migration/local-data-imported.marker` exists.

Example local DB dump:

```bash
docker exec twenty-postgres pg_dump -U postgres twenty > twenty_local_backup.sql
```

Example local storage archive:

```bash
tar -czf twenty_local_storage.tar.gz .local-storage
```

Real paths, database names, and container names may differ. Check your local setup first:

```bash
docker ps
docker compose ps
docker volume ls
```

Upload artifacts to the VPS:

```bash
scp twenty_local_backup.sql user@production-vps:/opt/twenty/migration/
scp twenty_local_storage.tar.gz user@production-vps:/opt/twenty/migration/
```

Run Jenkins with:

```text
RUN_LOCAL_DATA_MIGRATION=true
LOCAL_DB_DUMP_PATH=/opt/twenty/migration/twenty_local_backup.sql
LOCAL_STORAGE_ARCHIVE_PATH=/opt/twenty/migration/twenty_local_storage.tar.gz
FORCE_LOCAL_DATA_MIGRATION=false
```

The pipeline refuses to run migration again after `/opt/twenty/migration/local-data-imported.marker` exists. Set `FORCE_LOCAL_DATA_MIGRATION=true` only when you intentionally want to overwrite production data from another dump.

## Rollback

Application rollback and data rollback are different operations. Redeploying an older image does not restore the database or uploaded files. Restoring database/storage backups does not change the application image.

Restore production DB from a backup:

```bash
APP_DIR=/opt/twenty bash /opt/twenty/releases/current/deploy/scripts/restore-db.sh \
  /opt/twenty/backups/db/twenty_prod_YYYYMMDD_HHMMSS.sql
```

Restore local storage from a backup:

```bash
APP_DIR=/opt/twenty bash /opt/twenty/releases/current/deploy/scripts/restore-storage.sh \
  /opt/twenty/backups/storage/twenty_storage_YYYYMMDD_HHMMSS.tar.gz
```

Check the service after rollback:

```bash
APP_DIR=/opt/twenty bash /opt/twenty/releases/current/deploy/scripts/healthcheck.sh
```

Backup cleanup keeps the newest 3 DB backups and newest 3 storage backups even when they are older than the retention window:

```bash
APP_DIR=/opt/twenty BACKUP_RETENTION_DAYS=14 \
  bash /opt/twenty/releases/current/deploy/scripts/cleanup-backups.sh
```

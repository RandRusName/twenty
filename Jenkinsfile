pipeline {
  agent any

  options {
    timestamps()
    disableConcurrentBuilds()
  }

  parameters {
    string(name: 'DEPLOY_ENV', defaultValue: 'production', description: 'Deployment environment. Only production is supported by this pipeline.')
    booleanParam(name: 'RUN_LOCAL_DATA_MIGRATION', defaultValue: false, description: 'Run the protected one-time local PostgreSQL/storage migration.')
    string(name: 'LOCAL_DB_DUMP_PATH', defaultValue: '', description: 'Absolute path to a local PostgreSQL dump already uploaded to the production VPS.')
    string(name: 'LOCAL_STORAGE_ARCHIVE_PATH', defaultValue: '', description: 'Optional absolute path to a local storage .tar.gz archive already uploaded to the production VPS.')
    string(name: 'APP_TAG', defaultValue: '', description: 'Docker image tag to build and deploy. Defaults to the checked-out git commit.')
    booleanParam(name: 'FORCE_LOCAL_DATA_MIGRATION', defaultValue: false, description: 'Allow migration even when the local-data marker already exists.')
    string(name: 'PROD_ENV_CREDENTIAL_ID', defaultValue: 'twenty-production-env', description: 'Jenkins secret file credential id containing the production .env file.')
    string(name: 'APP_DIR', defaultValue: '/opt/twenty', description: 'Production application directory on the VPS.')
    string(name: 'BACKUP_RETENTION_DAYS', defaultValue: '14', description: 'Delete backups older than this many days, while keeping the newest 3 of each type.')
  }

  environment {
    TWENTY_IMAGE = 'twenty-local'
  }

  stages {
    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('Validate parameters') {
      steps {
        script {
          env.APP_DIR_VALUE = params.APP_DIR.trim()
          env.BACKUP_RETENTION_DAYS_VALUE = params.BACKUP_RETENTION_DAYS.trim()
          env.GIT_COMMIT_SHORT = sh(script: 'git rev-parse --short=12 HEAD', returnStdout: true).trim()
          env.EFFECTIVE_TAG = params.APP_TAG.trim() ? params.APP_TAG.trim() : env.GIT_COMMIT_SHORT
          env.RELEASE_DIR_VALUE = "${env.APP_DIR_VALUE}/releases/${env.BUILD_NUMBER}-${env.GIT_COMMIT_SHORT}"
          env.CURRENT_RELEASE_VALUE = "${env.APP_DIR_VALUE}/releases/current"

          if (params.DEPLOY_ENV.trim() != 'production') {
            error("Unsupported DEPLOY_ENV='${params.DEPLOY_ENV}'. This Jenkinsfile only deploys production.")
          }

          if (!env.APP_DIR_VALUE.startsWith('/')) {
            error('APP_DIR must be an absolute path.')
          }

          if (!(env.EFFECTIVE_TAG ==~ /^[A-Za-z0-9_.-]{1,128}$/)) {
            error('APP_TAG must be a valid Docker tag: 1-128 chars using letters, numbers, underscore, dot, or dash.')
          }

          if (!(env.BACKUP_RETENTION_DAYS_VALUE ==~ /^[0-9]+$/)) {
            error('BACKUP_RETENTION_DAYS must be a positive integer.')
          }

          if (params.RUN_LOCAL_DATA_MIGRATION && !params.LOCAL_DB_DUMP_PATH.trim()) {
            error('LOCAL_DB_DUMP_PATH is required when RUN_LOCAL_DATA_MIGRATION=true.')
          }

          if (params.FORCE_LOCAL_DATA_MIGRATION && !params.RUN_LOCAL_DATA_MIGRATION) {
            error('FORCE_LOCAL_DATA_MIGRATION can only be used together with RUN_LOCAL_DATA_MIGRATION=true.')
          }
        }

        sh '''
          set -euo pipefail

          if [ "${RUN_LOCAL_DATA_MIGRATION}" = "true" ]; then
            if [ ! -s "${LOCAL_DB_DUMP_PATH}" ]; then
              echo "ERROR: LOCAL_DB_DUMP_PATH does not exist or is empty: ${LOCAL_DB_DUMP_PATH}" >&2
              exit 1
            fi

            if [ -n "${LOCAL_STORAGE_ARCHIVE_PATH}" ] && [ ! -f "${LOCAL_STORAGE_ARCHIVE_PATH}" ]; then
              echo "ERROR: LOCAL_STORAGE_ARCHIVE_PATH does not exist: ${LOCAL_STORAGE_ARCHIVE_PATH}" >&2
              exit 1
            fi
          fi
        '''
      }
    }

    stage('Prepare release directory') {
      steps {
        sh '''
          set -euo pipefail

          echo "Preparing production directories under ${APP_DIR_VALUE}"
          mkdir -p \
            "${APP_DIR_VALUE}/backups/db" \
            "${APP_DIR_VALUE}/backups/storage" \
            "${APP_DIR_VALUE}/migration" \
            "${APP_DIR_VALUE}/releases"

          rm -rf "${RELEASE_DIR_VALUE}"
          mkdir -p "${RELEASE_DIR_VALUE}"

          echo "Copying workspace to ${RELEASE_DIR_VALUE}"
          tar \
            --exclude='./.git' \
            --exclude='./.env' \
            --exclude='*/.env' \
            --exclude='./node_modules' \
            --exclude='./.nx' \
            --exclude='./.swc' \
            -cf - . | tar -xf - -C "${RELEASE_DIR_VALUE}"

          ln -sfnT "${RELEASE_DIR_VALUE}" "${CURRENT_RELEASE_VALUE}"
          chmod +x "${CURRENT_RELEASE_VALUE}"/deploy/scripts/*.sh

          cp "${CURRENT_RELEASE_VALUE}/deploy/docker-compose.prod.yml" "${APP_DIR_VALUE}/docker-compose.yml"
        '''
      }
    }

    stage('Create / update .env on server') {
      steps {
        script {
          withCredentials([file(credentialsId: params.PROD_ENV_CREDENTIAL_ID.trim(), variable: 'PROD_ENV_FILE')]) {
            sh '''
              set -euo pipefail

              ENV_FILE="${APP_DIR_VALUE}/.env"
              echo "Installing production .env from Jenkins file credential into ${ENV_FILE}"
              install -m 600 "${PROD_ENV_FILE}" "${ENV_FILE}"

              upsert_env_value() {
                key="$1"
                value="$2"
                tmp_file="$(mktemp)"

                if [ -f "${ENV_FILE}" ]; then
                  grep -v "^${key}=" "${ENV_FILE}" > "${tmp_file}" || true
                fi

                printf '%s=%s\n' "${key}" "${value}" >> "${tmp_file}"
                install -m 600 "${tmp_file}" "${ENV_FILE}"
                rm -f "${tmp_file}"
              }

              upsert_env_value "TAG" "${EFFECTIVE_TAG}"
              upsert_env_value "TWENTY_IMAGE" "${TWENTY_IMAGE}"
              upsert_env_value "TWENTY_BUILD_CONTEXT" "${CURRENT_RELEASE_VALUE}"
            '''
          }
        }
      }
    }

    stage('Pull Docker images / build if needed') {
      steps {
        sh '''
          set -euo pipefail

          echo "Pulling base services declared by Docker Compose"
          cd "${APP_DIR_VALUE}"
          docker compose --env-file .env -f docker-compose.yml pull db redis || true

          echo "Building Twenty image ${TWENTY_IMAGE}:${EFFECTIVE_TAG} from ${CURRENT_RELEASE_VALUE}"
          docker build \
            --target twenty \
            -f "${CURRENT_RELEASE_VALUE}/packages/twenty-docker/twenty/Dockerfile" \
            -t "${TWENTY_IMAGE}:${EFFECTIVE_TAG}" \
            "${CURRENT_RELEASE_VALUE}"
        '''
      }
    }

    stage('Backup current production database') {
      steps {
        sh '''
          set -euo pipefail

          cd "${APP_DIR_VALUE}"
          if docker compose --env-file .env -f docker-compose.yml ps -a -q db >/dev/null 2>&1 && \
             [ -n "$(docker compose --env-file .env -f docker-compose.yml ps -a -q db 2>/dev/null)" ]; then
            echo "Ensuring production database container is running for backup"
            docker compose --env-file .env -f docker-compose.yml up -d db
            echo "Creating pre-deploy database backup"
            APP_DIR="${APP_DIR_VALUE}" bash "${CURRENT_RELEASE_VALUE}/deploy/scripts/backup-db.sh"
          else
            echo "No existing production database container found; skipping pre-deploy backup for initial deployment."
          fi
        '''
      }
    }

    stage('Deploy application') {
      steps {
        sh '''
          set -euo pipefail

          echo "Deploying Twenty with Docker Compose"
          cd "${APP_DIR_VALUE}"
          docker compose --env-file .env -f docker-compose.yml up -d --remove-orphans
        '''
      }
    }

    stage('Optional one-time local data migration') {
      when {
        expression {
          return params.RUN_LOCAL_DATA_MIGRATION
        }
      }
      steps {
        sh '''
          set -euo pipefail

          MARKER_FILE="${APP_DIR_VALUE}/migration/local-data-imported.marker"

          if [ -f "${MARKER_FILE}" ] && [ "${FORCE_LOCAL_DATA_MIGRATION}" != "true" ]; then
            echo "ERROR: local data migration marker already exists: ${MARKER_FILE}" >&2
            echo "ERROR: Refusing to overwrite production data. Set FORCE_LOCAL_DATA_MIGRATION=true only if this is intentional." >&2
            exit 1
          fi

          if [ -f "${MARKER_FILE}" ] && [ "${FORCE_LOCAL_DATA_MIGRATION}" = "true" ]; then
            echo "WARNING: FORCE_LOCAL_DATA_MIGRATION=true. Existing production data will be overwritten from the supplied dump."
          fi

          echo "Backing up production database before local data migration"
          APP_DIR="${APP_DIR_VALUE}" bash "${CURRENT_RELEASE_VALUE}/deploy/scripts/backup-db.sh"

          echo "Backing up production storage before local data migration"
          APP_DIR="${APP_DIR_VALUE}" bash "${CURRENT_RELEASE_VALUE}/deploy/scripts/backup-storage.sh"

          echo "Restoring production database from ${LOCAL_DB_DUMP_PATH}"
          APP_DIR="${APP_DIR_VALUE}" bash "${CURRENT_RELEASE_VALUE}/deploy/scripts/restore-db.sh" "${LOCAL_DB_DUMP_PATH}"

          if [ -n "${LOCAL_STORAGE_ARCHIVE_PATH}" ]; then
            echo "Restoring production storage from ${LOCAL_STORAGE_ARCHIVE_PATH}"
            APP_DIR="${APP_DIR_VALUE}" bash "${CURRENT_RELEASE_VALUE}/deploy/scripts/restore-storage.sh" "${LOCAL_STORAGE_ARCHIVE_PATH}"
          else
            echo "No LOCAL_STORAGE_ARCHIVE_PATH provided; skipping storage restore."
          fi

          {
            echo "migration_date=$(date -u +%Y-%m-%dT%H:%M:%SZ)"
            echo "local_db_dump_path=${LOCAL_DB_DUMP_PATH}"
            echo "local_storage_archive_path=${LOCAL_STORAGE_ARCHIVE_PATH}"
            echo "git_commit=${GIT_COMMIT}"
            echo "git_commit_short=${GIT_COMMIT_SHORT}"
            echo "jenkins_build_number=${BUILD_NUMBER}"
            echo "jenkins_build_url=${BUILD_URL:-}"
            echo "forced=${FORCE_LOCAL_DATA_MIGRATION}"
          } > "${MARKER_FILE}"

          chmod 600 "${MARKER_FILE}"
          echo "Created migration marker: ${MARKER_FILE}"
        '''
      }
    }

    stage('Run health checks') {
      steps {
        sh '''
          set -euo pipefail

          APP_DIR="${APP_DIR_VALUE}" bash "${CURRENT_RELEASE_VALUE}/deploy/scripts/healthcheck.sh"
        '''
      }
    }

    stage('Cleanup old backups') {
      steps {
        sh '''
          set -euo pipefail

          APP_DIR="${APP_DIR_VALUE}" BACKUP_RETENTION_DAYS="${BACKUP_RETENTION_DAYS_VALUE}" \
            bash "${CURRENT_RELEASE_VALUE}/deploy/scripts/cleanup-backups.sh"
        '''
      }
    }
  }
}

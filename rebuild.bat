@echo off
setlocal EnableExtensions

rem Twenty CRM - rebuild and restart Docker Compose containers on Windows.
rem
rem Usage:
rem   rebuild.bat              rebuild and restart local self-host containers
rem   rebuild.bat --reset      same as above, but wipe compose volumes first
rem   rebuild.bat --no-cache   rebuild Docker images without cache
rem   rebuild.bat --check      validate selected compose file and exit

cd /d "%~dp0"

set "COMPOSE_FILE=packages\twenty-docker\docker-compose.dev-full.yml"
set "COMPOSE_NAME=local self-host"
set "RESET_VOLUMES=0"
set "NO_CACHE=0"
set "CHECK_ONLY=0"
set "HELP_EXIT_CODE=0"

call :parse_args %*
if errorlevel 2 exit /b 0
if errorlevel 1 exit /b 1

echo.
echo === Twenty Docker rebuild ===
echo Compose: %COMPOSE_NAME%
echo File:    %COMPOSE_FILE%
echo.

docker compose version >nul 2>&1
if errorlevel 1 (
  echo ERROR: Docker Compose is not available. Start Docker Desktop and try again.
  exit /b 1
)

echo === [1/5] Checking compose file ===
docker compose -f "%COMPOSE_FILE%" config --quiet
if errorlevel 1 goto :error

if "%CHECK_ONLY%"=="1" (
  echo Compose file is valid.
  exit /b 0
)

echo.
echo === [2/5] Removing old manual containers, if any ===
docker stop twenty_pg twenty_redis >nul 2>&1
docker rm twenty_pg twenty_redis >nul 2>&1

echo.
if "%RESET_VOLUMES%"=="1" (
  echo === [3/5] Stopping compose stack and removing volumes ===
  docker compose -f "%COMPOSE_FILE%" down --remove-orphans -v
) else (
  echo === [3/5] Stopping compose stack ===
  docker compose -f "%COMPOSE_FILE%" down --remove-orphans
)
if errorlevel 1 goto :error

echo.
if "%NO_CACHE%"=="1" (
  echo === [4/5] Building images without cache ===
  docker compose -f "%COMPOSE_FILE%" build --no-cache
) else (
  echo === [4/5] Building images ===
  docker compose -f "%COMPOSE_FILE%" build
)
if errorlevel 1 goto :error

echo.
echo === [5/5] Starting containers ===
docker compose -f "%COMPOSE_FILE%" up -d --force-recreate --remove-orphans
if errorlevel 1 goto :error

echo.
echo === Docker status ===
docker compose -f "%COMPOSE_FILE%" ps

echo.
echo === Done ===
echo Frontend/Backend: http://localhost:3000
echo GraphQL:          http://localhost:3000/graphql
echo Postgres:         localhost:5433
echo Redis:            localhost:6379
exit /b 0

:parse_args
if "%~1"=="" exit /b 0

if /I "%~1"=="--reset" (
  set "RESET_VOLUMES=1"
  shift
  goto :parse_args
)

if /I "%~1"=="--dev" (
  set "COMPOSE_FILE=packages\twenty-docker\docker-compose.dev-full.yml"
  set "COMPOSE_NAME=local self-host"
  shift
  goto :parse_args
)

if /I "%~1"=="--no-cache" (
  set "NO_CACHE=1"
  shift
  goto :parse_args
)

if /I "%~1"=="--check" (
  set "CHECK_ONLY=1"
  shift
  goto :parse_args
)

if /I "%~1"=="--help" goto :help
if /I "%~1"=="-h" goto :help

echo ERROR: Unknown argument: %~1
echo.
set "HELP_EXIT_CODE=1"
goto :help

:help
echo Usage:
echo   rebuild.bat              rebuild and restart local self-host containers
echo   rebuild.bat --reset      wipe compose volumes before starting
echo   rebuild.bat --no-cache   rebuild Docker images without cache
echo   rebuild.bat --check      validate selected compose file and exit
echo.
if "%HELP_EXIT_CODE%"=="0" exit /b 2
exit /b %HELP_EXIT_CODE%

:error
echo.
echo Rebuild failed. Check the messages above.
exit /b 1

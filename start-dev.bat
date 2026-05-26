@echo off
setlocal EnableExtensions

rem Twenty CRM — start dev servers on Windows (workaround when "npx nx start" hangs on Nx daemon)
rem Opens three terminals: API, frontend, background worker.

cd /d "%~dp0"

start "twenty-server" cmd /k "cd /d %~dp0packages\twenty-server && set NODE_ENV=development&& npx nest start --watch"
start "twenty-front" cmd /k "cd /d %~dp0packages\twenty-front && npx vite"
start "twenty-worker" cmd /k "cd /d %~dp0packages\twenty-server && set NODE_ENV=development&& npx nest start --watch --entryFile queue-worker/queue-worker"

echo Started server, frontend, and worker in separate windows.
echo Frontend: http://localhost:3001
echo Backend:  http://localhost:3000
exit /b 0

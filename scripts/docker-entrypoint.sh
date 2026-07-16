#!/bin/sh
set -e

if [ "${RUN_MIGRATIONS:-true}" = "true" ] && [ -n "${DATABASE_URL:-}" ]; then
  echo "[entrypoint] Running prisma migrate deploy..."
  npx prisma migrate deploy
  echo "[entrypoint] Migrations complete."
else
  echo "[entrypoint] Skipping migrations (RUN_MIGRATIONS=${RUN_MIGRATIONS:-unset}, DATABASE_URL set=$([ -n "${DATABASE_URL:-}" ] && echo yes || echo no))."
fi

exec "$@"

# AGENTS.md — SISDROG

Repo layout: FastAPI backend (`backend/`) + React Native Windows desktop frontend (`frontend/`), orchestrated by root `docker-compose.yml`.

## Quick start

```powershell
# From repo root — backend, Postgres, and Metro bundler only
docker-compose up --build -d

# From frontend/ on the Windows host — install deps and run the native desktop app
pnpm install
pnpm run windows
```

- Backend docs: http://localhost:8000/docs
- Metro bundler: http://localhost:8081
- Postgres: localhost:5432 (`postgres/postgres`, DB `pharmacy_db`)

## Frontend (React Native Windows)

- **Windows-only desktop app.** It does not run in a browser and cannot build inside the Linux Docker container. The container only runs Metro/lint/tests.
- **Requires Visual Studio 2022** with workloads:
  - *Desarrollo para la plataforma universal de Windows (UWP)*
  - *Desarrollo de escritorio con C++*
  - *Windows 10/11 SDK*
- **Package manager is pnpm.** `packageManager` is pinned to `pnpm@11.5.2`; do not use npm/yarn.
- Entry point is `frontend/App.tsx` (not under `src/`). `src/` uses MVC: `config/`, `models/`, `services/`, `controllers/`, `views/`.
- `src/config/constants.ts` has `DEMO_MODE = true` by default — controllers may use mock data instead of hitting the backend. Toggle to `false` to use real API calls.
- Useful commands (run inside `frontend/`):
  - `pnpm start` — Metro bundler
  - `pnpm run windows` — build and launch the native Windows app
  - `pnpm exec tsc --noEmit` — typecheck
  - `pnpm run lint` — ESLint
  - `pnpm test` — Jest
- Jest config (`jest.config.js`) has custom `transformIgnorePatterns` to handle pnpm symlinks. Don't simplify it blindly.

## Backend (FastAPI + SQLAlchemy + Alembic)

- Entry: `backend/app/main.py`. Runs with `uvicorn app.main:app --reload` inside Docker on port `8000`.
- Only the `auth` router is currently wired into `main.py`. Other modules exist under `app/modules/` but are not mounted yet.
- DB config is read from `backend/.env` via Pydantic settings. `DATABASE_URL=postgresql://postgres:postgres@db:5432/pharmacy_db`.
- Migrations use Alembic. `alembic.ini` and `alembic/env.py` are configured for the Docker Postgres service (`db`).
- **Autogenerate caveat:** `alembic/env.py` only imports `User` from `app.modules.auth.model`. Import new models there or autogenerate will miss tables.
- Run migrations from inside the backend container (or a local venv with deps installed):
  ```bash
  alembic upgrade head
  alembic revision --autogenerate -m "description"
  ```

## Docker / ops notes

- Containers: `pharmacy_backend`, `pharmacy_db`, `pharmacy_frontend`.
- The `frontend` container is for dev tooling/Metro; it does **not** produce a runnable Windows app.
- Rebuild clean: `docker-compose up --build --force-recreate -d`
- View backend logs: `docker logs -f pharmacy_backend`
- Database persists in the named volume `postgres_data` across `docker-compose down`.

## Verification order before committing frontend changes

1. `pnpm exec tsc --noEmit`
2. `pnpm run lint`
3. `pnpm test`

## Repo-specific conventions

- Spanish variable names and comments are common; keep new code consistent with surrounding files.
- `backend/.env` is committed and used for local Docker defaults. Do not put real secrets there.
- No CI, pre-commit hooks, or task runners are currently configured.

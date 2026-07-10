# SyncSpace

A workspace for organizing notes, links, and code snippets into **spaces** —
create a space, fill it with tagged content, invite collaborators with
view/edit permissions, and find anything instantly with search.

- **Live app**: React 19 + TypeScript, Redux Toolkit, Tailwind CSS v4
- **API**: FastAPI + SQLAlchemy (async) + PostgreSQL + Redis, JWT cookie auth

## Features

- **Spaces** — create, rename, delete; each tracks real item/member counts
- **Content** — notes, links, and code snippets with tagging and client-side
  tag/type filtering
- **Sharing** — invite collaborators by email with `view` or `edit`
  permission; only the space owner manages access, editors can create/edit/
  delete content, viewers are read-only
- **Search** — across your own and shared spaces' names and content
- **Accounts** — signup/login/logout (JWT access + refresh cookies), profile
  and password changes while logged in
- **Redis caching** — content reads are cached per space/type with proper
  invalidation on writes

## Project structure

```
client/   React + Vite frontend (Redux Toolkit, Tailwind v4, Axios)
server/   FastAPI backend (router → service → DAO layering, Alembic migrations)
```

Backend request flow: **router** (HTTP/validation) → **service** (business
rules, authorization) → **DAO** (SQLAlchemy queries). Frontend state lives in
Redux slices under `client/src/features/*`, with a small `atoms/` design-system
layer (`Button`, `Card`, `Modal`, `Badge`, `Avatar`, `EmptyState`, `Input`) in
`client/src/components/atoms`.

## Getting started

### Prerequisites

- Node.js 20+ and npm
- Python 3.11+ and [Poetry](https://python-poetry.org/)
- PostgreSQL and Redis (or Docker, see below)

### Quickest path: Docker Compose

```bash
docker compose up -d postgres redis   # local Postgres + Redis only
cd server && cp .env.example .env     # fill in SECRET_KEY at minimum
poetry install
poetry run alembic upgrade head
poetry run uvicorn src.server.main:app --reload   # http://localhost:8000

cd ../client && cp .env.example .env  # defaults work for local dev
npm install
npm run dev                            # http://localhost:5173
```

API docs are served at `http://localhost:8000/docs` while the server runs.

### Manual setup

**Backend** (`server/`):

1. `cp server/.env.example server/.env` and fill in `DATABASE_URL`,
   `SECRET_KEY`, and `REDISCLOUD_URL` (a running Redis instance is required —
   content caching depends on it).
2. `poetry install`
3. `poetry run alembic upgrade head`
4. `poetry run uvicorn src.server.main:app --reload`

**Frontend** (`client/`):

1. `cp client/.env.example client/.env` — `VITE_BACKEND_URL` defaults to
   `http://localhost:8000` if unset, which matches the backend above.
2. `npm install`
3. `npm run dev`

## Environment variables

There is no repo-root `.env` — each side reads its own:

- [`server/.env.example`](server/.env.example) — database, Redis, JWT secret,
  CORS origins
- [`client/.env.example`](client/.env.example) — API origin

## Common commands

```bash
# Client (from client/)
npm run dev      # start dev server
npm run build    # tsc -b && vite build
npm run lint      # eslint

# Server (from server/)
poetry run uvicorn src.server.main:app --reload   # start API
poetry run pytest                                  # run tests
poetry run alembic upgrade head                     # apply migrations
poetry run alembic revision -m "message"            # new migration
```

`make help` at the repo root lists Docker Compose shortcuts (`make dev`,
`make logs`, `make clean`, etc.) if you prefer running everything in
containers.

## Deployment

The frontend and API deploy separately — there's no single "run this repo"
target.

- **Frontend → Vercel**: `client/vercel.json` is already configured with SPA
  rewrites. Set `VITE_BACKEND_URL` in the Vercel project to your deployed
  API's origin.
- **API → any container host** (Render, Railway, Fly, etc. — `server/Dockerfile`
  is ready). Set `ENVIRONMENT=production` and `ALLOW_ORIGINS` to your exact
  frontend origin.

Two things that matter once frontend and API are on different domains:

1. `ENVIRONMENT=production` switches auth cookies to `Secure` + `SameSite=None`,
   which cross-origin requests require — without it, login appears to
   succeed but every subsequent request comes back unauthenticated.
2. `ALLOW_ORIGINS` must list your frontend's exact deployed origin, or the
   browser blocks the requests via CORS.

## Tech stack

| | |
|---|---|
| Frontend | React 19, TypeScript, Vite, Redux Toolkit, React Router, Tailwind CSS v4, Axios |
| Backend | FastAPI, SQLAlchemy 2 (async), PostgreSQL (asyncpg), Redis, Alembic, Pydantic, JWT (python-jose), Passlib/bcrypt |

# Altair — Real-Time Collaborative IDE

Phase 1 foundation from [plan.md](./plan.md): monorepo, Next.js, Fastify, PostgreSQL, Drizzle, Redis, Docker.

## Quick start

```bash
cp .env.example .env
pnpm setup          # install + start postgres/redis + migrate
pnpm dev            # web :3000, api :3001, collaboration :3002, worker
```

Open http://localhost:3000 — the status panel checks API, Postgres, Redis, and the collaboration WebSocket.

> **Note:** Postgres maps to host port **5433** (5432 is often taken by other local projects).

## Structure

```
apps/
  web/              Next.js + Tailwind + Zustand
  api/              Fastify HTTP API
  collaboration/    WebSocket stub (Yjs in Phase 7)
  worker/           BullMQ stub (execution in Phase 9)
packages/
  config/           Zod-validated env
  database/         Drizzle schema + migrations
  types/            Shared TypeScript types
  validation/       Zod request schemas
  logger/           Pino
  auth/             Phase 2 placeholder
```

## Scripts

| Command | Description |
|---|---|
| `pnpm dev` | Run all apps via Turborepo |
| `pnpm db:up` | Start Postgres + Redis (Docker) |
| `pnpm db:migrate` | Apply Drizzle migrations |
| `pnpm db:studio` | Drizzle Studio |
| `pnpm typecheck` | Typecheck all packages |

## Phase 1 deliverable

Application boots locally with one command after `pnpm setup`.

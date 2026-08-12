# Sho Music 2.0

**AI-native music infrastructure and listening platform**

> "If Sho does not control it, Sho must be able to replace it."

## Status (August 12, 2026)

All major MVP workstreams are scaffolded and pushed:

| Workstream | Status |
|------------|--------|
| Domain + Rights engine (pure entitlement) | ✅ |
| Identity (register/login/JWT) | ✅ |
| Catalog | ✅ |
| Audio upload pipeline | ✅ |
| Playback (rights-gated tokens) | ✅ |
| AI classification + embeddings (Python worker) | ✅ |
| Search (keyword + semantic, rights-aware) | ✅ |
| Recommendations (rights filter first) + AI playlists | ✅ |
| Playlists | ✅ |
| Creator dashboard API | ✅ |
| Admin / moderation / takedown | ✅ |
| Auth guards + roles | ✅ |
| Rate limiting | ✅ |
| Health / readiness | ✅ |
| Next.js web client | ✅ |
| Docker stack (Postgres+pgvector, Redis, MinIO, OpenSearch, AI worker) | ✅ |
| Rights unit tests | ✅ |

## Quick Start

```bash
git clone https://github.com/akameredon/sho-music.git
cd sho-music
pnpm install

# Infrastructure
docker compose -f infrastructure/docker/docker-compose.yml up -d --build

# API
cp .env.example .env
pnpm --filter @sho-music/api db:push
pnpm --filter @sho-music/api dev
# → http://localhost:3000/docs

# Web
pnpm --filter @sho-music/web dev
# → http://localhost:3001

# AI worker (if not via docker)
cd services/ai-worker && pip install -r requirements.txt && uvicorn app.main:app --port 8000
```

## Architecture Principles (enforced)

1. **Rights before playback** — `EntitlementService` is the gatekeeper. AI never decides legal rights.
2. **Sho owns the core** — identity, catalog, metadata, AI, search, playlists, recommendations, rights, analytics, playback orchestration.
3. **No single vendor SPOF** — external music platforms are adapters only.
4. **Hardware is optional**.
5. **Failure isolation** — AI/search/recommendations can fail; library playback continues.

## API Surface (v1)

- `POST /v1/auth/register` · `POST /v1/auth/login`
- `POST /v1/catalog/tracks` · `GET /v1/catalog/tracks` · `GET /v1/catalog/tracks/:id`
- `POST /v1/upload/initiate` · `POST /v1/upload/finalize/:trackId`
- `POST /v1/playback/authorize` — **always checks entitlement**
- `POST /v1/rights/entitlement/check`
- `POST /v1/ai/analyze/:trackId`
- `GET /v1/search?q=` · `GET /v1/search/similar/:trackId`
- `GET /v1/recommendations/for-you` · `POST /v1/recommendations/playlist`
- `POST /v1/playlists` · `GET /v1/playlists/:id`
- `GET /v1/creator/overview` · `GET /v1/creator/tracks`
- `GET /v1/admin/dashboard` · `POST /v1/admin/takedown/:trackId`
- `GET /v1/health` · `GET /v1/health/ready`

## Repo layout

```
sho-music/
├── apps/api/          # NestJS modular monolith
├── apps/web/          # Next.js client
├── packages/domain/   # Pure business logic (rights, track models)
├── services/ai-worker/# Python FastAPI classification + embeddings
├── infrastructure/docker/
├── docs/adr/
└── tests/rights/
```

Built from master PRD v2.0 + TRD v2.0. Keep sipping — the platform owns its core.

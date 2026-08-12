# Sho Music 2.0

**AI-native music infrastructure and listening platform**

> "If Sho does not control it, Sho must be able to replace it."

Sho Music is **not** “Spotify with AI”.  
It is a rights-aware, AI-first music operating platform that owns its core:

- Identity & users
- Catalog & metadata
- Audio processing & storage
- AI classification, embeddings & intelligence
- Rights registry & entitlement engine
- Playback orchestration
- Search (traditional + semantic)
- Recommendations & playlists
- Creator & admin tools
- Analytics

Third-party services (YouTube, Apple Music, Spotify, any single cloud/CDN/AI provider, hardware) are **replaceable adapters only**. They are never the source of truth.

## Core Principles (from PRD/TRD)

1. **Rights before playback** — Every commercially playable asset has an explicit rights state. Playback always consults the entitlement layer.
2. **Sho owns the core** — Identity, catalog, metadata, AI, search, playlists, recommendations, rights, analytics, playback infrastructure.
3. **No single vendor as SPOF** — Hardware is optional. External music platforms are isolated adapters.
4. **AI is infrastructure** — Genre, mood, energy, tempo, language, instrumentation, embeddings, similarity. Not decoration.
5. **Failure isolation** — If AI fails, playback continues. If recommendations fail, search continues. If a third-party fails, core Sho continues.

## Architecture Overview

```
                    SHO MUSIC
                        │
              ┌─────────┴─────────┐
              │    API Gateway    │
              └─────────┬─────────┘
                        │
       ┌────────────────┼────────────────┐
       │                │                │
    Identity          Catalog          Playback
       │                │                │
       │          ┌─────┴─────┐          │
       │          │           │          │
     Users       Metadata    Rights    Streaming
                  │           │          │
                  │       Entitlement    │
                  │           │          │
                  └─────┬─────┘          │
                        │                │
                     AI Core             │
                        │                │
              ┌─────────┼─────────┐      │
              │         │         │      │
           Classifier Embedding Search Recommendation
```

### Current Stack (MVP / Phase 1)

| Layer              | Choice                          | Notes |
|--------------------|---------------------------------|-------|
| Backend            | TypeScript / Node.js (NestJS)   | Modular monolith first |
| Database           | PostgreSQL + pgvector           | Strong consistency for rights/entitlements |
| Object Storage     | S3-compatible (MinIO local)     | Audio masters, streams, artwork |
| Cache / Queue      | Redis + BullMQ / NATS           | Async AI & processing pipelines |
| Search             | OpenSearch / Elasticsearch      | + semantic via embeddings |
| AI Services        | Python (FastAPI workers)        | Classification, embeddings, MIR |
| Web                | Next.js / React                 | |
| Mobile             | React Native / Expo (later)     | |
| Infra              | Docker Compose → Kubernetes     | IaC from day one |

## Repository Structure

```
sho-music/
├── apps/
│   ├── api/                 # NestJS modular monolith (core backend)
│   ├── web/                 # Next.js listener + creator web app
│   └── mobile/              # Future React Native
├── packages/
│   ├── shared/              # Shared types, constants, utils
│   └── domain/              # Core domain models & pure business logic
├── infrastructure/
│   ├── docker/              # Local development stack
│   ├── k8s/                 # Future production manifests
│   └── terraform/           # Cloud IaC
├── docs/
│   ├── architecture/        # High-level design
│   └── adr/                 # Architecture Decision Records
├── tests/                   # Unit, integration, rights matrix, e2e
├── scripts/                 # Dev & ops scripts
└── .github/workflows/       # CI/CD
```

## Development Sequence (TRD §62)

1. ✅ Product contract (PRD + TRD)
2. ✅ Legal / rights model
3. ✅ Domain model
4. Identity
5. Catalog
6. Audio ingestion
7. Playback
8. AI analysis
9. Search
10. Rights engine
11. Entitlements
12. Playlists
13. Recommendations
14. Creator platform
15. Billing
16. Analytics
17. External adapters
18. Scale infrastructure

## Quick Start (Local)

```bash
# Prerequisites: Docker, Node 20+, pnpm
git clone https://github.com/akameredon/sho-music.git
cd sho-music
pnpm install
docker compose -f infrastructure/docker/docker-compose.yml up -d
pnpm --filter api dev
```

## Rights States (Canonical)

```
OWNER_VERIFIED | LICENSED | DIRECT_ARTIST_LICENSE | LABEL_LICENSED
PUBLISHER_LICENSED | PUBLIC_DOMAIN | USER_PRIVATE | USER_UNVERIFIED
TERRITORY_RESTRICTED | EXPIRED | BLOCKED | UNDER_REVIEW
```

## North Star Metric

**Successful Music Sessions** — A user starts *legally playable* music and meaningfully listens without playback failure.

## License

Proprietary. All rights reserved. © 2026 Sho Music.

---

Built according to the master PRD v2.0 and TRD v2.0 (August 12, 2026).
No external music platform is foundational. Hardware is optional. Rights are first-class.

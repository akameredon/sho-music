# ADR-001: PostgreSQL as primary transactional store

## Status
Accepted

## Context
Sho Music requires strong consistency for rights, licenses, entitlements, identity, financial data and audit logs. The platform also needs vector search capability for embeddings.

## Decision
Use PostgreSQL with the pgvector extension as the primary database for all transactional and rights-critical data.

## Consequences
- Strong consistency guarantees for the most important business invariants.
- Single source of truth for rights state.
- pgvector allows early embedding storage without introducing a separate vector DB immediately.
- Horizontal read scaling later via read replicas.

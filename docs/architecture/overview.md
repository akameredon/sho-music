# Sho Music 2.0 Architecture Overview

See master TRD v2.0 for full detail.

## Guiding Principle
> If Sho does not control it, Sho must be able to replace it.

## Modular Monolith First
We start with clear domain modules inside a single NestJS process.
Domain boundaries are enforced by modules and package boundaries.
Services can be extracted later without rewriting business rules.

## Critical Paths
1. **Upload → Process → Rights → Ready**
2. **Playback request → Entitlement check → Signed token → Stream**
3. **AI analysis runs asynchronously and never blocks or decides rights**

## Failure Isolation
- AI down → playback still works
- Recommendations down → search + library still work
- Third-party adapter down → core catalog + local library still work

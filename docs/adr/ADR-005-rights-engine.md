# ADR-005: Rights Engine as first-class core service

## Status
Accepted

## Context
Previous versions of Sho failed partly because rights were treated as an afterthought. Playback of commercially distributed content must never happen without an explicit, machine-readable rights decision.

## Decision
- RightsRecord + License + TerritoryRule are first-class entities.
- EntitlementService is the single gatekeeper called before any protected playback authorization.
- AI classification is never authoritative for legal rights.
- Rights state is denormalized onto Track for fast listing filters but the RightsRecord is the source of truth.
- Every rights mutation is audited.

## Consequences
- Playback path always checks entitlement.
- Clear separation of concerns between “what the audio sounds like” (AI) and “who is allowed to play it where” (Rights).
- Takedown and license revocation can propagate rapidly.

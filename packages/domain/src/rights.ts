/**
 * Sho Music 2.0 — Rights Domain
 * Canonical rights states and decision types.
 * Rights decisions are NEVER made by AI classification alone.
 */

export enum RightsState {
  OWNER_VERIFIED = 'OWNER_VERIFIED',
  LICENSED = 'LICENSED',
  DIRECT_ARTIST_LICENSE = 'DIRECT_ARTIST_LICENSE',
  LABEL_LICENSED = 'LABEL_LICENSED',
  PUBLISHER_LICENSED = 'PUBLISHER_LICENSED',
  PUBLIC_DOMAIN = 'PUBLIC_DOMAIN',
  USER_PRIVATE = 'USER_PRIVATE',
  USER_UNVERIFIED = 'USER_UNVERIFIED',
  TERRITORY_RESTRICTED = 'TERRITORY_RESTRICTED',
  EXPIRED = 'EXPIRED',
  BLOCKED = 'BLOCKED',
  UNDER_REVIEW = 'UNDER_REVIEW',
}

export enum UsageType {
  STREAM = 'STREAM',
  DOWNLOAD = 'DOWNLOAD',
  OFFLINE = 'OFFLINE',
  COMMERCIAL = 'COMMERCIAL',
  RADIO = 'RADIO',
  PUBLIC_PERFORMANCE = 'PUBLIC_PERFORMANCE',
}

export enum RightsDecision {
  ALLOW = 'ALLOW',
  DENY = 'DENY',
  RESTRICT = 'RESTRICT',
  REVIEW = 'REVIEW',
}

export interface TerritoryRights {
  territory: string;
  allowed: boolean;
  reason?: string;
}

export interface License {
  id: string;
  assetId: string;
  licensorId: string;
  licenseeId: string;
  rightsType: string[];
  territories: string[];
  usageTypes: UsageType[];
  startDate: Date;
  endDate: Date | null;
  commercial: boolean;
  revenueConditions?: string;
  reportingObligations?: string;
  restrictions?: string[];
  contractReference?: string;
  status: 'ACTIVE' | 'EXPIRED' | 'REVOKED' | 'PENDING';
  createdAt: Date;
  updatedAt: Date;
}

export interface RightsRecord {
  assetId: string;
  recordingOwnerId?: string;
  publishingOwnerId?: string;
  state: RightsState;
  licenses: License[];
  territories: TerritoryRights[];
  usage: UsageType[];
  commercial: boolean;
  startDate?: Date;
  endDate?: Date;
  notes?: string;
  lastReviewedAt?: Date;
  lastReviewedBy?: string;
}

export interface EntitlementRequest {
  userId: string;
  trackId: string;
  territory: string;
  deviceId?: string;
  usage: UsageType;
  timestamp: Date;
}

export interface EntitlementResult {
  allowed: boolean;
  decision: RightsDecision;
  reason: string;
  expiresAt?: Date;
  restrictions?: string[];
  alternativeSuggestions?: string[];
}

/**
 * Pure function: evaluate entitlement.
 * This is the single source of truth for "can this user play this track right now".
 * Called by playback-service before any stream is authorized.
 */
export function evaluateEntitlement(
  request: EntitlementRequest,
  rights: RightsRecord,
  userIsOwner: boolean = false,
): EntitlementResult {
  if (rights.state === RightsState.BLOCKED) {
    return { allowed: false, decision: RightsDecision.DENY, reason: 'TRACK_BLOCKED' };
  }
  if (rights.state === RightsState.UNDER_REVIEW) {
    return { allowed: false, decision: RightsDecision.REVIEW, reason: 'UNDER_REVIEW' };
  }
  if (rights.state === RightsState.EXPIRED) {
    return { allowed: false, decision: RightsDecision.DENY, reason: 'LICENSE_EXPIRED' };
  }
  if (rights.state === RightsState.USER_PRIVATE) {
    if (userIsOwner) {
      return { allowed: true, decision: RightsDecision.ALLOW, reason: 'USER_OWNED_PRIVATE' };
    }
    return { allowed: false, decision: RightsDecision.DENY, reason: 'PRIVATE_CONTENT' };
  }
  if (rights.state === RightsState.PUBLIC_DOMAIN) {
    return { allowed: true, decision: RightsDecision.ALLOW, reason: 'PUBLIC_DOMAIN' };
  }
  const territoryRule = rights.territories.find(
    (t) => t.territory === request.territory || t.territory === '*',
  );
  if (territoryRule && !territoryRule.allowed) {
    return { allowed: false, decision: RightsDecision.DENY, reason: 'TERRITORY_RESTRICTED' };
  }
  const licensedStates = [
    RightsState.LICENSED,
    RightsState.DIRECT_ARTIST_LICENSE,
    RightsState.LABEL_LICENSED,
    RightsState.PUBLISHER_LICENSED,
    RightsState.OWNER_VERIFIED,
  ];
  if (licensedStates.includes(rights.state)) {
    const now = request.timestamp;
    const matchingLicense = rights.licenses.find((lic) => {
      if (lic.status !== 'ACTIVE') return false;
      if (lic.startDate > now) return false;
      if (lic.endDate && lic.endDate < now) return false;
      if (
        lic.territories.length > 0 &&
        !lic.territories.includes(request.territory) &&
        !lic.territories.includes('*')
      ) {
        return false;
      }
      if (!lic.usageTypes.includes(request.usage)) return false;
      return true;
    });
    if (matchingLicense) {
      return {
        allowed: true,
        decision: RightsDecision.ALLOW,
        reason: 'ACTIVE_LICENSE',
        expiresAt: matchingLicense.endDate ?? undefined,
      };
    }
  }
  if (rights.state === RightsState.USER_UNVERIFIED) {
    if (userIsOwner && request.usage === UsageType.STREAM) {
      return {
        allowed: true,
        decision: RightsDecision.ALLOW,
        reason: 'USER_UNVERIFIED_PRIVATE_STREAM',
      };
    }
    return { allowed: false, decision: RightsDecision.DENY, reason: 'RIGHTS_NOT_VERIFIED' };
  }
  return { allowed: false, decision: RightsDecision.DENY, reason: 'NO_VALID_ENTITLEMENT' };
}

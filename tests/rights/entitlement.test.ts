/**
 * Rights Test Matrix (excerpt)
 * Full matrix lives in TRD §46
 */
import {
  evaluateEntitlement,
  RightsState,
  UsageType,
  RightsRecord,
} from '../../packages/domain/src/rights';

describe('Entitlement Engine', () => {
  const baseRequest = {
    userId: 'user-1',
    trackId: 'track-1',
    territory: 'NG',
    usage: UsageType.STREAM,
    timestamp: new Date(),
  };

  it('allows PUBLIC_DOMAIN', () => {
    const rights: RightsRecord = {
      assetId: 'track-1',
      state: RightsState.PUBLIC_DOMAIN,
      licenses: [],
      territories: [],
      usage: [UsageType.STREAM],
      commercial: false,
    };
    const result = evaluateEntitlement(baseRequest, rights);
    expect(result.allowed).toBe(true);
    expect(result.reason).toBe('PUBLIC_DOMAIN');
  });

  it('denies BLOCKED', () => {
    const rights: RightsRecord = {
      assetId: 'track-1',
      state: RightsState.BLOCKED,
      licenses: [],
      territories: [],
      usage: [UsageType.STREAM],
      commercial: false,
    };
    const result = evaluateEntitlement(baseRequest, rights);
    expect(result.allowed).toBe(false);
    expect(result.reason).toBe('TRACK_BLOCKED');
  });

  it('allows USER_PRIVATE only for owner', () => {
    const rights: RightsRecord = {
      assetId: 'track-1',
      state: RightsState.USER_PRIVATE,
      licenses: [],
      territories: [],
      usage: [UsageType.STREAM],
      commercial: false,
    };
    const ownerResult = evaluateEntitlement(baseRequest, rights, true);
    expect(ownerResult.allowed).toBe(true);

    const otherResult = evaluateEntitlement(baseRequest, rights, false);
    expect(otherResult.allowed).toBe(false);
  });
});

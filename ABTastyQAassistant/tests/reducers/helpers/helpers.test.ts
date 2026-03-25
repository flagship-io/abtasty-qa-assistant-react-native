import { TargetingOperator } from '@flagship.io/react-native-sdk';
import {
  matchesTargetingCriteria,
  evaluateCampaignTargeting,
} from '../../../src/reducers/helpers';
import { Targetings, VisitorData, VariationGroupDTO, CampaignType } from '../../../src/types.local';


describe('matchesTargetingCriteria', () => {
  const baseTargeting: Targetings = {
    key: 'test_key',
    operator: TargetingOperator.EQUALS,
    value: 'test_value',
  };

  const visitorData: VisitorData = {
    visitorId: 'visitor-123',
    hasConsented: true,
    context: {
      test_key: 'test_value',
    },
  };

  it('should return true for fs_all_users key', () => {
    const targeting = { ...baseTargeting, key: 'fs_all_users' };
    expect(matchesTargetingCriteria(targeting, 'any_value')).toBe(true);
  });

  it('should return true for fs_all_users when visitorData is undefined', () => {
    const targeting = { ...baseTargeting, key: 'fs_all_users' };
    expect(matchesTargetingCriteria(targeting, 'any_value', undefined)).toBe(true);
  });

  it('should return false when visitorData is undefined and targeting is not fs_all_users', () => {
    expect(matchesTargetingCriteria(baseTargeting, 'test_value', undefined)).toBe(false);
  });

  it('should return false when visitorData is null and targeting is not fs_all_users', () => {
    expect(matchesTargetingCriteria(baseTargeting, 'test_value', null as any)).toBe(false);
  });

  it('should match EQUALS operator correctly', () => {
    const targeting = {
      ...baseTargeting,
      operator: TargetingOperator.EQUALS,
    };
    expect(matchesTargetingCriteria(targeting, 'test_value', visitorData)).toBe(true);
  });

  it('should not match EQUALS operator with different value', () => {
    const targeting = {
      ...baseTargeting,
      operator: TargetingOperator.EQUALS,
    };
    expect(matchesTargetingCriteria(targeting, 'different_value', visitorData)).toBe(false);
  });

  it('should match NOT_EQUALS operator correctly', () => {
    const targeting = {
      ...baseTargeting,
      operator: TargetingOperator.NOT_EQUALS,
    };
    expect(matchesTargetingCriteria(targeting, 'different_value', visitorData)).toBe(true);
  });

  it('should handle array targeting values', () => {
    const targeting = {
      ...baseTargeting,
      operator: TargetingOperator.EQUALS,
      value: ['value1', 'test_value', 'value3'],
    };
    expect(matchesTargetingCriteria(targeting, ['value1', 'test_value'], visitorData)).toBe(true);
  });

  it('should set matchedValue when targeting matches', () => {
    const targeting = {
      ...baseTargeting,
      operator: TargetingOperator.EQUALS,
    };
    matchesTargetingCriteria(targeting, 'test_value', visitorData);
    expect(targeting.matchedValue).toBeDefined();
    expect(targeting.matchedValue?.has('test_value')).toBe(true);
  });

  it('should handle undefined targetingValue', () => {
    const targeting = {
      ...baseTargeting,
      operator: TargetingOperator.EQUALS,
    };
    const result = matchesTargetingCriteria(targeting, undefined, visitorData);
    expect(typeof result).toBe('boolean');
  });
});

describe('evaluateCampaignTargeting', () => {
  const baseVisitorData: VisitorData = {
    visitorId: 'visitor-123',
    hasConsented: true,
    context: {
      country: 'US',
      age: 25,
    },
  };

  it('should return false when no variation groups provided', () => {
    expect(evaluateCampaignTargeting([], baseVisitorData)).toBe(false);
  });

  it('should return true when targeting matches', () => {
    const variationGroups: VariationGroupDTO[] = [
      {
        id: 'vg-1',
        name: 'Test Group',
        variations: [],
        targeting: {
          targetingGroups: [
            {
              targetings: [
                {
                  key: 'country',
                  operator: TargetingOperator.EQUALS,
                  value: 'US',
                },
              ],
            },
          ],
        },
      },
    ];

    expect(evaluateCampaignTargeting(variationGroups, baseVisitorData)).toBe(true);
  });

  it('should return false when targeting does not match', () => {
    const variationGroups: VariationGroupDTO[] = [
      {
        id: 'vg-1',
        name: 'Test Group',
        variations: [],
        targeting: {
          targetingGroups: [
            {
              targetings: [
                {
                  key: 'country',
                  operator: TargetingOperator.EQUALS,
                  value: 'UK',
                },
              ],
            },
          ],
        },
      },
    ];

    expect(evaluateCampaignTargeting(variationGroups, baseVisitorData)).toBe(false);
  });

  it('should handle empty targeting groups', () => {
    const variationGroups: VariationGroupDTO[] = [
      {
        id: 'vg-1',
        name: 'Test Group',
        variations: [],
        targeting: {
          targetingGroups: [],
        },
      },
    ];

    expect(evaluateCampaignTargeting(variationGroups, baseVisitorData)).toBe(false);
  });

  it('should handle multiple variation groups', () => {
    const variationGroups: VariationGroupDTO[] = [
      {
        id: 'vg-1',
        name: 'Group 1',
        variations: [],
        targeting: {
          targetingGroups: [
            {
              targetings: [
                {
                  key: 'country',
                  operator: TargetingOperator.EQUALS,
                  value: 'UK',
                },
              ],
            },
          ],
        },
      },
      {
        id: 'vg-2',
        name: 'Group 2',
        variations: [],
        targeting: {
          targetingGroups: [
            {
              targetings: [
                {
                  key: 'country',
                  operator: TargetingOperator.EQUALS,
                  value: 'US',
                },
              ],
            },
          ],
        },
      },
    ];

    expect(evaluateCampaignTargeting(variationGroups, baseVisitorData)).toBe(true);
  });

  it('should handle fs_all_users targeting', () => {
    const variationGroups: VariationGroupDTO[] = [
      {
        id: 'vg-1',
        name: 'Test Group',
        variations: [],
        targeting: {
          targetingGroups: [
            {
              targetings: [
                {
                  key: 'fs_all_users',
                  operator: TargetingOperator.EQUALS,
                  value: true,
                },
              ],
            },
          ],
        },
      },
    ];

    expect(evaluateCampaignTargeting(variationGroups, baseVisitorData)).toBe(true);
  });

  it('should return false for empty targetings in a group', () => {
    const variationGroups: VariationGroupDTO[] = [
      {
        id: 'vg-1',
        name: 'Test Group',
        variations: [],
        targeting: {
          targetingGroups: [
            {
              targetings: [],
            },
          ],
        },
      },
    ];

    expect(evaluateCampaignTargeting(variationGroups, baseVisitorData)).toBe(false);
  });

  it('should return false for targeting groups with undefined visitorData when not fs_all_users', () => {
    const variationGroups: VariationGroupDTO[] = [
      {
        id: 'vg-1',
        name: 'Test Group',
        variations: [],
        targeting: {
          targetingGroups: [
            {
              targetings: [
                {
                  key: 'country',
                  operator: TargetingOperator.EQUALS,
                  value: 'US',
                },
              ],
            },
          ],
        },
      },
    ];

    expect(evaluateCampaignTargeting(variationGroups, undefined)).toBe(false);
  });

  it('should return true for fs_all_users targeting with undefined visitorData', () => {
    const variationGroups: VariationGroupDTO[] = [
      {
        id: 'vg-1',
        name: 'Test Group',
        variations: [],
        targeting: {
          targetingGroups: [
            {
              targetings: [
                {
                  key: 'fs_all_users',
                  operator: TargetingOperator.EQUALS,
                  value: true,
                },
              ],
            },
          ],
        },
      },
    ];

    expect(evaluateCampaignTargeting(variationGroups, undefined)).toBe(true);
  });
});

describe('matchesTargetingCriteria - Advanced Operators', () => {
  const visitorData: VisitorData = {
    visitorId: 'visitor-123',
    hasConsented: true,
    context: {
      country: 'United States',
      age: 25,
      email: 'test@example.com',
      name: 'John Doe',
    },
  };

  it('should match CONTAINS operator', () => {
    const targeting: Targetings = {
      key: 'country',
      operator: TargetingOperator.CONTAINS,
      value: 'States',
    };
    expect(matchesTargetingCriteria(targeting, 'States', visitorData)).toBe(true);
  });

  it('should not match CONTAINS operator when value not present', () => {
    const targeting: Targetings = {
      key: 'country',
      operator: TargetingOperator.CONTAINS,
      value: 'Canada',
    };
    expect(matchesTargetingCriteria(targeting, 'Canada', visitorData)).toBe(false);
  });

  it('should match NOT_CONTAINS operator', () => {
    const targeting: Targetings = {
      key: 'country',
      operator: TargetingOperator.NOT_CONTAINS,
      value: 'Canada',
    };
    expect(matchesTargetingCriteria(targeting, 'Canada', visitorData)).toBe(true);
  });

  it('should match EXISTS operator', () => {
    const targeting: Targetings = {
      key: 'email',
      operator: TargetingOperator.EXISTS,
      value: null,
    };
    expect(matchesTargetingCriteria(targeting, null, visitorData)).toBe(true);
  });

  it('should match NOT_EXISTS operator', () => {
    const targeting: Targetings = {
      key: 'nonexistent',
      operator: TargetingOperator.NOT_EXISTS,
      value: null,
    };
    expect(matchesTargetingCriteria(targeting, null, visitorData)).toBe(true);
  });

  it('should match GREATER_THAN operator', () => {
    const targeting: Targetings = {
      key: 'age',
      operator: TargetingOperator.GREATER_THAN,
      value: 20,
    };
    expect(matchesTargetingCriteria(targeting, 20, visitorData)).toBe(true);
  });

  it('should match LOWER_THAN operator', () => {
    const targeting: Targetings = {
      key: 'age',
      operator: TargetingOperator.LOWER_THAN,
      value: 30,
    };
    expect(matchesTargetingCriteria(targeting, 30, visitorData)).toBe(true);
  });

  it('should match GREATER_THAN_OR_EQUALS operator', () => {
    const targeting: Targetings = {
      key: 'age',
      operator: TargetingOperator.GREATER_THAN_OR_EQUALS,
      value: 25,
    };
    expect(matchesTargetingCriteria(targeting, 25, visitorData)).toBe(true);
  });

  it('should match LOWER_THAN_OR_EQUALS operator', () => {
    const targeting: Targetings = {
      key: 'age',
      operator: TargetingOperator.LOWER_THAN_OR_EQUALS,
      value: 25,
    };
    expect(matchesTargetingCriteria(targeting, 25, visitorData)).toBe(true);
  });

  it('should match STARTS_WITH operator', () => {
    const targeting: Targetings = {
      key: 'email',
      operator: TargetingOperator.STARTS_WITH,
      value: 'test',
    };
    expect(matchesTargetingCriteria(targeting, 'test', visitorData)).toBe(true);
  });

  it('should match ENDS_WITH operator', () => {
    const targeting: Targetings = {
      key: 'email',
      operator: TargetingOperator.ENDS_WITH,
      value: '.com',
    };
    expect(matchesTargetingCriteria(targeting, '.com', visitorData)).toBe(true);
  });

  it('should handle fs_users key for visitor ID', () => {
    const targeting: Targetings = {
      key: 'fs_users',
      operator: TargetingOperator.EQUALS,
      value: 'visitor-123',
    };
    expect(matchesTargetingCriteria(targeting, 'visitor-123', visitorData)).toBe(true);
  });

  it('should handle array targeting with NOT_EQUALS operator (all must not match)', () => {
    const targeting: Targetings = {
      key: 'country',
      operator: TargetingOperator.NOT_EQUALS,
      value: ['Canada', 'Mexico', 'Brazil'],
    };
    expect(matchesTargetingCriteria(targeting, ['Canada', 'Mexico', 'Brazil'], visitorData)).toBe(true);
  });

  it('should handle array targeting with NOT_CONTAINS operator (all must not match)', () => {
    const targeting: Targetings = {
      key: 'country',
      operator: TargetingOperator.NOT_CONTAINS,
      value: ['Canada', 'Mexico'],
    };
    expect(matchesTargetingCriteria(targeting, ['Canada', 'Mexico'], visitorData)).toBe(true);
  });



  it('should handle array targeting with EQUALS operator (any must match)', () => {
    const targeting: Targetings = {
      key: 'country',
      operator: TargetingOperator.EQUALS,
      value: ['United States', 'Canada'],
    };
    expect(matchesTargetingCriteria(targeting, ['United States', 'Canada'], visitorData)).toBe(true);
  });

  it('should fail array targeting when none match for EQUALS', () => {
    const targeting: Targetings = {
      key: 'country',
      operator: TargetingOperator.EQUALS,
      value: ['Canada', 'Mexico'],
    };
    expect(matchesTargetingCriteria(targeting, ['Canada', 'Mexico'], visitorData)).toBe(false);
  });

  it('should return false for unknown/default operator', () => {
    const targeting: Targetings = {
      key: 'country',
      operator: 'UNKNOWN_OPERATOR' as TargetingOperator,
      value: 'US',
    };
    expect(matchesTargetingCriteria(targeting, 'US', visitorData)).toBe(false);
  });

  it('should return false when non-array targeting value passed to array handling', () => {
    const visitorDataNoCountry: VisitorData = {
      visitorId: 'visitor-123',
      hasConsented: true,
      context: {},
    };
    
    const targeting: Targetings = {
      key: 'country',
      operator: TargetingOperator.EQUALS,
      value: ['US', 'UK'],
    };
    
    expect(matchesTargetingCriteria(targeting, ['US', 'UK'], visitorDataNoCountry)).toBe(false);
  });
});





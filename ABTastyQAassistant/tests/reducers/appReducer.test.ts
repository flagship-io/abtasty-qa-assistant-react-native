import { appDataReducer } from '../../src/reducers/appReducer';
import {
  AppDataState,
  SetBucketingFileAction,
  SetIsCampaignsLoadingAction,
  ShouldSendForcedAllocationAction,
  ShouldSendForcedUnallocationAction,
  CampaignType,
} from '../../src/types.local';
import {
  createMockAppDataState,
  mockCampaign,
  mockAllocatedCampaign,
  mockUnallocatedCampaign,
  mockVisitorData,
} from '../helpers/reducer-test-utils';

describe('appDataReducer', () => {
  let initialState: AppDataState;

  beforeEach(() => {
    initialState = createMockAppDataState();
  });

  describe('SET_BUCKETING_FILE', () => {
    it('should set bucketing file and mark loading as false', () => {
      const action: SetBucketingFileAction = {
        type: 'SET_BUCKETING_FILE',
        payload: {
          campaigns: [mockCampaign],
          panic: false,
        },
      };

      const newState = appDataReducer(initialState, action);

      expect(newState.bucketingFile).toEqual(action.payload);
      expect(newState.isCampaignsLoading).toBe(false);
    });

    it('should update existing bucketing file', () => {
      const newBucketingFile = {
        campaigns: [],
        panic: true,
      };

      const action: SetBucketingFileAction = {
        type: 'SET_BUCKETING_FILE',
        payload: newBucketingFile,
      };

      const newState = appDataReducer(initialState, action);

      expect(newState.bucketingFile).toEqual(newBucketingFile);
      expect(newState.bucketingFile?.panic).toBe(true);
    });
  });

  describe('SET_IS_CAMPAIGNS_LOADING', () => {
    it('should toggle loading state between true and false', () => {
      // Test setting to true
      const actionTrue: SetIsCampaignsLoadingAction = {
        type: 'SET_IS_CAMPAIGNS_LOADING',
        payload: true,
      };
      const stateWithTrue = appDataReducer(initialState, actionTrue);
      expect(stateWithTrue.isCampaignsLoading).toBe(true);

      // Test setting to false
      const actionFalse: SetIsCampaignsLoadingAction = {
        type: 'SET_IS_CAMPAIGNS_LOADING',
        payload: false,
      };
      const stateWithFalse = appDataReducer(stateWithTrue, actionFalse);
      expect(stateWithFalse.isCampaignsLoading).toBe(false);
    });
  });

  describe('APPLY_FORCE_VARIATION', () => {
    it('should add forced variation to state', () => {
      const forcedVariation = {
        'campaign-2': {
          campaignId: 'campaign-2',
          campaignName: 'Forced Campaign',
          campaignType: CampaignType.ab,
          variationGroupId: 'vg-2',
          variation: {
            id: 'var-forced',
            name: 'Forced Variation',
            modifications: { type: 'JSON', value: {} },
          },
        },
      };

      const action = {
        type: 'APPLY_FORCE_VARIATION' as const,
        payload: forcedVariation,
      };

      const newState = appDataReducer(initialState, action);

      expect(newState.forcedVariations).toEqual(forcedVariation);
    });

    it('should merge with existing forced variations', () => {
      const existingForced = {
        'campaign-1': {
          campaignId: 'campaign-1',
          campaignName: 'Campaign 1',
          campaignType: CampaignType.ab,
          variationGroupId: 'vg-1',
          variation: {
            id: 'var-1',
            name: 'Var 1',
            modifications: { type: 'JSON', value: {} },
          },
        },
      };

      const stateWithForced = {
        ...initialState,
        forcedVariations: existingForced,
      };

      const newForced = {
        'campaign-2': {
          campaignId: 'campaign-2',
          campaignName: 'Campaign 2',
          campaignType: CampaignType.toggle,
          variationGroupId: 'vg-2',
          variation: {
            id: 'var-2',
            name: 'Var 2',
            modifications: { type: 'JSON', value: {} },
          },
        },
      };

      const action = {
        type: 'APPLY_FORCE_VARIATION' as const,
        payload: newForced,
      };

      const newState = appDataReducer(stateWithForced, action);

      expect(newState.forcedVariations).toEqual({
        ...existingForced,
        ...newForced,
      });
    });
  });

  describe('SET_SHOULD_SEND_FORCED_ALLOCATION', () => {
    it('should toggle shouldSendForcedAllocation flag', () => {
      // Set to true
      const actionTrue: ShouldSendForcedAllocationAction = {
        type: 'SET_SHOULD_SEND_FORCED_ALLOCATION',
        payload: true,
      };
      const stateWithTrue = appDataReducer(initialState, actionTrue);
      expect(stateWithTrue.shouldSendForcedAllocation).toBe(true);

      // Set to false
      const actionFalse: ShouldSendForcedAllocationAction = {
        type: 'SET_SHOULD_SEND_FORCED_ALLOCATION',
        payload: false,
      };
      const stateWithFalse = appDataReducer(stateWithTrue, actionFalse);
      expect(stateWithFalse.shouldSendForcedAllocation).toBe(false);
    });
  });

  describe('SET_SHOULD_SEND_FORCED_UNALLOCATION', () => {
    it('should toggle shouldSendForcedUnallocation flag', () => {
      // Set to true
      const actionTrue: ShouldSendForcedUnallocationAction = {
        type: 'SET_SHOULD_SEND_FORCED_UNALLOCATION',
        payload: true,
      };
      const stateWithTrue = appDataReducer(initialState, actionTrue);
      expect(stateWithTrue.shouldSendForcedUnallocation).toBe(true);

      // Set to false
      const actionFalse: ShouldSendForcedUnallocationAction = {
        type: 'SET_SHOULD_SEND_FORCED_UNALLOCATION',
        payload: false,
      };
      const stateWithFalse = appDataReducer(stateWithTrue, actionFalse);
      expect(stateWithFalse.shouldSendForcedUnallocation).toBe(false);
    });
  });

  describe('unknown action type', () => {
    it('should return current state for unknown action', () => {
      const unknownAction = {
        type: 'UNKNOWN_ACTION' as any,
      };

      const newState = appDataReducer(initialState, unknownAction);

      expect(newState).toBe(initialState);
    });
  });

  describe('SPLIT_CAMPAIGNS_BY_ALLOCATION', () => {
    it('should split campaigns between accepted and rejected based on allocation', () => {
      // Setup: Start with bucketing file containing multiple campaigns
      const stateWithBucketingFile = createMockAppDataState({
        bucketingFile: {
          campaigns: [mockAllocatedCampaign, mockUnallocatedCampaign],
          panic: false,
        },
        allAcceptedCampaigns: [],
        allRejectedCampaigns: [],
      });

      // Action: Split campaigns with visitor allocations (by CAMPAIGN ID, not VG ID)
      const action = {
        type: 'SPLIT_CAMPAIGNS_BY_ALLOCATION' as const,
        payload: {
          value: {
            'campaign-allocated': {
              campaignId: 'campaign-allocated',
              variationGroupId: 'vg-allocated',
              variationId: 'variation-1',
            },
            // Note: campaign-unallocated is NOT in allocations
          },
          visitorData: mockVisitorData,
          sdkInfo: stateWithBucketingFile.sdkInfo,
        },
      };

      const newState = appDataReducer(stateWithBucketingFile, action);

      // Verify campaigns are split correctly
      expect(newState.allAcceptedCampaigns).toBeDefined();
      expect(newState.allRejectedCampaigns).toBeDefined();


      // 
      expect(newState.allAcceptedCampaigns?.length).toBe(1);
      expect(newState.allRejectedCampaigns?.length).toBe(1);

      // Allocated campaign should be in accepted campaigns
      const allocatedInAccepted = newState.allAcceptedCampaigns?.find(
        (c) => c.id === 'campaign-allocated'
      );
      expect(allocatedInAccepted).toBeDefined();
      expect(allocatedInAccepted?.status).toBe('ACCEPTED');

      // Unallocated campaign should be in rejected campaigns
      const unallocatedInRejected = newState.allRejectedCampaigns?.find(
        (c) => c.id === 'campaign-unallocated'
      );
      expect(unallocatedInRejected).toBeDefined();
      expect(unallocatedInRejected?.status).toBe('REJECTED');
    });

    it('should handle forced allocations overriding natural allocations', () => {
      const stateWithBucketingFile = createMockAppDataState({
        bucketingFile: {
          campaigns: [mockAllocatedCampaign, mockUnallocatedCampaign],
          panic: false,
        },
        allAcceptedCampaigns: [],
        allRejectedCampaigns: [],
        // Force the unallocated campaign to be allocated (forces rejection with RESET status)
        variationsForcedAllocation: {
          'campaign-unallocated': {
            campaignId: 'campaign-unallocated',
            campaignName: 'Unallocated Campaign',
            campaignType: 'ab' as CampaignType,
            variationGroupId: 'vg-unallocated',
            variationGroupName: 'Unallocated VG',
            variation: {
              id: 'variation-1',
              reference: true,
              modifications: { type: 'JSON', value: {} },
            },
          },
        },
      });

      const action = {
        type: 'SPLIT_CAMPAIGNS_BY_ALLOCATION' as const,
        payload: {
          value: {
            'campaign-allocated': {
              campaignId: 'campaign-allocated',
              variationGroupId: 'vg-allocated',
              variationId: 'variation-1',
            },
          },
          visitorData: mockVisitorData,
          sdkInfo: stateWithBucketingFile.sdkInfo,
        },
      };

      const newState = appDataReducer(stateWithBucketingFile, action);

      expect(newState.allAcceptedCampaigns).toBeDefined();
      expect(newState.allRejectedCampaigns).toBeDefined();

      expect(newState.allAcceptedCampaigns?.length).toBe(1);
      expect(newState.allRejectedCampaigns?.length).toBe(1);

      // When NOT allocated but forced allocation set: campaign is REJECTED with RESET status
      const unallocatedInRejected = newState.allRejectedCampaigns?.find(
        (c) => c.id === 'campaign-unallocated'
      );
      expect(unallocatedInRejected).toBeDefined();
      expect(unallocatedInRejected?.status).toBe('REJECTED');
      expect(unallocatedInRejected?.displayStatus).toBe('RESET');
    });

    it('should handle forced unallocations rejecting allocated campaigns', () => {
      const stateWithBucketingFile = createMockAppDataState({
        bucketingFile: {
          campaigns: [mockAllocatedCampaign, mockUnallocatedCampaign],
          panic: false,
        },
        allAcceptedCampaigns: [],
        allRejectedCampaigns: [],
        // Force the allocated campaign to be unallocated (forces acceptance with RESET status)
        variationsForcedUnallocation: {
          'campaign-allocated': {
            campaignId: 'campaign-allocated',
            campaignName: 'Allocated Campaign',
            campaignType: 'ab' as CampaignType,
            variationGroupId: 'vg-allocated',
            variationGroupName: 'Allocated VG',
            variation: {
              id: 'variation-1',
              reference: true,
              modifications: { type: 'JSON', value: {} },
            },
          },
        },
      });

      const action = {
        type: 'SPLIT_CAMPAIGNS_BY_ALLOCATION' as const,
        payload: {
          value: {
            // Campaign has natural allocation
            'campaign-allocated': {
              campaignId: 'campaign-allocated',
              variationGroupId: 'vg-allocated',
              variationId: 'variation-1',
            },
          },
          visitorData: mockVisitorData,
          sdkInfo: stateWithBucketingFile.sdkInfo,
        },
      };

      const newState = appDataReducer(stateWithBucketingFile, action);

      expect(newState.allAcceptedCampaigns).toBeDefined();
      expect(newState.allRejectedCampaigns).toBeDefined();

      expect(newState.allAcceptedCampaigns?.length).toBe(1);
      expect(newState.allRejectedCampaigns?.length).toBe(1);

      // When allocated but forced unallocation: campaign is ACCEPTED with RESET status
      const allocatedInAccepted = newState.allAcceptedCampaigns?.find(
        (c) => c.id === 'campaign-allocated'
      );
      expect(allocatedInAccepted).toBeDefined();
      expect(allocatedInAccepted?.status).toBe('ACCEPTED');
      expect(allocatedInAccepted?.displayStatus).toBe('RESET');
    });
  });

  describe('APPLY_FORCED_ALLOCATION', () => {
    it('should apply forced allocation to a campaign and update state', () => {
      const forcedAllocation = {
        'campaign-1': {
          campaignId: 'campaign-1',
          campaignName: 'Test',
          campaignType: 'ab' as CampaignType,
          variationGroupId: 'vg-1',
          variationGroupName: 'Test VG',
          variation: {
            id: 'var-1',
            reference: false,
            modifications: { type: 'JSON', value: {} },
          },
        },
      };

      const action = {
        type: 'APPLY_FORCED_ALLOCATION' as const,
        payload: {
          value: forcedAllocation,
        },
      };

      const newState = appDataReducer(initialState, action);

      expect(newState.variationsForcedAllocation).toHaveProperty('campaign-1');
      expect(newState.variationsForcedAllocation['campaign-1']).toEqual(
        forcedAllocation['campaign-1']
      );
      expect(newState.variationsForcedAllocation['campaign-1'].variation.id).toBe('var-1');
    });

    it('should merge with existing forced allocations', () => {
      const stateWithExisting = {
        ...initialState,
        variationsForcedAllocation: {
          'campaign-existing': {
            campaignId: 'campaign-existing',
            campaignName: 'Existing',
            campaignType: 'ab' as CampaignType,
            variationGroupId: 'vg-existing',
            variationGroupName: 'Existing VG',
            variation: {
              id: 'var-existing',
              reference: false,
              modifications: { type: 'JSON', value: {} },
            },
          },
        },
      };

      const action = {
        type: 'APPLY_FORCED_ALLOCATION' as const,
        payload: {
          value: {
            'campaign-new': {
              campaignId: 'campaign-new',
              campaignName: 'New',
              campaignType: 'ab' as CampaignType,
              variationGroupId: 'vg-new',
              variationGroupName: 'New VG',
              variation: {
                id: 'var-new',
                reference: false,
                modifications: { type: 'JSON', value: {} },
              },
            },
          },
        },
      };

      const newState = appDataReducer(stateWithExisting, action);
1
      expect(newState.variationsForcedAllocation).toHaveProperty('campaign-existing');
      expect(newState.variationsForcedAllocation).toHaveProperty('campaign-new');
      expect(Object.keys(newState.variationsForcedAllocation)).toHaveLength(2);
    });
  });

  describe('Forced allocation/unallocation management', () => {
    it('should handle UNSET_FORCED_ALLOCATION and remove forced allocation', () => {
      const stateWithAllocation = {
        ...initialState,
        variationsForcedAllocation: {
          'campaign-1': {
            campaignId: 'campaign-1',
            campaignName: 'Test',
            campaignType: 'ab' as CampaignType,
            variationGroupId: 'vg-1',
            variationGroupName: 'Test VG',
            variation: {
              id: 'var-1',
              reference: false,
              modifications: { type: 'JSON', value: {} },
            },
          },
        },
      };

      const action = {
        type: 'UNSET_FORCED_ALLOCATION' as const,
        payload: { campaignId: 'campaign-1' },
      };

      const newState = appDataReducer(stateWithAllocation, action);
      expect(newState.variationsForcedAllocation).not.toHaveProperty('campaign-1');
    });

    it('should handle APPLY_FORCE_UNALLOCATION and UNSET_FORCED_UNALLOCATION', () => {
      const applyAction = {
        type: 'APPLY_FORCE_UNALLOCATION' as const,
        payload: {
          value: {
            'campaign-1': {
              campaignId: 'campaign-1',
              campaignName: 'Test',
              campaignType: 'ab' as CampaignType,
              variationGroupId: 'vg-1',
              variationGroupName: 'Test VG',
              variation: {
                id: 'var-1',
                reference: false,
                modifications: { type: 'JSON', value: {} },
              },
            },
          },
        },
      };

      const stateWithUnallocation = appDataReducer(initialState, applyAction);
      expect(stateWithUnallocation.variationsForcedUnallocation).toHaveProperty('campaign-1');

      const unsetAction = {
        type: 'UNSET_FORCED_UNALLOCATION' as const,
        payload: { campaignId: 'campaign-1' },
      };

      const finalState = appDataReducer(stateWithUnallocation, unsetAction);
      expect(finalState.variationsForcedUnallocation).not.toHaveProperty('campaign-1');
    });
  });

  describe('RESET_ALL_CAMPAIGNS', () => {
    it('should reset all forced variations and allocations', () => {
      const stateWithForces = {
        ...initialState,
        forcedVariations: { 'campaign-1': {} as any },
        variationsForcedAllocation: { 'campaign-1': {} as any },
        variationsForcedUnallocation: { 'campaign-1': {} as any },
      };

      const action = {
        type: 'RESET_ALL_CAMPAIGNS' as const,
      };

      const newState = appDataReducer(stateWithForces, action);

      expect(Object.keys(newState.forcedVariations || {})).toHaveLength(0);
      expect(Object.keys(newState.variationsForcedAllocation)).toHaveLength(0);
      expect(Object.keys(newState.variationsForcedUnallocation)).toHaveLength(0);
    });
  });

  describe('SEARCH_CAMPAIGNS', () => {
    it('should filter campaigns case-insensitively and handle empty search', () => {
      const stateWithMultipleCampaigns = createMockAppDataState({
        allAcceptedCampaigns: [mockCampaign, mockAllocatedCampaign, mockUnallocatedCampaign],
        displayedAcceptedCampaigns: [mockCampaign, mockAllocatedCampaign, mockUnallocatedCampaign],
      });

      // Test case-insensitive filtering
      const searchAction = {
        type: 'SEARCH_CAMPAIGNS' as const,
        payload: { searchTerm: 'test' },
      };
      const searchState = appDataReducer(stateWithMultipleCampaigns, searchAction);
      expect(searchState.searchValue).toBe('test');
      expect(searchState.displayedAcceptedCampaigns?.some((c) => c.id === 'campaign-1')).toBe(true);

      // Test filtering by specific term
      const allocatedAction = {
        type: 'SEARCH_CAMPAIGNS' as const,
        payload: { searchTerm: 'Allocated' },
      };
      const allocatedState = appDataReducer(stateWithMultipleCampaigns, allocatedAction);
      expect(allocatedState.searchValue).toBe('Allocated');
      const filteredCampaigns = allocatedState.displayedAcceptedCampaigns?.filter((c) =>
        c.name.includes('Allocated')
      );
      expect(filteredCampaigns?.length).toBeGreaterThan(0);

      // Test empty search shows all campaigns
      const clearAction = {
        type: 'SEARCH_CAMPAIGNS' as const,
        payload: { searchTerm: '' },
      };
      const clearedState = appDataReducer(allocatedState, clearAction);
      expect(clearedState.searchValue).toBeUndefined();
      expect(clearedState.displayedAcceptedCampaigns?.length).toBe(
        stateWithMultipleCampaigns.allAcceptedCampaigns.length
      );
    });
  });

  describe('state immutability', () => {
    it('should not mutate original state', () => {
      const originalState = createMockAppDataState();
      const stateCopy = { ...originalState };

      const action: SetIsCampaignsLoadingAction = {
        type: 'SET_IS_CAMPAIGNS_LOADING',
        payload: true,
      };

      appDataReducer(originalState, action);

      expect(originalState).toEqual(stateCopy);
    });
  });
});

import {
  splitCampaignsByAllocation,
  applyForcedAllocation,
  unsetForcedAllocation,
  applyForceUnallocation,
  unsetForcedUnallocation,
  resetAllCampaigns,
  filterCampaignsBySearch,
} from '../../src/reducers/actions';
import {
  AppDataState,
  splitCampaignsByAllocationAction,
  ApplyForcedAllocationAction,
  UnsetForcedAllocationAction,
  ApplyForcedUnallocationAction,
  UnsetForcedUnallocationAction,
  ResetAllCampaignsAction,
  searchCampaignsAction,
  CampaignDisplayStatus,
  WebSDKCampaignStatus,
} from '../../src/types.local';
import { createMockAppDataState, mockCampaign, mockVariation } from '../helpers/reducer-test-utils';

describe('Reducer Actions', () => {
  let initialState: AppDataState;

  beforeEach(() => {
    initialState = createMockAppDataState({
      bucketingFile: {
        campaigns: [mockCampaign],
        panic: false,
      },
    });
  });

  describe('splitCampaignsByAllocation', () => {
    it('should split campaigns into accepted and rejected based on allocation', () => {
      const action: splitCampaignsByAllocationAction = {
        type: 'SPLIT_CAMPAIGNS_BY_ALLOCATION',
        payload: {
          value: {
            [mockCampaign.id]: {
              campaignId: mockCampaign.id,
              variationGroupId: 'vg-1',
              variationId: mockVariation.id,
            },
          },
          visitorData: {
            visitorId: 'visitor-123',
            context: {},
            hasConsented: true,
          },
        },
      };

      const newState = splitCampaignsByAllocation(initialState, action);

      expect(newState.allAcceptedCampaigns).toHaveLength(1);
      expect(newState.allAcceptedCampaigns[0].id).toBe(mockCampaign.id);
      expect(newState.allAcceptedCampaigns[0].status).toBe(WebSDKCampaignStatus.ACCEPTED);
    });

    it('should handle empty allocations', () => {
      const action: splitCampaignsByAllocationAction = {
        type: 'SPLIT_CAMPAIGNS_BY_ALLOCATION',
        payload: {
          value: {},
          visitorData: {
            visitorId: 'visitor-123',
            context: {},
            hasConsented: true,
          },
        },
      };

      const newState = splitCampaignsByAllocation(initialState, action);

      expect(newState.allRejectedCampaigns).toHaveLength(1);
      expect(newState.allRejectedCampaigns[0].id).toBe(mockCampaign.id);
      expect(newState.allRejectedCampaigns[0].status).toBe(WebSDKCampaignStatus.REJECTED);
    });

    it('should update displayed campaigns based on allocation', () => {
      const action: splitCampaignsByAllocationAction = {
        type: 'SPLIT_CAMPAIGNS_BY_ALLOCATION',
        payload: {
          value: {
            [mockCampaign.id]: {
              campaignId: mockCampaign.id,
              variationGroupId: 'vg-1',
              variationId: mockVariation.id,
            },
          },
          visitorData: {
            visitorId: 'visitor-123',
            context: {},
            hasConsented: true,
          },
        },
      };

      const newState = splitCampaignsByAllocation(initialState, action);

      expect(newState.displayedAcceptedCampaigns).toEqual(newState.allAcceptedCampaigns);
      expect(newState.displayedRejectedCampaigns).toEqual(newState.allRejectedCampaigns);
    });
  });

  describe('applyForcedAllocation', () => {
    it('should add campaign to forced allocation', () => {
      const forcedVariation = {
        campaignId: mockCampaign.id,
        campaignName: mockCampaign.name,
        campaignType: mockCampaign.type,
        variationGroupId: 'vg-1',
        variationGroupName: 'Test VG',
        variation: mockVariation,
      };

      const action: ApplyForcedAllocationAction = {
        type: 'APPLY_FORCED_ALLOCATION',
        payload: {
          value: {
            [mockCampaign.id]: forcedVariation,
          },
        },
      };

      const newState = applyForcedAllocation(initialState, action);

      expect(newState.variationsForcedAllocation[mockCampaign.id]).toEqual(forcedVariation);
      expect(newState.shouldSendForcedAllocation).toBe(true);
    });
  });

  describe('unsetForcedAllocation', () => {
    it('should remove campaign from forced allocation', () => {
      const stateWithForced = createMockAppDataState({
        variationsForcedAllocation: {
          [mockCampaign.id]: {
            campaignId: mockCampaign.id,
            campaignName: mockCampaign.name,
            campaignType: mockCampaign.type,
            variationGroupId: 'vg-1',
            variationGroupName: 'Test VG',
            variation: mockVariation,
          },
        },
      });

      const action: UnsetForcedAllocationAction = {
        type: 'UNSET_FORCED_ALLOCATION',
        payload: {
          campaignId: mockCampaign.id,
        },
      };

      const newState = unsetForcedAllocation(stateWithForced, action);

      expect(newState.variationsForcedAllocation[mockCampaign.id]).toBeUndefined();
    });
  });

  describe('applyForceUnallocation', () => {
    it('should add campaign to forced unallocation', () => {
      const forcedVariation = {
        campaignId: mockCampaign.id,
        campaignName: mockCampaign.name,
        campaignType: mockCampaign.type,
        variationGroupId: 'vg-1',
        variationGroupName: 'Test VG',
        variation: mockVariation,
      };

      const action: ApplyForcedUnallocationAction = {
        type: 'APPLY_FORCE_UNALLOCATION',
        payload: {
          value: {
            [mockCampaign.id]: forcedVariation,
          },
        },
      };

      const newState = applyForceUnallocation(initialState, action);

      expect(newState.variationsForcedUnallocation[mockCampaign.id]).toEqual(forcedVariation);
      expect(newState.shouldSendForcedUnallocation).toBe(true);
    });
  });

  describe('unsetForcedUnallocation', () => {
    it('should remove campaign from forced unallocation', () => {
      const stateWithUnallocation = createMockAppDataState({
        variationsForcedUnallocation: {
          [mockCampaign.id]: {
            campaignId: mockCampaign.id,
            campaignName: mockCampaign.name,
            campaignType: mockCampaign.type,
            variationGroupId: 'vg-1',
            variationGroupName: 'Test VG',
            variation: mockVariation,
          },
        },
      });

      const action: UnsetForcedUnallocationAction = {
        type: 'UNSET_FORCED_UNALLOCATION',
        payload: {
          campaignId: mockCampaign.id,
        },
      };

      const newState = unsetForcedUnallocation(stateWithUnallocation, action);

      expect(newState.variationsForcedUnallocation[mockCampaign.id]).toBeUndefined();
    });
  });

  describe('resetAllCampaigns', () => {
    it('should clear all forced allocations and unallocations', () => {
      const stateWithForced = createMockAppDataState({
        variationsForcedAllocation: {
          'campaign-1': {
            campaignId: 'campaign-1',
            campaignName: 'Campaign 1',
            campaignType: mockCampaign.type,
            variationGroupId: 'vg-1',
            variationGroupName: 'VG 1',
            variation: mockVariation,
          },
        },
        variationsForcedUnallocation: {
          'campaign-2': {
            campaignId: 'campaign-2',
            campaignName: 'Campaign 2',
            campaignType: mockCampaign.type,
            variationGroupId: 'vg-2',
            variationGroupName: 'VG 2',
            variation: mockVariation,
          },
        },
      });

      const action: ResetAllCampaignsAction = {
        type: 'RESET_ALL_CAMPAIGNS',
      };

      const newState = resetAllCampaigns(stateWithForced);

      expect(newState.variationsForcedAllocation).toEqual({});
      expect(newState.variationsForcedUnallocation).toEqual({});
    });
  });

  describe('filterCampaignsBySearch', () => {
    it('should filter campaigns by search text', () => {
      const campaign1 = { ...mockCampaign, id: 'camp-1', name: 'Test Campaign' };
      const campaign2 = { ...mockCampaign, id: 'camp-2', name: 'Another Campaign' };

      const stateWithCampaigns = createMockAppDataState({
        allAcceptedCampaigns: [campaign1, campaign2],
        allRejectedCampaigns: [],
      });

      const action: searchCampaignsAction = {
        type: 'SEARCH_CAMPAIGNS',
        payload: {
          searchTerm: 'Test',
        },
      };

      const newState = filterCampaignsBySearch(stateWithCampaigns, action);

      expect(newState.searchValue).toBe('Test');
      expect(newState.displayedAcceptedCampaigns).toHaveLength(1);
      expect(newState.displayedAcceptedCampaigns[0].name).toBe('Test Campaign');
    });

    it('should return all campaigns when search is empty', () => {
      const campaign1 = { ...mockCampaign, id: 'camp-1', name: 'Test Campaign' };
      const campaign2 = { ...mockCampaign, id: 'camp-2', name: 'Another Campaign' };

      const stateWithCampaigns = createMockAppDataState({
        allAcceptedCampaigns: [campaign1, campaign2],
        allRejectedCampaigns: [],
        searchValue: 'previous search',
      });

      const action: searchCampaignsAction = {
        type: 'SEARCH_CAMPAIGNS',
        payload: {
          searchTerm: '',
        },
      };

      const newState = filterCampaignsBySearch(stateWithCampaigns, action);

      expect(newState.searchValue).toBeUndefined();
      expect(newState.displayedAcceptedCampaigns).toHaveLength(2);
    });

    it('should be case-insensitive', () => {
      const campaign = { ...mockCampaign, name: 'Test Campaign' };

      const stateWithCampaigns = createMockAppDataState({
        allAcceptedCampaigns: [campaign],
        allRejectedCampaigns: [],
      });

      const action: searchCampaignsAction = {
        type: 'SEARCH_CAMPAIGNS',
        payload: {
          searchTerm: 'test',
        },
      };

      const newState = filterCampaignsBySearch(stateWithCampaigns, action);

      expect(newState.displayedAcceptedCampaigns).toHaveLength(1);
    });
  });
});

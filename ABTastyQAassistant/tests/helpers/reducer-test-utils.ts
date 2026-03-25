/**
 * Test utilities specifically for reducer testing (without React Native dependencies)
 */
import {
  FsCampaign,
  FsVariation,
  CampaignType,
  WebSDKCampaignStatus,
  CampaignDisplayStatus,
  VisitorData,
  FsVariationToForce,
  AppDataState,
} from '../../src/types.local';
import { ABTastyQA } from '@flagship.io/react-native-sdk';

// ====================
// Mock ABTastyQA
// ====================

export const mockABTastyQA = {
  envId: 'test-env-id',
  emit: jest.fn(),
} as unknown as ABTastyQA;

// ====================
// Mock Variations
// ====================

export const mockVariation: FsVariation = {
  id: 'variation-1',
  name: 'Control',
  modifications: {
    type: 'JSON',
    value: { testFlag: 'control-value' },
  },
  allocation: 50,
  reference: true,
  variationGroupId: 'vg-1',
};

export const mockVariation2: FsVariation = {
  id: 'variation-2',
  name: 'Variant A',
  modifications: {
    type: 'JSON',
    value: { testFlag: 'variant-value' },
  },
  allocation: 50,
  reference: false,
  variationGroupId: 'vg-1',
};

// ====================
// Mock Campaigns
// ====================

export const mockCampaign: FsCampaign = {
  id: 'campaign-1',
  name: 'Test Campaign',
  slug: 'test-campaign',
  type: 'ab' as CampaignType,
  status: 'ACCEPTED' as WebSDKCampaignStatus,
  displayStatus: 'SHOWN' as CampaignDisplayStatus,
  variationGroups: [
    {
      id: 'vg-1',
      name: 'Test VG',
      targeting: {
        targetingGroups: [
          {
            targetings: [
              {
                key: 'platform',
                operator: 'EQUALS' as any,
                value: 'mobile',
              },
            ],
          },
        ],
      },
      variations: [mockVariation, mockVariation2],
    },
  ],
};

export const mockRejectedCampaign: FsCampaign = {
  ...mockCampaign,
  id: 'campaign-2',
  name: 'Rejected Campaign',
  status: 'REJECTED' as WebSDKCampaignStatus,
  displayStatus: 'HIDDEN' as CampaignDisplayStatus,
};

export const mockAllocatedCampaign: FsCampaign = {
  id: 'campaign-allocated',
  name: 'Allocated Campaign',
  slug: 'allocated-campaign',
  type: 'ab' as CampaignType,
  status: 'ACCEPTED' as WebSDKCampaignStatus,
  displayStatus: 'SHOWN' as CampaignDisplayStatus,
  variationGroups: [
    {
      id: 'vg-allocated',
      name: 'Allocated VG',
      targeting: {
        targetingGroups: [
          {
            targetings: [
              {
                key: 'platform',
                operator: 'EQUALS' as any,
                value: 'mobile',
              },
            ],
          },
        ],
      },
      variations: [mockVariation, mockVariation2],
    },
  ],
};

export const mockUnallocatedCampaign: FsCampaign = {
  id: 'campaign-unallocated',
  name: 'Unallocated Campaign',
  slug: 'unallocated-campaign',
  type: 'ab' as CampaignType,
  status: 'ACCEPTED' as WebSDKCampaignStatus,
  displayStatus: 'SHOWN' as CampaignDisplayStatus,
  variationGroups: [
    {
      id: 'vg-unallocated',
      name: 'Unallocated VG',
      targeting: {
        targetingGroups: [
          {
            targetings: [
              {
                key: 'platform',
                operator: 'EQUALS' as any,
                value: 'mobile',
              },
            ],
          },
        ],
      },
      variations: [mockVariation, mockVariation2],
    },
  ],
};

// ====================
// Mock Visitor Data
// ====================

export const mockVisitorData: VisitorData = {
  visitorId: 'visitor-123',
  context: {
    platform: 'mobile',
    version: '1.0.0',
  },
  hasConsented: true,
};

// ====================
// Mock Forced Variation
// ====================

export const mockForcedVariation: FsVariationToForce = {
  campaignId: 'campaign-1',
  campaignName: 'Test Campaign',
  campaignType: 'ab' as CampaignType,
  variationGroupId: 'vg-1',
  variationGroupName: 'Test VG',
  variation: mockVariation2,
};

// ====================
// Mock App Data State Factory
// ====================

export const createMockAppDataState = (overrides?: Partial<AppDataState>): AppDataState => ({
  ABTastQA: mockABTastyQA,
  fsEnvId: 'test-env-id',
  bucketingFile: undefined,
  allAcceptedCampaigns: [mockCampaign],
  allRejectedCampaigns: [mockRejectedCampaign],
  allExposedCampaigns: [],
  variationsForcedAllocation: {},
  variationsForcedUnallocation: {},
  displayedAcceptedCampaigns: [mockCampaign],
  displayedRejectedCampaigns: [mockRejectedCampaign],
  shouldSendForcedUnallocation: false,
  shouldSendForcedAllocation: false,
  visitorData: mockVisitorData,
  sdkInfo: {
    name: '@flagship.io/react-native-sdk',
    version: '5.0.2',
    tag: 'v5.0.2',
  },
  isCampaignsLoading: false,
  searchValue: '',
  ...overrides,
});

// ====================
// Factory Functions
// ====================

export function createMockCampaign(overrides?: Partial<FsCampaign>): FsCampaign {
  return {
    ...mockCampaign,
    ...overrides,
  };
}

export function createMockVariation(overrides?: Partial<FsVariation>): FsVariation {
  return {
    ...mockVariation,
    ...overrides,
  };
}

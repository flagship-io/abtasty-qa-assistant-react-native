import React from 'react';
import { render, RenderOptions } from '@testing-library/react-native';
import { AppProvider } from '../../src/providers/AppProvider';
import { HitProvider } from '../../src/providers/HitProvider';
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
import { VisitorVariations, ABTastyQA } from '@flagship.io/react-native-sdk';

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
  variationGroupName: 'Variation Group 1',
};

export const mockVariation2: FsVariation = {
  id: 'variation-2',
  name: 'Treatment',
  modifications: {
    type: 'JSON',
    value: { testFlag: 'treatment-value' },
  },
  allocation: 50,
  reference: false,
  variationGroupId: 'vg-1',
  variationGroupName: 'Variation Group 1',
};

// ====================
// Mock Campaigns
// ====================

export const mockCampaign: FsCampaign = {
  id: 'campaign-1',
  name: 'Test Campaign',
  type: CampaignType.ab,
  status: WebSDKCampaignStatus.ACCEPTED,
  displayStatus: CampaignDisplayStatus.SHOWN,
  hasTargetingMatched: true,
  slug: 'test-campaign',
  variationGroups: [
    {
      id: 'vg-1',
      name: 'Variation Group 1',
      targeting: {
        targetingGroups: [],
      },
      variations: [mockVariation, mockVariation2],
    },
  ],
};

export const mockRejectedCampaign: FsCampaign = {
  ...mockCampaign,
  id: 'campaign-rejected',
  name: 'Rejected Campaign',
  status: WebSDKCampaignStatus.REJECTED,
  displayStatus: CampaignDisplayStatus.HIDDEN,
};

// ====================
// Mock Visitor Data
// ====================

export const mockVisitorData: VisitorData = {
  visitorId: 'test-visitor-123',
  context: {
    device_type: 'mobile',
    os_name: 'ios',
    app_version: '1.0.0',
  },
  hasConsented: true,
};

// Mock visitor variations (allocated)
export const mockVisitorVariations: VisitorVariations = {
  campaignId: 'campaign-1',
  variationGroupId: 'vg-1',
  variationId: 'variation-1',
};

// Mock forced variation
export const mockForcedVariation: FsVariationToForce = {
  campaignId: 'campaign-1',
  campaignName: 'Test Campaign',
  campaignType: CampaignType.ab,
  variationGroupId: 'vg-1',
  variationGroupName: 'Variation Group 1',
  variation: mockVariation2,
};

// ====================
// Mock Hits
// ====================

export const mockHit = {
  type: 'SCREEN_VIEW',
  documentLocation: 'test-screen',
  timestamp: Date.now(),
  visitorId: 'test-visitor-123',
};

// ====================
// Factory Functions
// ====================

/**
 * Factory function to create initial app state for testing
 * Can be customized with partial overrides
 */
export const createMockAppDataState = (overrides?: Partial<AppDataState>): AppDataState => ({
  ABTastQA: {} as any,
  fsEnvId: 'test-env-id',
  bucketingFile: {
    campaigns: [mockCampaign],
  },
  allocatedVariations: {
    'campaign-1': mockVisitorVariations,
  },
  forcedVariations: {},
  exposedVariations: {},
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
// Custom Render with Providers
// ====================

const AllTheProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <AppProvider ABTastQA={mockABTastyQA}>
      <HitProvider ABTastQA={mockABTastyQA}>
        {children}
      </HitProvider>
    </AppProvider>
  );
};

const customRender = (
  ui: React.ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options });

// Re-export everything from @testing-library/react-native
export * from '@testing-library/react-native';
// Export custom render as default render
export { customRender as render };

// ====================
// Test Utilities
// ====================

/**
 * Wait for an async operation to complete
 * Useful for testing async state updates
 */
export const waitForAsync = (fn: () => void, timeout = 1000): Promise<void> => {
  return new Promise<void>((resolve, reject) => {
    const startTime = Date.now();
    const check = () => {
      try {
        fn();
        resolve();
      } catch (error) {
        if (Date.now() - startTime < timeout) {
          setTimeout(check, 10);
        } else {
          reject(error);
        }
      }
    };
    check();
  });
};

// ====================
// Mock Navigation Factories
// ====================

/**
 * Create a mock navigation prop for testing
 */
export const createMockNavigation = (overrides = {}) => ({
  navigate: jest.fn(),
  goBack: jest.fn(),
  setOptions: jest.fn(),
  addListener: jest.fn(),
  removeListener: jest.fn(),
  canGoBack: jest.fn(() => true),
  dispatch: jest.fn(),
  reset: jest.fn(),
  isFocused: jest.fn(() => true),
  ...overrides,
});

/**
 * Create a mock route prop for testing
 */
export const createMockRoute = (params = {}, name = 'TestScreen') => ({
  key: `${name}-key`,
  name,
  params,
});

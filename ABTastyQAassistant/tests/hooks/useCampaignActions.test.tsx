import React from 'react';
import { renderHook } from '@testing-library/react-native';
import {
  useForcedVariationActions,
  useCampaignAllocation,
  useCampaignUnallocation,
  useResetAllCampaignsAction,
} from '../../src/hooks/useCampaignActions';
import { createMockAppDataState } from '../helpers/reducer-test-utils';
import { AppContext } from '../../src/contexts/appContext';
import type { AppDataState } from '../../src/types.local';

// Mock SDK
jest.mock('@flagship.io/react-native-sdk', () => ({
  QAEventQaAssistantName: {
    QA_APPLY_FORCED_VARIATIONS: 'QA_APPLY_FORCED_VARIATIONS',
    QA_RESET_ALL_CAMPAIGNS: 'QA_RESET_ALL_CAMPAIGNS',
  },
}));

function createWrapper(appDataState: AppDataState, mockDispatch = jest.fn()) {
  return ({ children }: { children: React.ReactNode }) => (
    <AppContext.Provider
      value={{
        appDataState,
        dispatchAppData: mockDispatch,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

describe('useForcedVariationActions', () => {
  it('should provide applyVariation function', () => {
    const mockDispatch = jest.fn();
    const mockState = createMockAppDataState();
    const wrapper = createWrapper(mockState, mockDispatch);

    const { result } = renderHook(() => useForcedVariationActions(), { wrapper });

    expect(result.current.applyVariation).toBeDefined();
    expect(typeof result.current.applyVariation).toBe('function');
  });

  it('should call dispatch with correct action when applyVariation is invoked', () => {
    const mockDispatch = jest.fn();
    const mockState = createMockAppDataState();
    mockState.ABTastQA = {
      ABTastyQAEventBus: {
        emitQAEventToSDK: jest.fn(),
      },
    } as any;
    const wrapper = createWrapper(mockState, mockDispatch);

    const forcedVariations = {
      'campaign-1': {
        campaignId: 'campaign-1',
        campaignName: 'Test',
        campaignType: 'ab' as any,
        variationGroupId: 'vg-1',
        variationGroupName: 'Test VG',
        variation: {
          id: 'var-1',
          name: 'Variation 1',
          reference: false,
          modifications: { type: 'JSON', value: {} },
        },
      },
    };

    const { result } = renderHook(() => useForcedVariationActions(), { wrapper });
    result.current.applyVariation(forcedVariations);

    expect(mockDispatch).toHaveBeenCalledTimes(1);
    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'APPLY_FORCE_VARIATION',
      payload: forcedVariations,
    });
  });
});

describe('useCampaignAllocation', () => {
  it('should provide applyAllocation and unsetAllocation functions', () => {
    const mockDispatch = jest.fn();
    const mockState = createMockAppDataState();
    const wrapper = createWrapper(mockState, mockDispatch);

    const { result } = renderHook(() => useCampaignAllocation(), { wrapper });

    expect(result.current.applyAllocation).toBeDefined();
    expect(result.current.unsetAllocation).toBeDefined();
    expect(typeof result.current.applyAllocation).toBe('function');
    expect(typeof result.current.unsetAllocation).toBe('function');
  });

  it('should call dispatch with APPLY_FORCED_ALLOCATION action when applyAllocation is invoked', () => {
    const mockDispatch = jest.fn();
    const mockState = createMockAppDataState();
    const wrapper = createWrapper(mockState, mockDispatch);

    const { result } = renderHook(() => useCampaignAllocation(), { wrapper });
    result.current.applyAllocation();

    expect(mockDispatch).toHaveBeenCalledTimes(1);
    expect(mockDispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'APPLY_FORCED_ALLOCATION',
        payload: expect.objectContaining({
          value: expect.any(Object),
        }),
      })
    );
  });

  it('should call dispatch with UNSET_FORCED_ALLOCATION action when unsetAllocation is invoked', () => {
    const mockDispatch = jest.fn();
    const mockState = createMockAppDataState();
    const wrapper = createWrapper(mockState, mockDispatch);

    const { result } = renderHook(() => useCampaignAllocation(), { wrapper });
    result.current.unsetAllocation('campaign-1');

    expect(mockDispatch).toHaveBeenCalledTimes(1);
    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'UNSET_FORCED_ALLOCATION',
      payload: { campaignId: 'campaign-1' },
    });
  });

  it('should merge existing allocations when applying new ones', () => {
    const mockDispatch = jest.fn();
    const existingAllocation = {
      'campaign-1': {
        campaignId: 'campaign-1',
        campaignName: 'Existing',
        campaignType: 'ab' as any,
        CampaignSlug: 'existing',
        variationGroupId: 'vg-1',
        variationGroupName: 'VG 1',
        variation: {
          id: 'var-1',
          name: 'Var 1',
          reference: false,
          modifications: { type: 'JSON', value: {} },
        },
      },
    };
    const mockState = createMockAppDataState({
      variationsForcedAllocation: existingAllocation,
    });
    const wrapper = createWrapper(mockState, mockDispatch);

    const newAllocation = {
      'campaign-2': {
        campaignId: 'campaign-2',
        campaignName: 'New',
        campaignType: 'ab' as any,
        CampaignSlug: 'new',
        variationGroupId: 'vg-2',
        variationGroupName: 'VG 2',
        variation: {
          id: 'var-2',
          name: 'Var 2',
          reference: false,
          modifications: { type: 'JSON', value: {} },
        },
      },
    };

    const { result } = renderHook(() => useCampaignAllocation(), { wrapper });
    result.current.applyAllocation(newAllocation);

    expect(mockDispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        payload: expect.objectContaining({
          value: expect.objectContaining({
            'campaign-1': existingAllocation['campaign-1'],
            'campaign-2': newAllocation['campaign-2'],
          }),
        }),
      })
    );
  });

  it('should handle empty forced allocations when applying new ones', () => {
    const mockDispatch = jest.fn();
    const mockState = createMockAppDataState({
      variationsForcedAllocation: {},
    });
    const wrapper = createWrapper(mockState, mockDispatch);

    const newAllocation = {
      'campaign-1': {
        campaignId: 'campaign-1',
        campaignName: 'New',
        campaignType: 'ab' as any,
        CampaignSlug: 'new',
        variationGroupId: 'vg-1',
        variationGroupName: 'VG 1',
        variation: {
          id: 'var-1',
          name: 'Var 1',
          reference: false,
          modifications: { type: 'JSON', value: {} },
        },
      },
    };

    const { result } = renderHook(() => useCampaignAllocation(), { wrapper });
    result.current.applyAllocation(newAllocation);

    expect(mockDispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        payload: expect.objectContaining({
          value: newAllocation,
        }),
      })
    );
  });
});

describe('useCampaignUnallocation', () => {
  it('should provide applyUnallocation and unsetUnallocation functions', () => {
    const mockDispatch = jest.fn();
    const mockState = createMockAppDataState();
    const wrapper = createWrapper(mockState, mockDispatch);

    const { result } = renderHook(() => useCampaignUnallocation(), { wrapper });

    expect(result.current.applyUnallocation).toBeDefined();
    expect(result.current.unsetUnallocation).toBeDefined();
    expect(typeof result.current.applyUnallocation).toBe('function');
    expect(typeof result.current.unsetUnallocation).toBe('function');
  });

  it('should call dispatch with APPLY_FORCE_UNALLOCATION action when applyUnallocation is invoked', () => {
    const mockDispatch = jest.fn();
    const mockState = createMockAppDataState();
    const wrapper = createWrapper(mockState, mockDispatch);

    const { result } = renderHook(() => useCampaignUnallocation(), { wrapper });
    result.current.applyUnallocation();

    expect(mockDispatch).toHaveBeenCalledTimes(1);
    expect(mockDispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'APPLY_FORCE_UNALLOCATION',
        payload: expect.objectContaining({
          value: expect.any(Object),
        }),
      })
    );
  });

  it('should call dispatch with UNSET_FORCED_UNALLOCATION action when unsetUnallocation is invoked', () => {
    const mockDispatch = jest.fn();
    const mockState = createMockAppDataState();
    const wrapper = createWrapper(mockState, mockDispatch);

    const { result } = renderHook(() => useCampaignUnallocation(), { wrapper });
    result.current.unsetUnallocation('campaign-1');

    expect(mockDispatch).toHaveBeenCalledTimes(1);
    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'UNSET_FORCED_UNALLOCATION',
      payload: { campaignId: 'campaign-1' },
    });
  });

  it('should merge existing unallocations when applying new ones', () => {
    const mockDispatch = jest.fn();
    const existingUnallocation = {
      'campaign-1': {
        campaignId: 'campaign-1',
        campaignName: 'Existing',
        campaignType: 'ab' as any,
        CampaignSlug: 'existing',
        variationGroupId: 'vg-1',
        variationGroupName: 'VG 1',
        variation: {
          id: 'var-1',
          name: 'Var 1',
          reference: false,
          modifications: { type: 'JSON', value: {} },
        },
      },
    };
    const mockState = createMockAppDataState({
      variationsForcedUnallocation: existingUnallocation,
    });
    const wrapper = createWrapper(mockState, mockDispatch);

    const newUnallocation = {
      'campaign-2': {
        campaignId: 'campaign-2',
        campaignName: 'New',
        campaignType: 'ab' as any,
        CampaignSlug: 'new',
        variationGroupId: 'vg-2',
        variationGroupName: 'VG 2',
        variation: {
          id: 'var-2',
          name: 'Var 2',
          reference: false,
          modifications: { type: 'JSON', value: {} },
        },
      },
    };

    const { result } = renderHook(() => useCampaignUnallocation(), { wrapper });
    result.current.applyUnallocation(newUnallocation);

    expect(mockDispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        payload: expect.objectContaining({
          value: expect.objectContaining({
            'campaign-1': existingUnallocation['campaign-1'],
            'campaign-2': newUnallocation['campaign-2'],
          }),
        }),
      })
    );
  });

  it('should handle empty forced unallocations when applying new ones', () => {
    const mockDispatch = jest.fn();
    const mockState = createMockAppDataState({
      variationsForcedUnallocation: {},
    });
    const wrapper = createWrapper(mockState, mockDispatch);

    const newUnallocation = {
      'campaign-1': {
        campaignId: 'campaign-1',
        campaignName: 'New',
        campaignType: 'ab' as any,
        CampaignSlug: 'new',
        variationGroupId: 'vg-1',
        variationGroupName: 'VG 1',
        variation: {
          id: 'var-1',
          name: 'Var 1',
          reference: false,
          modifications: { type: 'JSON', value: {} },
        },
      },
    };

    const { result } = renderHook(() => useCampaignUnallocation(), { wrapper });
    result.current.applyUnallocation(newUnallocation);

    expect(mockDispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        payload: expect.objectContaining({
          value: newUnallocation,
        }),
      })
    );
  });
});

describe('useResetAllCampaignsAction', () => {
  it('should return reinitializeAllCampaigns function', () => {
    const mockDispatch = jest.fn();
    const mockState = createMockAppDataState();
    const wrapper = createWrapper(mockState, mockDispatch);

    const { result } = renderHook(() => useResetAllCampaignsAction(), { wrapper });

    expect(result.current.reinitializeAllCampaigns).toBeDefined();
    expect(typeof result.current.reinitializeAllCampaigns).toBe('function');
  });

  it('should call dispatch with RESET_ALL_CAMPAIGNS action when reinitializeAllCampaigns is invoked', () => {
    const mockDispatch = jest.fn();
    const mockState = createMockAppDataState();
    const wrapper = createWrapper(mockState, mockDispatch);

    const { result } = renderHook(() => useResetAllCampaignsAction(), { wrapper });
    result.current.reinitializeAllCampaigns();

    expect(mockDispatch).toHaveBeenCalledTimes(1);
    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'RESET_ALL_CAMPAIGNS',
    });
  });
});

import React from 'react';
import { renderHook } from '@testing-library/react-native';
import { useCampaign, useCampaignVariationStates, useCanShowVariationAction } from '../../src/hooks/useCampaigns';
import { mockCampaign, createMockAppDataState } from '../helpers/reducer-test-utils';
import { AppContext } from '../../src/contexts/appContext';
import type { AppDataState } from '../../src/types.local';
import { CampaignDisplayStatus, WebSDKCampaignStatus } from '../../src/types.local';

function createWrapper(appDataState: AppDataState) {
  return ({ children }: { children: React.ReactNode }) => (
    <AppContext.Provider
      value={{
        appDataState,
        dispatchAppData: jest.fn(),
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

describe('useCampaign', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should find campaign in accepted campaigns', () => {
    const mockState = createMockAppDataState({
      allAcceptedCampaigns: [mockCampaign],
      allRejectedCampaigns: [],
    });

    const wrapper = createWrapper(mockState);
    const { result } = renderHook(() => useCampaign(mockCampaign.id), { wrapper });

    expect(result.current).toBeDefined();
    expect(result.current?.id).toBe(mockCampaign.id);
  });

  it('should find campaign in rejected campaigns', () => {
    const rejectedCampaign = { ...mockCampaign, id: 'rejected-1' };
    const mockState = createMockAppDataState({
      allAcceptedCampaigns: [],
      allRejectedCampaigns: [rejectedCampaign],
    });

    const wrapper = createWrapper(mockState);
    const { result } = renderHook(() => useCampaign(rejectedCampaign.id), { wrapper });

    expect(result.current).toBeDefined();
    expect(result.current?.id).toBe(rejectedCampaign.id);
  });

  it('should return undefined when campaign not found', () => {
    const mockState = createMockAppDataState({
      allAcceptedCampaigns: [],
      allRejectedCampaigns: [],
    });

    const wrapper = createWrapper(mockState);
    const { result } = renderHook(() => useCampaign('non-existent-id'), { wrapper });

    expect(result.current).toBeUndefined();
  });

  it('should prioritize accepted campaigns over rejected', () => {
    const acceptedCampaign = { ...mockCampaign, name: 'Accepted' };
    const rejectedCampaign = { ...mockCampaign, name: 'Rejected' };
    
    const mockState = createMockAppDataState({
      allAcceptedCampaigns: [acceptedCampaign],
      allRejectedCampaigns: [rejectedCampaign],
    });

    const wrapper = createWrapper(mockState);
    const { result } = renderHook(() => useCampaign(mockCampaign.id), { wrapper });

    expect(result.current?.name).toBe('Accepted');
  });
});

describe('useCampaignVariationStates', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return forced variation for campaign', () => {
    const forcedVariation = {
      campaignId: mockCampaign.id,
      campaignName: mockCampaign.name,
      campaignType: mockCampaign.type,
      variationGroupId: 'vg-1',
      variation: {
        id: 'var-1',
        name: 'Forced Var',
        modifications: { type: 'JSON', value: {} },
      },
    };

    const mockState = createMockAppDataState({
      forcedVariations: { [mockCampaign.id]: forcedVariation },
    });

    const wrapper = createWrapper(mockState);
    const { result } = renderHook(() => useCampaignVariationStates(mockCampaign.id), { wrapper });

    expect(result.current.forcedVariation).toBeDefined();
    expect(result.current.forcedVariation?.campaignId).toBe(mockCampaign.id);
  });

  it('should return undefined when no forced variations exist', () => {
    const mockState = createMockAppDataState({
      forcedVariations: {},
    });

    const wrapper = createWrapper(mockState);
    const { result } = renderHook(() => useCampaignVariationStates(mockCampaign.id), { wrapper });

    expect(result.current.forcedVariation).toBeUndefined();
  });
});

describe('useCanShowVariationAction', () => {
  it('should return true for ACCEPTED campaign with SHOWN status', () => {
    const { result } = renderHook(() =>
      useCanShowVariationAction(
        WebSDKCampaignStatus.ACCEPTED,
        CampaignDisplayStatus.SHOWN
      )
    );

    expect(result.current).toBe(true);
  });

  it('should return true for REJECTED campaign with RESET status', () => {
    const { result } = renderHook(() =>
      useCanShowVariationAction(
        WebSDKCampaignStatus.REJECTED,
        CampaignDisplayStatus.RESET
      )
    );

    expect(result.current).toBe(true);
  });

  it('should return false for ACCEPTED campaign with HIDDEN status', () => {
    const { result } = renderHook(() =>
      useCanShowVariationAction(
        WebSDKCampaignStatus.ACCEPTED,
        CampaignDisplayStatus.HIDDEN
      )
    );

    expect(result.current).toBe(false);
  });

  it('should return false for ACCEPTED campaign with RESET status', () => {
    const { result } = renderHook(() =>
      useCanShowVariationAction(
        WebSDKCampaignStatus.ACCEPTED,
        CampaignDisplayStatus.RESET
      )
    );

    expect(result.current).toBe(false);
  });

  it('should return false for REJECTED campaign with SHOWN status', () => {
    const { result } = renderHook(() =>
      useCanShowVariationAction(
        WebSDKCampaignStatus.REJECTED,
        CampaignDisplayStatus.SHOWN
      )
    );

    expect(result.current).toBe(false);
  });

  it('should return false for REJECTED campaign with HIDDEN status', () => {
    const { result } = renderHook(() =>
      useCanShowVariationAction(
        WebSDKCampaignStatus.REJECTED,
        CampaignDisplayStatus.HIDDEN
      )
    );

    expect(result.current).toBe(false);
  });
});

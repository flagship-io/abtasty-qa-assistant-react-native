import React from 'react';
import { renderHook } from '@testing-library/react-native';
import { useCampaignVariations, useVariation, useActiveVariationId } from '../../src/hooks/useVariations';
import {
  mockCampaign,
  mockVariation,
  mockVariation2,
  createMockAppDataState,
  createMockCampaign,
  createMockVariation,
} from '../helpers/reducer-test-utils';
import { AppContext } from '../../src/contexts/appContext';
import type { AppDataState, FsCampaign } from '../../src/types.local';

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

describe('useCampaignVariations', () => {
  it('should return variations for a given campaign', () => {
    const campaign = createMockCampaign();
    const appDataState = createMockAppDataState({
      allAcceptedCampaigns: [campaign],
    });
    const wrapper = createWrapper(appDataState);

    const { result } = renderHook(() => useCampaignVariations(campaign.id), { wrapper });

    expect(result.current).toHaveLength(2);
    expect(result.current[0].id).toBe(mockVariation.id);
    expect(result.current[1].id).toBe(mockVariation2.id);
  });

  it('should return empty array when campaign is not found', () => {
    const appDataState = createMockAppDataState();
    const wrapper = createWrapper(appDataState);

    const { result } = renderHook(() => useCampaignVariations('non-existent-id'), { wrapper });

    expect(result.current).toEqual([]);
  });

  it('should return empty array when campaign has no variations', () => {
    const campaign = createMockCampaign({ variationGroups: [] });
    const appDataState = createMockAppDataState({
      allAcceptedCampaigns: [campaign],
    });
    const wrapper = createWrapper(appDataState);

    const { result } = renderHook(() => useCampaignVariations(campaign.id), { wrapper });

    expect(result.current).toEqual([]);
  });

  it('should return variations with default modifications', () => {
    const variation1 = createMockVariation({ id: 'var1' });
    const variation2 = createMockVariation({ id: 'var2' });
    const campaign = createMockCampaign({
      variationGroups: [
        {
          id: 'vg-1',
          name: 'Test VG',
          targeting: { targetingGroups: [] },
          variations: [variation1, variation2],
        },
      ],
    });
    const appDataState = createMockAppDataState({
      allAcceptedCampaigns: [campaign],
    });
    const wrapper = createWrapper(appDataState);

    const { result } = renderHook(() => useCampaignVariations(campaign.id), { wrapper });

    expect(result.current).toHaveLength(2);
    expect(result.current[0]).toMatchObject({
      id: 'var1',
      modifications: { type: 'JSON', value: { testFlag: 'control-value' } },
    });
    expect(result.current[1]).toMatchObject({
      id: 'var2',
      modifications: { type: 'JSON', value: { testFlag: 'control-value' } },
    });
  });
});

describe('useActiveVariationId', () => {
  it('should return forced variation ID when set', () => {
    const campaign = createMockCampaign();
    const appDataState = createMockAppDataState({
      allAcceptedCampaigns: [campaign],
      forcedVariations: {
        [campaign.id]: {
          campaignId: campaign.id,
          campaignName: campaign.name,
          campaignType: campaign.type,
          variationGroupId: 'vg-1',
          variationGroupName: 'Test VG',
          variation: {
            id: 'forced-var-id',
            reference: false,
            modifications: { type: '', value: null },
          },
        },
      },
    });
    const wrapper = createWrapper(appDataState);

    const { result } = renderHook(() => useActiveVariationId(campaign.id), { wrapper });

    expect(result.current).toBe('forced-var-id');
  });

  it('should return undefined when campaign is not found', () => {
    const appDataState = createMockAppDataState();
    const wrapper = createWrapper(appDataState);

    const { result } = renderHook(() => useActiveVariationId('non-existent-id'), { wrapper });

    expect(result.current).toBeUndefined();
  });

  it('should prioritize forced variation over allocated variation', () => {
    const campaign = createMockCampaign();
    const appDataState = createMockAppDataState({
      allAcceptedCampaigns: [campaign],
      forcedVariations: {
        [campaign.id]: {
          campaignId: campaign.id,
          campaignName: campaign.name,
          campaignType: campaign.type,
          variationGroupId: 'vg-1',
          variationGroupName: 'Test VG',
          variation: {
            id: 'forced-var-id',
            reference: false,
            modifications: { type: '', value: null },
          },
        },
      },
      variationsForcedAllocation: {
        [campaign.id]: {
          campaignId: campaign.id,
          campaignName: campaign.name,
          campaignType: campaign.type,
          variationGroupId: 'vg-1',
          variationGroupName: 'Test VG',
          variation: {
            id: 'allocated-var-id',
            reference: false,
            modifications: { type: '', value: null },
          },
        },
      },
    });
    const wrapper = createWrapper(appDataState);

    const { result } = renderHook(() => useActiveVariationId(campaign.id), { wrapper });

    expect(result.current).toBe('forced-var-id');
  });
});

describe('useVariation', () => {
  it('should return variation by ID', () => {
    const variation = createMockVariation({ id: 'var-123' });
    const campaign = createMockCampaign({
      variationGroups: [
        {
          id: 'vg-1',
          name: 'Test VG',
          targeting: { targetingGroups: [] },
          variations: [variation],
        },
      ],
    });
    const appDataState = createMockAppDataState({
      allAcceptedCampaigns: [campaign],
    });
    const wrapper = createWrapper(appDataState);

    const { result } = renderHook(() => useVariation(campaign.id, 'var-123'), { wrapper });

    expect(result.current).toMatchObject({ id: 'var-123' });
  });

  it('should return undefined when variation is not found', () => {
    const campaign = createMockCampaign({
      variationGroups: [
        {
          id: 'vg-1',
          name: 'Test VG',
          targeting: { targetingGroups: [] },
          variations: [createMockVariation({ id: 'var-1' })],
        },
      ],
    });
    const appDataState = createMockAppDataState({
      allAcceptedCampaigns: [campaign],
    });
    const wrapper = createWrapper(appDataState);

    const { result } = renderHook(() => useVariation(campaign.id, 'non-existent-var'), { wrapper });

    expect(result.current).toBeUndefined();
  });

  it('should return undefined when campaign is not found', () => {
    const appDataState = createMockAppDataState();
    const wrapper = createWrapper(appDataState);

    const { result } = renderHook(() => useVariation('non-existent-campaign', 'var-123'), { wrapper });

    expect(result.current).toBeUndefined();
  });

  it('should handle multiple variations correctly', () => {
    const variations = [
      createMockVariation({ id: 'var-1', reference: true }),
      createMockVariation({ id: 'var-2', reference: false }),
      createMockVariation({ id: 'var-3', reference: false }),
    ];
    const campaign = createMockCampaign({
      variationGroups: [
        {
          id: 'vg-1',
          name: 'Test VG',
          targeting: { targetingGroups: [] },
          variations,
        },
      ],
    });
    const appDataState = createMockAppDataState({
      allAcceptedCampaigns: [campaign],
    });
    const wrapper = createWrapper(appDataState);

    const { result: result1 } = renderHook(() => useVariation(campaign.id, 'var-1'), { wrapper });
    const { result: result2 } = renderHook(() => useVariation(campaign.id, 'var-2'), { wrapper });
    const { result: result3 } = renderHook(() => useVariation(campaign.id, 'var-3'), { wrapper });

    expect(result1.current?.id).toBe('var-1');
    expect(result1.current?.reference).toBe(true);
    expect(result2.current?.id).toBe('var-2');
    expect(result2.current?.reference).toBe(false);
    expect(result3.current?.id).toBe('var-3');
    expect(result3.current?.reference).toBe(false);
  });
});

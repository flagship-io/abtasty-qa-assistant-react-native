import React from 'react';
import { render } from '@testing-library/react-native';
import { AllocationVariationGr } from '../../../src/components/allocation/AllocationVariationGr';
import { CampaignDisplayStatus, WebSDKCampaignStatus } from '../../../src/types.local';

// Mock the useAllocationBackground hook
jest.mock('../../../src/hooks/useBackground', () => ({
  useAllocationBackground: jest.fn(() => ({
    backgroundColor: '#ffffff',
    borderColor: '#000000',
    iconColor: '#333333',
    Icon: () => 'Icon',
  })),
}));

const createMockVariationGroup = (overrides = {}) => ({
  id: 'vg-1',
  name: 'Variation Group 1',
  variations: [
    { id: 'var-1', name: 'Control', allocation: 50, reference: true, modifications: { type: 'JSON', value: {} } },
    { id: 'var-2', name: 'Variant A', allocation: 50, reference: false, modifications: { type: 'JSON', value: {} } },
  ],
  targeting: {
    targetingGroups: [
      { targetings: [], allMatched: true },
    ],
  },
  ...overrides,
});

describe('AllocationVariationGr Component', () => {
  it('should render variation group with allocations', () => {
    const variationGroup = createMockVariationGroup();
    const { toJSON, getByText, getAllByText } = render(
      <AllocationVariationGr
        variationGroup={variationGroup}
        displayStatus={CampaignDisplayStatus.SHOWN}
        campaignStatus={WebSDKCampaignStatus.ACCEPTED}
      />
    );
    expect(toJSON()).toMatchSnapshot();
    expect(getByText('Control:')).toBeTruthy();
    expect(getAllByText('50%').length).toBeGreaterThan(0);
    expect(getByText('Variant A:')).toBeTruthy();
    expect(getAllByText('50%').length).toBeGreaterThan(0);
  });

  it('should show group name for personal campaign', () => {
    const variationGroup = createMockVariationGroup({ name: 'Personal Group' });
    const { getByText, toJSON } = render(
      <AllocationVariationGr
        variationGroup={variationGroup}
        displayStatus={CampaignDisplayStatus.SHOWN}
        campaignStatus={WebSDKCampaignStatus.ACCEPTED}
        isPersonalCampaign={true}
      />
    );
    expect(getByText('Personal Group')).toBeTruthy();
    expect(toJSON()).toMatchSnapshot();
  });

  it('should not show group name when not personal campaign', () => {
    const variationGroup = createMockVariationGroup({ name: 'Hidden Group' });
    const { queryByText, toJSON } = render(
      <AllocationVariationGr
        variationGroup={variationGroup}
        displayStatus={CampaignDisplayStatus.SHOWN}
        campaignStatus={WebSDKCampaignStatus.ACCEPTED}
        isPersonalCampaign={false}
      />
    );
    expect(queryByText('Hidden Group')).toBeNull();
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render with different display statuses', () => {
    const variationGroup = createMockVariationGroup();
    
    // SHOWN status
    const shownTree = render(
      <AllocationVariationGr
        variationGroup={variationGroup}
        displayStatus={CampaignDisplayStatus.SHOWN}
        campaignStatus={WebSDKCampaignStatus.ACCEPTED}
      />
    ).toJSON();
    expect(shownTree).toMatchSnapshot();

    // HIDDEN status
    const hiddenTree = render(
      <AllocationVariationGr
        variationGroup={variationGroup}
        displayStatus={CampaignDisplayStatus.HIDDEN}
        campaignStatus={WebSDKCampaignStatus.REJECTED}
      />
    ).toJSON();
    expect(hiddenTree).toMatchSnapshot();

    // RESET status
    const resetTree = render(
      <AllocationVariationGr
        variationGroup={variationGroup}
        displayStatus={CampaignDisplayStatus.RESET}
        campaignStatus={WebSDKCampaignStatus.ACCEPTED}
      />
    ).toJSON();
    expect(resetTree).toMatchSnapshot();
  });

  it('should handle variation group with no matched targeting', () => {
    const variationGroup = createMockVariationGroup({
      targeting: { targetingGroups: [{ targetings: [], allMatched: false }] },
    });
    const { toJSON } = render(
      <AllocationVariationGr
        variationGroup={variationGroup}
        displayStatus={CampaignDisplayStatus.HIDDEN}
        campaignStatus={WebSDKCampaignStatus.REJECTED}
      />
    );
    expect(toJSON()).toMatchSnapshot();
  });

  it('should handle multiple variations', () => {
    const variationGroup = createMockVariationGroup({
      variations: [
        { id: 'var-1', name: 'Control', allocation: 33, reference: true, modifications: { type: 'JSON', value: {} } },
        { id: 'var-2', name: 'Variant A', allocation: 33, reference: false, modifications: { type: 'JSON', value: {} } },
        { id: 'var-3', name: 'Variant B', allocation: 34, reference: false, modifications: { type: 'JSON', value: {} } },
      ],
    });
    const { getByText, toJSON } = render(
      <AllocationVariationGr
        variationGroup={variationGroup}
        displayStatus={CampaignDisplayStatus.SHOWN}
        campaignStatus={WebSDKCampaignStatus.ACCEPTED}
      />
    );
    expect(getByText('Variant A:')).toBeTruthy();
    expect(getByText('Variant B:')).toBeTruthy();
    expect(toJSON()).toMatchSnapshot();
  });
});

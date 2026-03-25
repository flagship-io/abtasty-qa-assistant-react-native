import React from 'react';
import { render } from '@testing-library/react-native';
import { TargetingVariationGr } from '../../../src/components/targeting/TargetingVariationGr';
import { TargetingOperator, CampaignDisplayStatus, WebSDKCampaignStatus } from '../../../src/types.local';

// Mock TargetingGroupItem component
jest.mock('../../../src/components/targeting/TargetingGroupItem', () => ({
  TargetingGroupItem: ({ targetingGroup, isLast, style }: any) => {
    const React = require('react');
    const { Text, View } = require('react-native');
    return React.createElement(
      View,
      { testID: 'targeting-group', style },
      React.createElement(
        Text,
        {},
        `Group: ${targetingGroup.targetings.length} targetings${isLast ? '' : ' OR'}`
      )
    );
  },
}));

describe('TargetingVariationGr', () => {
  const mockVariationGroup = {
    id: 'vg1',
    name: 'Variation Group A',
    targeting: {
      targetingGroups: [
        {
          targetings: [
            { key: 'country', operator: TargetingOperator.EQUALS, value: 'US' },
          ],
          allMatched: true,
        },
        {
          targetings: [
            { key: 'age', operator: TargetingOperator.GREATER_THAN, value: 18 },
          ],
          allMatched: false,
        },
      ],
    },
    variations: [
      { id: 'v1', name: 'Variation 1', modifications: { type: 'FLAG', value: true } },
      { id: 'v2', name: 'Variation 2', modifications: { type: 'FLAG', value: false } },
    ],
  };

  it('should render variation group with targeting groups', () => {
    const { toJSON, getAllByTestId } = render(
      <TargetingVariationGr
        variationGroup={mockVariationGroup}
        displayStatus={CampaignDisplayStatus.SHOWN}
        campaignStatus={WebSDKCampaignStatus.ACCEPTED}
      />
    );

    const groups = getAllByTestId('targeting-group');
    expect(groups).toHaveLength(2);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should show group name when showGroupNames is true', () => {
    const { toJSON, getByText } = render(
      <TargetingVariationGr
        variationGroup={mockVariationGroup}
        displayStatus={CampaignDisplayStatus.SHOWN}
        campaignStatus={WebSDKCampaignStatus.ACCEPTED}
        showGroupNames={true}
      />
    );

    expect(getByText('Variation Group A')).toBeTruthy();
    expect(toJSON()).toMatchSnapshot();
  });

  it('should not show group name when showGroupNames is false', () => {
    const { toJSON, queryByText } = render(
      <TargetingVariationGr
        variationGroup={mockVariationGroup}
        displayStatus={CampaignDisplayStatus.SHOWN}
        campaignStatus={WebSDKCampaignStatus.ACCEPTED}
        showGroupNames={false}
      />
    );

    expect(queryByText('Variation Group A')).toBeNull();
    expect(toJSON()).toMatchSnapshot();
  });

  it('should not show group name by default', () => {
    const { toJSON, queryByText } = render(
      <TargetingVariationGr
        variationGroup={mockVariationGroup}
        displayStatus={CampaignDisplayStatus.SHOWN}
        campaignStatus={WebSDKCampaignStatus.ACCEPTED}
      />
    );

    expect(queryByText('Variation Group A')).toBeNull();
    expect(toJSON()).toMatchSnapshot();
  });

  it('should mark last targeting group correctly', () => {
    const { toJSON, getByText } = render(
      <TargetingVariationGr
        variationGroup={mockVariationGroup}
        displayStatus={CampaignDisplayStatus.SHOWN}
        campaignStatus={WebSDKCampaignStatus.ACCEPTED}
      />
    );

    expect(getByText('Group: 1 targetings OR')).toBeTruthy();
    expect(getByText('Group: 1 targetings')).toBeTruthy();
    expect(toJSON()).toMatchSnapshot();
  });

  it('should pass all props to TargetingGroupItem', () => {
    const { toJSON } = render(
      <TargetingVariationGr
        variationGroup={mockVariationGroup}
        displayStatus={CampaignDisplayStatus.HIDDEN}
        campaignStatus={WebSDKCampaignStatus.REJECTED}
        hasTargetingMatched={true}
        isUntracked={true}
      />
    );

    expect(toJSON()).toMatchSnapshot();
  });

  it('should handle single targeting group', () => {
    const singleGroupVariation = {
      ...mockVariationGroup,
      targeting: {
        targetingGroups: [
          {
            targetings: [
              { key: 'country', operator: TargetingOperator.EQUALS, value: 'US' },
            ],
            allMatched: true,
          },
        ],
      },
    };

    const { toJSON, getAllByTestId } = render(
      <TargetingVariationGr
        variationGroup={singleGroupVariation}
        displayStatus={CampaignDisplayStatus.SHOWN}
        campaignStatus={WebSDKCampaignStatus.ACCEPTED}
      />
    );

    const groups = getAllByTestId('targeting-group');
    expect(groups).toHaveLength(1);
    expect(toJSON()).toMatchSnapshot();
  });
});

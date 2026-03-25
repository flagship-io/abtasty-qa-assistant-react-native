import React from 'react';
import { render } from '@testing-library/react-native';
import { TargetingGroupItem } from '../../../src/components/targeting/TargetingGroupItem';
import { TargetingOperator, CampaignDisplayStatus, WebSDKCampaignStatus } from '../../../src/types.local';

// Mock hooks
jest.mock('../../../src/hooks/useBackground', () => ({
  useTargetingBackground: jest.fn(() => ({
    backgroundColor: '#E8F5E9',
    borderColor: '#4CAF50',
    iconColor: '#4CAF50',
    Icon: ({ color }: { color: string }) => {
      const React = require('react');
      const { Text } = require('react-native');
      return React.createElement(Text, { testID: 'icon' }, `Icon: ${color}`);
    },
  })),
}));

// Mock TargetingItem component
jest.mock('../../../src/components/targeting/TargetingItem', () => ({
  TargetingItem: ({ targetings, isLast }: any) => {
    const React = require('react');
    const { Text, View } = require('react-native');
    return React.createElement(
      View,
      { testID: 'targeting-item' },
      React.createElement(Text, {}, `${targetings.key}: ${targetings.value}${isLast ? '' : ' AND'}`)
    );
  },
}));

describe('TargetingGroupItem', () => {
  const mockTargetingGroup = {
    targetings: [
      { key: 'country', operator: TargetingOperator.EQUALS, value: 'US' },
      { key: 'age', operator: TargetingOperator.GREATER_THAN, value: 18 },
    ],
    allMatched: true,
  };

  it('should render targeting group with multiple targetings', () => {
    const { toJSON, getByText } = render(
      <TargetingGroupItem
        targetingGroup={mockTargetingGroup}
        displayStatus={CampaignDisplayStatus.SHOWN}
        campaignStatus={WebSDKCampaignStatus.ACCEPTED}
      />
    );

    expect(getByText('country: US AND')).toBeTruthy();
    expect(getByText('age: 18')).toBeTruthy();
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render icon with correct color from useTargetingBackground', () => {
    const { toJSON, getByTestId } = render(
      <TargetingGroupItem
        targetingGroup={mockTargetingGroup}
        displayStatus={CampaignDisplayStatus.SHOWN}
        campaignStatus={WebSDKCampaignStatus.ACCEPTED}
      />
    );

    const icon = getByTestId('icon');
    expect(icon).toBeTruthy();
    expect(toJSON()).toMatchSnapshot();
  });

  it('should show "OR" separator when not last group', () => {
    const { toJSON, getByText } = render(
      <TargetingGroupItem
        targetingGroup={mockTargetingGroup}
        displayStatus={CampaignDisplayStatus.SHOWN}
        campaignStatus={WebSDKCampaignStatus.ACCEPTED}
        isLast={false}
      />
    );

    expect(getByText('OR')).toBeTruthy();
    expect(toJSON()).toMatchSnapshot();
  });

  it('should not show "OR" separator when last group', () => {
    const { toJSON, queryByText } = render(
      <TargetingGroupItem
        targetingGroup={mockTargetingGroup}
        displayStatus={CampaignDisplayStatus.SHOWN}
        campaignStatus={WebSDKCampaignStatus.ACCEPTED}
        isLast={true}
      />
    );

    expect(queryByText('OR')).toBeNull();
    expect(toJSON()).toMatchSnapshot();
  });

  it('should apply background and border colors from hook', () => {
    const { useTargetingBackground } = require('../../../src/hooks/useBackground');
    
    useTargetingBackground.mockReturnValueOnce({
      backgroundColor: '#FFEBEE',
      borderColor: '#F44336',
      iconColor: '#F44336',
      Icon: ({ color }: { color: string }) => {
        const React = require('react');
        const { Text } = require('react-native');
        return React.createElement(Text, { testID: 'icon' }, `Icon: ${color}`);
      },
    });

    const { toJSON } = render(
      <TargetingGroupItem
        targetingGroup={mockTargetingGroup}
        displayStatus={CampaignDisplayStatus.HIDDEN}
        campaignStatus={WebSDKCampaignStatus.REJECTED}
      />
    );

    expect(toJSON()).toMatchSnapshot();
  });

  it('should pass correct props to useTargetingBackground hook', () => {
    const { useTargetingBackground } = require('../../../src/hooks/useBackground');
    
    render(
      <TargetingGroupItem
        targetingGroup={mockTargetingGroup}
        displayStatus={CampaignDisplayStatus.SHOWN}
        campaignStatus={WebSDKCampaignStatus.REJECTED}
        isUntracked={true}
      />
    );

    expect(useTargetingBackground).toHaveBeenCalledWith(
      CampaignDisplayStatus.SHOWN,
      true,
      true,
      WebSDKCampaignStatus.REJECTED
    );
  });


});

import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { CollapsibleVariation } from '../../../src/components/variation/CollapsibleVariation';
import { CampaignType } from '../../../src/types.local';

// Mock hooks
jest.mock('../../../src/hooks', () => ({
  useForcedVariationActions: jest.fn(() => ({
    applyVariation: jest.fn(),
  })),
  useAllocatedVariations: jest.fn(() => ({})),
}));

// Mock icon components
jest.mock('../../../src/assets/icons/ChevronUpIcon', () => ({
  ChevronUpIcon: ({ style }: any) => {
    const React = require('react');
    const { Text } = require('react-native');
    return React.createElement(Text, { style }, 'ChevronUp');
  },
}));

jest.mock('../../../src/assets/icons/ChevronDownIcon', () => ({
  ChevronDownIcon: ({ style }: any) => {
    const React = require('react');
    const { Text } = require('react-native');
    return React.createElement(Text, { style }, 'ChevronDown');
  },
}));

// Mock FlagValue component
jest.mock('../../../src/components/common/FlagValue', () => ({
  FlagValue: ({ modifications }: any) => {
    const React = require('react');
    const { Text } = require('react-native');
    return React.createElement(Text, { testID: 'flag-value' }, JSON.stringify(modifications));
  },
}));

describe('CollapsibleVariation', () => {
  const mockVariation = {
    id: 'v1',
    name: 'Variation A',
    variationGroupName: 'Group 1',
    variationGroupId: 'vg1',
    modifications: {
      type: 'FLAG',
      value: { key1: 'value1', key2: 'value2' },
    },
  };

  const mockCampaignData = {
    campaignId: 'c1',
    campaignType: CampaignType.ab,
    campaignName: 'Campaign 1',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render collapsed by default and expand on press', () => {
    const { toJSON, getByText, queryByTestId } = render(
      <CollapsibleVariation variation={mockVariation} campaignData={mockCampaignData} />
    );

    expect(getByText('Variation A')).toBeTruthy();
    expect(queryByTestId('flag-value')).toBeNull();

    const header = getByText('Variation A');
    fireEvent.press(header.parent?.parent as any);

    expect(queryByTestId('flag-value')).toBeTruthy();
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render expanded when defaultExpanded is true', () => {
    const { toJSON, getByTestId } = render(
      <CollapsibleVariation
        variation={mockVariation}
        campaignData={mockCampaignData}
        defaultExpanded={true}
      />
    );

    expect(getByTestId('flag-value')).toBeTruthy();
    expect(toJSON()).toMatchSnapshot();
  });

  it('should toggle expanded state on header press', () => {
    const { getByText, queryByTestId } = render(
      <CollapsibleVariation variation={mockVariation} campaignData={mockCampaignData} />
    );

    const header = getByText('Variation A').parent?.parent as any;

    fireEvent.press(header);
    expect(queryByTestId('flag-value')).toBeTruthy();

    fireEvent.press(header);
    expect(queryByTestId('flag-value')).toBeNull();
  });

  it('should combine group name with variation name when shouldCombineGrpName is true', () => {
    const { toJSON, getByText } = render(
      <CollapsibleVariation
        variation={mockVariation}
        campaignData={mockCampaignData}
        shouldCombineGrpName={true}
      />
    );

    expect(getByText('Group 1 - Variation A')).toBeTruthy();
    expect(toJSON()).toMatchSnapshot();
  });

  it('should show variation action when shouldShowVariationAction is true', () => {
    const { toJSON, queryByText } = render(
      <CollapsibleVariation
        variation={mockVariation}
        campaignData={mockCampaignData}
        shouldShowVariationAction={true}
      />
    );

    expect(queryByText('View')).toBeTruthy();
    expect(toJSON()).toMatchSnapshot();
  });

  it('should call applyVariation when variation action is triggered', () => {
    const { useForcedVariationActions } = require('../../../src/hooks');
    const mockApplyVariation = jest.fn();
    useForcedVariationActions.mockReturnValue({
      applyVariation: mockApplyVariation,
    });

    const { getByText } = render(
      <CollapsibleVariation
        variation={mockVariation}
        campaignData={mockCampaignData}
        shouldShowVariationAction={true}
      />
    );

    const viewButton = getByText('View');
    fireEvent.press(viewButton);

    expect(mockApplyVariation).toHaveBeenCalledWith({
      c1: {
        campaignId: 'c1',
        campaignName: 'Campaign 1',
        campaignType: CampaignType.ab,
        variationGroupName: 'Group 1',
        variationGroupId: 'vg1',
        variation: mockVariation,
      },
    });
  });

  it('should show "Your version" when isCurrent is true', () => {
    const { toJSON, getByText } = render(
      <CollapsibleVariation
        variation={mockVariation}
        campaignData={mockCampaignData}
        shouldShowVariationAction={true}
        isCurrent={true}
      />
    );

    expect(getByText('Your version')).toBeTruthy();
    expect(toJSON()).toMatchSnapshot();
  });
});

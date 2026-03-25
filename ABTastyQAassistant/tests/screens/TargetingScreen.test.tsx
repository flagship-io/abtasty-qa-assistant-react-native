import React from 'react';
import { render } from '@testing-library/react-native';
import { TargetingScreen } from '../../src/screens/TargetingScreen';
import { CampaignDisplayStatus, CampaignType, WebSDKCampaignStatus } from '../../src/types.local';

// Mock navigation
const mockRoute = {
  params: { campaignId: 'camp-1' },
};

jest.mock('@react-navigation/native', () => ({
  useRoute: () => mockRoute,
}));

// Mock hooks
const mockCampaign = {
  id: 'camp-1',
  name: 'Test Campaign',
  type: CampaignType.ab,
  displayStatus: CampaignDisplayStatus.SHOWN,
  hasTargetingMatched: true,
  status: WebSDKCampaignStatus.ACCEPTED,
  variationGroups: [
    {
      id: 'vg-1',
      name: 'Variation Group 1',
      variations: [
        { id: 'var-1', name: 'Control', modifications: { type: 'JSON', value: {} } },
      ],
      targeting: {
        targetingGroups: [
          {
            targetings: [
              { key: 'city', operator: 'EQUALS', value: 'Paris' },
            ],
          },
        ],
      },
    },
  ],
};

jest.mock('../../src/hooks', () => ({
  useCampaign: jest.fn(() => mockCampaign),
}));

// Mock components
jest.mock('../../src/components/targeting', () => {
  const { Text } = require('react-native');
  const React = require('react');
  return {
    TargetingVariationGr: ({ variationGroup, displayStatus }: any) =>
      React.createElement(Text, {}, `TargetingVariationGr: ${variationGroup.id}, ${displayStatus}`),
  };
});

jest.mock('../../src/components/common', () => {
  const { Text } = require('react-native');
  const React = require('react');
  return {
    Alert: ({ message }: any) => React.createElement(Text, {}, `Alert: ${message}`),
  };
});

describe('TargetingScreen', () => {
  const { useCampaign } = require('../../src/hooks');

  beforeEach(() => {
    jest.clearAllMocks();
    useCampaign.mockReturnValue(mockCampaign);
  });

  it('should render targeting variation groups', () => {
    const { toJSON, getByText } = render(<TargetingScreen />);
    
    expect(getByText('TargetingVariationGr: vg-1, SHOWN')).toBeTruthy();
    expect(toJSON()).toMatchSnapshot();
  });

  it('should not show alert when campaign is shown', () => {
    useCampaign.mockReturnValue({
      ...mockCampaign,
      displayStatus: CampaignDisplayStatus.SHOWN,
      hasTargetingMatched: true,
    });

    const { toJSON, queryByText } = render(<TargetingScreen />);
    
    expect(queryByText(/Alert:/)).toBeNull();
    expect(toJSON()).toMatchSnapshot();
  });

  it('should show bypassed alert when targeting does not match and campaign is reset', () => {
    useCampaign.mockReturnValue({
      ...mockCampaign,
      displayStatus: CampaignDisplayStatus.RESET,
      hasTargetingMatched: false,
    });

    const { toJSON, getByText } = render(<TargetingScreen />);
    
    expect(getByText('Alert: Targeting has been bypassed.')).toBeTruthy();
    expect(toJSON()).toMatchSnapshot();
  });

  it('should show not matched alert when targeting does not match and campaign is hidden', () => {
    useCampaign.mockReturnValue({
      ...mockCampaign,
      displayStatus: CampaignDisplayStatus.HIDDEN,
      hasTargetingMatched: false,
    });

    const { toJSON, getByText } = render(<TargetingScreen />);
    
    expect(getByText('Alert: Targeting does not match your current values:')).toBeTruthy();
    expect(toJSON()).toMatchSnapshot();
  });

  it('should show untracked alert when targeting matched but hidden', () => {
    useCampaign.mockReturnValue({
      ...mockCampaign,
      displayStatus: CampaignDisplayStatus.HIDDEN,
      hasTargetingMatched: true,
    });

    const { toJSON, getByText } = render(<TargetingScreen />);
    
    expect(getByText('Alert: Targeting matched but the campaign is untracked')).toBeTruthy();
    expect(toJSON()).toMatchSnapshot();
  });

  it('should handle personal campaigns', () => {
    useCampaign.mockReturnValue({
      ...mockCampaign,
      type: CampaignType.perso,
      variationGroups: [
        {
          id: 'vg-1',
          name: 'Personalization Group',
          variations: [{ id: 'var-1', name: 'Variation 1' }],
          targeting: { targetingGroups: [] },
        },
      ],
    });

    const { toJSON, getByText } = render(<TargetingScreen />);
    
    expect(getByText('TargetingVariationGr: vg-1, SHOWN')).toBeTruthy();
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render multiple variation groups with targeting', () => {
    useCampaign.mockReturnValue({
      ...mockCampaign,
      variationGroups: [
        {
          id: 'vg-1',
          name: 'Group 1',
          variations: [{ id: 'var-1', name: 'Variation 1' }],
          targeting: {
            targetingGroups: [
              { targetings: [{ key: 'country', operator: 'EQUALS', value: 'FR' }] },
            ],
          },
        },
        {
          id: 'vg-2',
          name: 'Group 2',
          variations: [{ id: 'var-2', name: 'Variation 2' }],
          targeting: {
            targetingGroups: [
              { targetings: [{ key: 'age', operator: 'GREATER_THAN', value: '18' }] },
            ],
          },
        },
      ],
    });

    const { toJSON, getByText } = render(<TargetingScreen />);
    
    expect(getByText('TargetingVariationGr: vg-1, SHOWN')).toBeTruthy();
    expect(getByText('TargetingVariationGr: vg-2, SHOWN')).toBeTruthy();
    expect(toJSON()).toMatchSnapshot();
  });
});

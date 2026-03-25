import React from 'react';
import { render } from '@testing-library/react-native';
import { AllocationScreen } from '../../src/screens/AllocationScreen';
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
        { id: 'var-1', name: 'Control', allocation: 50, reference: true, modifications: { type: 'JSON', value: {} } },
        { id: 'var-2', name: 'Variant', allocation: 50, reference: false, modifications: { type: 'JSON', value: {} } },
      ],
      targeting: { targetingGroups: [] },
    },
  ],
};

jest.mock('../../src/hooks', () => ({
  useCampaign: jest.fn(() => mockCampaign),
}));

// Mock components
jest.mock('../../src/components/allocation', () => {
  const { Text } = require('react-native');
  const React = require('react');
  return {
    AllocationVariationGr: ({ variationGroup, displayStatus, isPersonalCampaign }: any) =>
      React.createElement(Text, {}, `AllocationVariationGr: ${variationGroup.id}, ${displayStatus}, personal=${isPersonalCampaign}`),
  };
});

jest.mock('../../src/components/common', () => {
  const { Text } = require('react-native');
  const React = require('react');
  return {
    Alert: ({ message }: any) => React.createElement(Text, {}, `Alert: ${message}`),
  };
});

describe('AllocationScreen', () => {
  const { useCampaign } = require('../../src/hooks');

  beforeEach(() => {
    jest.clearAllMocks();
    useCampaign.mockReturnValue(mockCampaign);
  });

  it('should render allocation variation groups', () => {
    const { toJSON, getByText } = render(<AllocationScreen />);
    
    expect(getByText('AllocationVariationGr: vg-1, SHOWN, personal=false')).toBeTruthy();
    expect(toJSON()).toMatchSnapshot();
  });

  it('should not show alert when campaign is shown', () => {
    useCampaign.mockReturnValue({
      ...mockCampaign,
      displayStatus: CampaignDisplayStatus.SHOWN,
      hasTargetingMatched: true,
    });

    const { toJSON, queryByText } = render(<AllocationScreen />);
    
    expect(queryByText(/Alert:/)).toBeNull();
    expect(toJSON()).toMatchSnapshot();
  });

  it('should show untracked alert when targeting matched but hidden', () => {
    useCampaign.mockReturnValue({
      ...mockCampaign,
      displayStatus: CampaignDisplayStatus.HIDDEN,
      hasTargetingMatched: true,
    });

    const { toJSON, getByText } = render(<AllocationScreen />);
    
    expect(getByText('Alert: You are part of the untracked traffic for this campaign.')).toBeTruthy();
    expect(toJSON()).toMatchSnapshot();
  });

  it('should show bypassed alert when allocation is reset without targeting match', () => {
    useCampaign.mockReturnValue({
      ...mockCampaign,
      displayStatus: CampaignDisplayStatus.RESET,
      hasTargetingMatched: false,
    });

    const { toJSON, getByText } = render(<AllocationScreen />);
    
    expect(getByText('Alert: Allocation has been bypassed.')).toBeTruthy();
    expect(toJSON()).toMatchSnapshot();
  });

  it('should show not allocated alert when targeting does not match', () => {
    useCampaign.mockReturnValue({
      ...mockCampaign,
      displayStatus: CampaignDisplayStatus.HIDDEN,
      hasTargetingMatched: false,
    });

    const { toJSON, getByText } = render(<AllocationScreen />);
    
    expect(getByText('Alert: You are not part of the allocated traffic for this campaign.')).toBeTruthy();
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

    const { toJSON, getByText } = render(<AllocationScreen />);
    
    expect(getByText('AllocationVariationGr: vg-1, SHOWN, personal=true')).toBeTruthy();
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render multiple variation groups', () => {
    useCampaign.mockReturnValue({
      ...mockCampaign,
      variationGroups: [
        {
          id: 'vg-1',
          name: 'Group 1',
          variations: [{ id: 'var-1', name: 'Variation 1' }],
          targeting: { targetingGroups: [] },
        },
        {
          id: 'vg-2',
          name: 'Group 2',
          variations: [{ id: 'var-2', name: 'Variation 2' }],
          targeting: { targetingGroups: [] },
        },
      ],
    });

    const { toJSON, getByText } = render(<AllocationScreen />);
    
    expect(getByText('AllocationVariationGr: vg-1, SHOWN, personal=false')).toBeTruthy();
    expect(getByText('AllocationVariationGr: vg-2, SHOWN, personal=false')).toBeTruthy();
    expect(toJSON()).toMatchSnapshot();
  });
});

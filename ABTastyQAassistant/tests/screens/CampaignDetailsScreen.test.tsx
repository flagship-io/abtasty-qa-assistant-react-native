import React from 'react';
import { render } from '@testing-library/react-native';
import { CampaignDetailsScreen } from '../../src/screens/CampaignDetailsScreen';
import { CampaignType } from '../../src/types.local';

// Mock navigation
const mockRoute = {
  params: { campaignId: 'camp-1' },
};

jest.mock('@react-navigation/native', () => ({
  useRoute: () => mockRoute,
}));

// Mock Material Top Tabs navigator
jest.mock('@react-navigation/material-top-tabs', () => {
  const actual = jest.requireActual('react');
  return {
    createMaterialTopTabNavigator: () => ({
      Navigator: ({ children, screenOptions }: any) => (
        actual.createElement('MockNavigator', { screenOptions: JSON.stringify(screenOptions) }, children)
      ),
      Screen: ({ name, component }: any) =>
        actual.createElement('MockScreen', { name }, component ? `Screen: ${name}` : null),
    }),
  };
});

// Mock hooks
const mockCampaign = {
  id: 'camp-1',
  name: 'Test Campaign',
  type: CampaignType.ab,
  currentVariation: { id: 'var-1', name: 'Control' },
  variationGroups: [
    {
      id: 'vg-1',
      name: 'Variation Group 1',
      variations: [
        { id: 'var-1', name: 'Control', modifications: { type: 'JSON', value: {} } },
        { id: 'var-2', name: 'Variant', modifications: { type: 'JSON', value: {} } },
      ],
      targeting: { targetingGroups: [] },
    },
  ],
};

jest.mock('../../src/hooks', () => ({
  useCampaign: jest.fn(() => mockCampaign),
  useActiveVariationId: jest.fn(() => 'var-1'),
  useVariation: jest.fn(() => ({ id: 'var-1', name: 'Control' })),
  useSDKSync: jest.fn(),
  useCampaignAllocation: jest.fn(() => ({ applyAllocation: jest.fn(), unsetAllocation: jest.fn() })),
  useCampaignUnallocation: jest.fn(() => ({ applyUnallocation: jest.fn(), unsetUnallocation: jest.fn() })),
}));

// Mock screens
jest.mock('../../src/screens/VariationsScreen', () => ({
  VariationsScreen: () => 'VariationsScreen',
}));

jest.mock('../../src/screens/TargetingScreen', () => ({
  TargetingScreen: () => 'TargetingScreen',
}));

jest.mock('../../src/screens/AllocationScreen', () => ({
  AllocationScreen: () => 'AllocationScreen',
}));

// Mock components
jest.mock('../../src/components/variation', () => {
  const { Text } = require('react-native');
  const React = require('react');
  return {
    CurrentVariation: ({ variation }: any) => React.createElement(Text, {}, `CurrentVariation: ${variation?.id || 'none'}`),
  };
});

jest.mock('../../src/components/campaign', () => {
  const { Text } = require('react-native');
  const React = require('react');
  return {
    CampaignMetaDataRow: ({ campaign }: any) => React.createElement(Text, {}, `CampaignMetaDataRow: ${campaign.id}`),
  };
});

jest.mock('../../src/navigation/useTabScreenOptions', () => ({
  useTabScreenOptions: jest.fn(() => ({
    tabBarStyle: { backgroundColor: '#fff' },
    tabBarIndicatorStyle: { backgroundColor: '#007AFF' },
  })),
}));

describe('CampaignDetailsScreen', () => {
  const { useCampaign } = require('../../src/hooks');

  beforeEach(() => {
    jest.clearAllMocks();
    useCampaign.mockReturnValue(mockCampaign);
  });

  it('should render campaign header with current variation', () => {
    const { toJSON, getByText } = render(<CampaignDetailsScreen />);
    
    expect(getByText('Test Campaign')).toBeTruthy();
    expect(getByText('CurrentVariation: var-1')).toBeTruthy();
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render all three tab screens', () => {
    const { toJSON } = render(<CampaignDetailsScreen />);
    
    // Verify the navigator renders all screens (visible in snapshot)
    const json = toJSON();
    expect(json).toMatchSnapshot();
  });

  it('should handle campaign without current variation', () => {
    const { useVariation } = require('../../src/hooks');
    useVariation.mockReturnValue(null);
    useCampaign.mockReturnValue({
      ...mockCampaign,
      currentVariation: null,
    });

    const { toJSON, getByText } = render(<CampaignDetailsScreen />);
    
    expect(getByText('Test Campaign')).toBeTruthy();
    expect(getByText('CurrentVariation: none')).toBeTruthy();
    expect(toJSON()).toMatchSnapshot();
  });

  it('should handle personalization campaigns', () => {
    useCampaign.mockReturnValue({
      ...mockCampaign,
      name: 'Personalization Campaign',
      type: CampaignType.perso,
    });

    const { toJSON, getByText } = render(<CampaignDetailsScreen />);
    
    expect(getByText('Personalization Campaign')).toBeTruthy();
    expect(toJSON()).toMatchSnapshot();
  });

  it('should use tab screen options from hook', () => {
    const mockScreenOptions = {
      tabBarStyle: { backgroundColor: '#000' },
      tabBarIndicatorStyle: { backgroundColor: '#FF0000' },
    };
    
    const { useTabScreenOptions } = require('../../src/navigation/useTabScreenOptions');
    useTabScreenOptions.mockReturnValue(mockScreenOptions);

    const { toJSON } = render(<CampaignDetailsScreen />);
    
    expect(useTabScreenOptions).toHaveBeenCalled();
    expect(toJSON()).toMatchSnapshot();
  });

  it('should pass campaign ID to nested screens via params', () => {
    const { toJSON } = render(<CampaignDetailsScreen />);

    // Verify that the navigator is set up with the correct structure
    expect(useCampaign).toHaveBeenCalledWith('camp-1');
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render error message when campaign is not found', () => {
    useCampaign.mockReturnValue(null);

    const { getByText } = render(<CampaignDetailsScreen />);

    expect(getByText('Campaign not found')).toBeTruthy();
  });
});

import React from 'react';
import { render } from '@testing-library/react-native';
import { CampaignsPage } from '../../src/screens/CampaignsScreen';
import { CampaignDisplayStatus, CampaignType, WebSDKCampaignStatus } from '../../src/types.local';

// Mock hooks
const mockDispatchAppData = jest.fn();
const mockUseSDKSync = jest.fn();

jest.mock('../../src/hooks/useSDKIntegration', () => ({
  useSDKSync: () => mockUseSDKSync(),
}));

jest.mock('../../src/hooks', () => ({
  useAppContext: jest.fn(() => ({
    appDataState: {
      displayedAcceptedCampaigns: [],
      displayedRejectedCampaigns: [],
    },
    dispatchAppData: mockDispatchAppData,
  })),
}));

// Mock components
jest.mock('../../src/components/layout', () => {
  const { Text } = require('react-native');
  const React = require('react');
  return {
    SummaryBar: ({ totalCampaigns }: any) => React.createElement(Text, {}, `SummaryBar: ${totalCampaigns} campaigns`),
  };
});

jest.mock('../../src/components/campaign', () => {
  const { Text } = require('react-native');
  const React = require('react');
  return {
    CollapsibleCampaigns: ({ campaigns, badgeDisplayStatus, badgeStatus, defaultExpanded }: any) =>
      React.createElement(Text, {}, `CollapsibleCampaigns: ${campaigns.length} campaigns, status=${badgeStatus}, expanded=${defaultExpanded}`),
  };
});

const createMockCampaign = (id: string, name: string, type = CampaignType.ab) => ({
  id,
  name,
  slug: `${name.toLowerCase().replace(/\s/g, '-')}`,
  type,
  status: WebSDKCampaignStatus.ACCEPTED,
  displayStatus: CampaignDisplayStatus.SHOWN,
  hasTargetingMatched: true,
  variationGroups: [{
    id: `vg-${id}`,
    name: 'Variation Group 1',
    variations: [{
      id: `var-${id}`,
      name: 'Variation 1',
      reference: false,
      modifications: { type: 'JSON', value: {} },
    }],
    targeting: { targetingGroups: [] },
  }],
});

describe('CampaignsScreen', () => {
  const { useAppContext } = require('../../src/hooks');

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render with no campaigns', () => {
    useAppContext.mockReturnValue({
      appDataState: {
        displayedAcceptedCampaigns: [],
        displayedRejectedCampaigns: [],
      },
      dispatchAppData: mockDispatchAppData,
    });

    const { toJSON, getByText } = render(<CampaignsPage />);
    
    expect(getByText('SummaryBar: 0 campaigns')).toBeTruthy();
    expect(getByText('CollapsibleCampaigns: 0 campaigns, status=ACCEPTED, expanded=true')).toBeTruthy();
    expect(getByText('CollapsibleCampaigns: 0 campaigns, status=REJECTED, expanded=undefined')).toBeTruthy();
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render with only accepted campaigns', () => {
    const acceptedCampaigns = [
      createMockCampaign('camp1', 'Campaign 1'),
      createMockCampaign('camp2', 'Campaign 2'),
    ];

    useAppContext.mockReturnValue({
      appDataState: {
        displayedAcceptedCampaigns: acceptedCampaigns,
        displayedRejectedCampaigns: [],
      },
      dispatchAppData: mockDispatchAppData,
    });

    const { toJSON, getByText } = render(<CampaignsPage />);
    
    expect(getByText('SummaryBar: 2 campaigns')).toBeTruthy();
    expect(getByText('CollapsibleCampaigns: 2 campaigns, status=ACCEPTED, expanded=true')).toBeTruthy();
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render with only rejected campaigns', () => {
    const rejectedCampaigns = [
      createMockCampaign('camp3', 'Rejected Campaign'),
    ];

    useAppContext.mockReturnValue({
      appDataState: {
        displayedAcceptedCampaigns: [],
        displayedRejectedCampaigns: rejectedCampaigns,
      },
      dispatchAppData: mockDispatchAppData,
    });

    const { toJSON, getByText } = render(<CampaignsPage />);
    
    expect(getByText('SummaryBar: 1 campaigns')).toBeTruthy();
    expect(getByText('CollapsibleCampaigns: 1 campaigns, status=REJECTED, expanded=undefined')).toBeTruthy();
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render with both accepted and rejected campaigns', () => {
    const acceptedCampaigns = [
      createMockCampaign('camp1', 'Campaign 1'),
      createMockCampaign('camp2', 'Campaign 2'),
      createMockCampaign('camp3', 'Campaign 3'),
    ];
    const rejectedCampaigns = [
      createMockCampaign('camp4', 'Rejected 1'),
      createMockCampaign('camp5', 'Rejected 2'),
    ];

    useAppContext.mockReturnValue({
      appDataState: {
        displayedAcceptedCampaigns: acceptedCampaigns,
        displayedRejectedCampaigns: rejectedCampaigns,
      },
      dispatchAppData: mockDispatchAppData,
    });

    const { toJSON, getByText } = render(<CampaignsPage />);
    
    expect(getByText('SummaryBar: 5 campaigns')).toBeTruthy();
    expect(getByText('CollapsibleCampaigns: 3 campaigns, status=ACCEPTED, expanded=true')).toBeTruthy();
    expect(getByText('CollapsibleCampaigns: 2 campaigns, status=REJECTED, expanded=undefined')).toBeTruthy();
    expect(toJSON()).toMatchSnapshot();
  });

  it('should call useSDKSync on mount', () => {
    useAppContext.mockReturnValue({
      appDataState: {
        displayedAcceptedCampaigns: [],
        displayedRejectedCampaigns: [],
      },
      dispatchAppData: mockDispatchAppData,
    });

    render(<CampaignsPage />);

    expect(mockUseSDKSync).toHaveBeenCalled();
  });

  it('should handle null/undefined displayedCampaigns gracefully', () => {
    useAppContext.mockReturnValue({
      appDataState: {
        displayedAcceptedCampaigns: null,
        displayedRejectedCampaigns: undefined,
      },
      dispatchAppData: mockDispatchAppData,
    });

    const { getByText } = render(<CampaignsPage />);

    expect(getByText('SummaryBar: 0 campaigns')).toBeTruthy();
  });
});

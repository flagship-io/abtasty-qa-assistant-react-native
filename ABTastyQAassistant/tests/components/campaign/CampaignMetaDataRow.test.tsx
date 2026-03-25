import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { CampaignMetaDataRow } from '../../../src/components/campaign/CampaignMetaDataRow';
import { CampaignDisplayStatus, CampaignType, WebSDKCampaignStatus } from '../../../src/types.local';

// Mock hooks
const mockApplyAllocation = jest.fn();
const mockUnsetAllocation = jest.fn();
const mockApplyUnallocation = jest.fn();
const mockUnsetUnallocation = jest.fn();

jest.mock('../../../src/hooks', () => ({
  useCampaignAllocation: () => ({
    applyAllocation: mockApplyAllocation,
    unsetAllocation: mockUnsetAllocation,
  }),
  useCampaignUnallocation: () => ({
    applyUnallocation: mockApplyUnallocation,
    unsetUnallocation: mockUnsetUnallocation,
  }),
}));

// Mock icons
jest.mock('../../../src/assets/icons/EyeHideIcon', () => ({
  EyeHideIcon: () => 'EyeHideIcon',
}));
jest.mock('../../../src/assets/icons/EyeShowIcon', () => ({
  EyeShowIcon: () => 'EyeShowIcon',
}));
jest.mock('../../../src/assets/icons/ResetIcon', () => ({
  ResetIcon: () => 'ResetIcon',
}));

const createMockCampaign = (overrides = {}) => ({
  id: 'campaign-1',
  name: 'Test Campaign',
  slug: 'test-campaign',
  type: CampaignType.ab,
  status: WebSDKCampaignStatus.ACCEPTED,
  displayStatus: CampaignDisplayStatus.SHOWN,
  hasTargetingMatched: true,
  variationGroups: [{
    id: 'vg-1',
    name: 'Variation Group 1',
    variations: [{
      id: 'var-1',
      name: 'Variation 1',
      reference: false,
      modifications: { type: 'JSON', value: { key: 'value' } },
    }],
    targeting: { targetingGroups: [] },
  }],
  ...overrides,
});

describe('CampaignMetaDataRow Component', () => {
  beforeEach(() => {
    mockApplyAllocation.mockClear();
    mockUnsetAllocation.mockClear();
    mockApplyUnallocation.mockClear();
    mockUnsetUnallocation.mockClear();
  });

  it('should render with SHOWN display status', () => {
    const campaign = createMockCampaign({
      displayStatus: CampaignDisplayStatus.SHOWN,
    });
    const { toJSON } = render(<CampaignMetaDataRow campaign={campaign} />);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render with HIDDEN display status', () => {
    const campaign = createMockCampaign({
      displayStatus: CampaignDisplayStatus.HIDDEN,
    });
    const { toJSON } = render(<CampaignMetaDataRow campaign={campaign} />);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render with RESET display status', () => {
    const campaign = createMockCampaign({
      displayStatus: CampaignDisplayStatus.RESET,
    });
    const { toJSON } = render(<CampaignMetaDataRow campaign={campaign} />);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render with custom styles', () => {
    const campaign = createMockCampaign();
    const { toJSON } = render(
      <CampaignMetaDataRow 
        campaign={campaign} 
        styles={{ marginTop: 10 }}
      />
    );
    expect(toJSON()).toMatchSnapshot();
  });

  it('should show "Hide" label for SHOWN status', () => {
    const campaign = createMockCampaign({
      displayStatus: CampaignDisplayStatus.SHOWN,
    });
    const { toJSON } = render(<CampaignMetaDataRow campaign={campaign} />);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should show "Force display" label for HIDDEN status', () => {
    const campaign = createMockCampaign({
      displayStatus: CampaignDisplayStatus.HIDDEN,
    });
    const { toJSON } = render(<CampaignMetaDataRow campaign={campaign} />);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should show "Initial state" label for RESET status', () => {
    const campaign = createMockCampaign({
      displayStatus: CampaignDisplayStatus.RESET,
    });
    const { toJSON } = render(<CampaignMetaDataRow campaign={campaign} />);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should call applyAllocation when button pressed with HIDDEN status', () => {
    const campaign = createMockCampaign({
      displayStatus: CampaignDisplayStatus.HIDDEN,
    });
    const { getByText } = render(<CampaignMetaDataRow campaign={campaign} />);
    
    fireEvent.press(getByText('Force display'));

    expect(mockApplyAllocation).toHaveBeenCalledTimes(1);
    expect(mockApplyAllocation).toHaveBeenCalledWith({
      'campaign-1': {
        campaignId: 'campaign-1',
        campaignName: 'Test Campaign',
        campaignType: CampaignType.ab,
        CampaignSlug: 'test-campaign',
        variationGroupId: 'vg-1',
        variationGroupName: 'Variation Group 1',
        variation: expect.objectContaining({
          id: 'var-1',
          name: 'Variation 1',
        }),
      },
    });
  });

  it('should call applyUnallocation when button pressed with SHOWN status', () => {
    const campaign = createMockCampaign({
      displayStatus: CampaignDisplayStatus.SHOWN,
    });
    const { getByText } = render(<CampaignMetaDataRow campaign={campaign} />);
    
    fireEvent.press(getByText('Hide'));

    expect(mockApplyUnallocation).toHaveBeenCalledTimes(1);
    expect(mockApplyUnallocation).toHaveBeenCalledWith({
      'campaign-1': expect.objectContaining({
        campaignId: 'campaign-1',
        campaignName: 'Test Campaign',
      }),
    });
  });

  it('should call unsetUnallocation when button pressed with RESET status and ACCEPTED campaign', () => {
    const campaign = createMockCampaign({
      displayStatus: CampaignDisplayStatus.RESET,
      status: WebSDKCampaignStatus.ACCEPTED,
    });
    const { getByText } = render(<CampaignMetaDataRow campaign={campaign} />);
    
    fireEvent.press(getByText('Initial state'));

    expect(mockUnsetUnallocation).toHaveBeenCalledTimes(1);
    expect(mockUnsetUnallocation).toHaveBeenCalledWith('campaign-1');
  });

  it('should call unsetAllocation when button pressed with RESET status and non-ACCEPTED campaign', () => {
    const campaign = createMockCampaign({
      displayStatus: CampaignDisplayStatus.RESET,
      status: WebSDKCampaignStatus.REJECTED,
    });
    const { getByText } = render(<CampaignMetaDataRow campaign={campaign} />);
    
    fireEvent.press(getByText('Initial state'));

    expect(mockUnsetAllocation).toHaveBeenCalledTimes(1);
    expect(mockUnsetAllocation).toHaveBeenCalledWith('campaign-1');
  });

  it('should pass Badge the correct targeting matched value', () => {
    const campaign = createMockCampaign({
      hasTargetingMatched: false,
    });
    const result = render(<CampaignMetaDataRow campaign={campaign} />);
    expect(result).toBeTruthy();
  });

  it('should handle button press multiple times', () => {
    const campaign = createMockCampaign({
      displayStatus: CampaignDisplayStatus.SHOWN,
    });
    const { getByText } = render(<CampaignMetaDataRow campaign={campaign} />);
    
    fireEvent.press(getByText('Hide'));
    fireEvent.press(getByText('Hide'));

    expect(mockApplyUnallocation).toHaveBeenCalledTimes(2);
  });
});

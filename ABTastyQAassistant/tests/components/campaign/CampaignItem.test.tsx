import React from 'react';
import { render } from '@testing-library/react-native';
import { CampaignItem } from '../../../src/components/campaign/CampaignItem';
import { CampaignDisplayStatus, CampaignType, WebSDKCampaignStatus } from '../../../src/types.local';

// Mock navigation
const mockNavigate = jest.fn();
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: mockNavigate,
  }),
}));

// Mock icons
jest.mock('../../../src/assets/icons/ChevronRightIcon', () => ({
  ChevronRightIcon: () => 'ChevronRightIcon',
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

describe('CampaignItem Component', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  it('should render campaign name', () => {
    const campaign = createMockCampaign({ name: 'My Test Campaign' });
    const { toJSON } = render(<CampaignItem campaign={campaign} />);
    const tree = toJSON();
    expect(tree).toMatchSnapshot();
    expect(JSON.stringify(tree)).toContain('My Test Campaign');
  });

  it('should display correct campaign type labels', () => {
    // A/B Test
    const abTree = render(<CampaignItem campaign={createMockCampaign({ type: CampaignType.ab })} />).toJSON();
    expect(abTree).toMatchSnapshot();
    
    // Feature Flag
    const toggleTree = render(<CampaignItem campaign={createMockCampaign({ type: CampaignType.toggle })} />).toJSON();
    expect(toggleTree).toMatchSnapshot();
    
    // Personalization
    const persoTree = render(<CampaignItem campaign={createMockCampaign({ type: CampaignType.perso })} />).toJSON();
    expect(persoTree).toMatchSnapshot();
    
    // Rollout
    const deploymentTree = render(<CampaignItem campaign={createMockCampaign({ type: CampaignType.deployment })} />).toJSON();
    expect(deploymentTree).toMatchSnapshot();
    
    // Unknown type defaults to "Campaign"
    const unknownTree = render(<CampaignItem campaign={createMockCampaign({ type: 'unknown' as CampaignType })} />).toJSON();
    expect(unknownTree).toMatchSnapshot();
  });

  it('should render with different display statuses', () => {
    // SHOWN status
    const shownTree = render(<CampaignItem campaign={createMockCampaign({
      displayStatus: CampaignDisplayStatus.SHOWN,
      status: WebSDKCampaignStatus.ACCEPTED,
    })} />).toJSON();
    expect(shownTree).toMatchSnapshot();

    // HIDDEN status
    const hiddenTree = render(<CampaignItem campaign={createMockCampaign({
      displayStatus: CampaignDisplayStatus.HIDDEN,
      status: WebSDKCampaignStatus.REJECTED,
      hasTargetingMatched: false,
    })} />).toJSON();
    expect(hiddenTree).toMatchSnapshot();

    // RESET status
    const resetTree = render(<CampaignItem campaign={createMockCampaign({
      displayStatus: CampaignDisplayStatus.RESET,
    })} />).toJSON();
    expect(resetTree).toMatchSnapshot();
  });
});

import React from 'react';
import { render } from '@testing-library/react-native';
import { CurrentVariation } from '../../../src/components/variation/CurrentVariation';
import { CampaignDisplayStatus, WebSDKCampaignStatus } from '../../../src/types.local';

describe('CurrentVariation', () => {
  const mockVariation = {
    id: 'v1',
    name: 'Variation A',
    variationGroupName: 'Group 1',
    variationGroupId: 'vg1',
    modifications: {
      type: 'FLAG',
      value: { key: 'value' },
    },
  };

  it('should render variation name when shown and accepted', () => {
    const { toJSON, getByText } = render(
      <CurrentVariation
        variation={mockVariation}
        displayStatus={CampaignDisplayStatus.SHOWN}
        campaignStatus={WebSDKCampaignStatus.ACCEPTED}
      />
    );

    expect(getByText(/Your are viewing:/)).toBeTruthy();
    expect(getByText(/Variation A/)).toBeTruthy();
    expect(toJSON()).toMatchSnapshot();
  });

  it('should combine group name with variation name when shouldCombineGrpName is true', () => {
    const { toJSON, getByText } = render(
      <CurrentVariation
        variation={mockVariation}
        displayStatus={CampaignDisplayStatus.SHOWN}
        campaignStatus={WebSDKCampaignStatus.ACCEPTED}
        shouldCombineGrpName={true}
      />
    );

    expect(getByText(/Group 1 - Variation A/)).toBeTruthy();
    expect(toJSON()).toMatchSnapshot();
  });

  it('should return null when displayStatus is HIDDEN', () => {
    const { toJSON } = render(
      <CurrentVariation
        variation={mockVariation}
        displayStatus={CampaignDisplayStatus.HIDDEN}
        campaignStatus={WebSDKCampaignStatus.ACCEPTED}
      />
    );

    expect(toJSON()).toBeNull();
  });

  it('should return null when variation is undefined', () => {
    const { toJSON } = render(
      <CurrentVariation
        variation={undefined}
        displayStatus={CampaignDisplayStatus.SHOWN}
        campaignStatus={WebSDKCampaignStatus.ACCEPTED}
      />
    );

    expect(toJSON()).toBeNull();
  });

  it('should return null when displayStatus is RESET and campaignStatus is ACCEPTED', () => {
    const { toJSON } = render(
      <CurrentVariation
        variation={mockVariation}
        displayStatus={CampaignDisplayStatus.RESET}
        campaignStatus={WebSDKCampaignStatus.ACCEPTED}
      />
    );

    expect(toJSON()).toBeNull();
  });

  it('should render when displayStatus is RESET and campaignStatus is REJECTED', () => {
    const { toJSON, getByText } = render(
      <CurrentVariation
        variation={mockVariation}
        displayStatus={CampaignDisplayStatus.RESET}
        campaignStatus={WebSDKCampaignStatus.REJECTED}
      />
    );

    expect(getByText(/Your are viewing:/)).toBeTruthy();
    expect(toJSON()).toMatchSnapshot();
  });


});

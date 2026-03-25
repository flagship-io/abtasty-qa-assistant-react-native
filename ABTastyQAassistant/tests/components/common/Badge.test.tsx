import React from 'react';
import { render } from '@testing-library/react-native';
import { Badge } from '../../../src/components/common/Badge';
import { CampaignDisplayStatus, WebSDKCampaignStatus } from '../../../src/types.local';

describe('Badge Component', () => {
  describe('SHOWN status', () => {
    it('should render "Accepted" label for SHOWN status', () => {
      const { toJSON, getByText } = render(
        <Badge 
          displayStatus={CampaignDisplayStatus.SHOWN}
          status={WebSDKCampaignStatus.ACCEPTED}
        />
      );
      expect(getByText('Accepted')).toBeTruthy();
      expect(toJSON()).toMatchSnapshot();
    });
  });

  describe('HIDDEN status', () => {
    it('should render "Allocation Rejected" when targeting matched', () => {
      const { toJSON, getByText } = render(
        <Badge 
          displayStatus={CampaignDisplayStatus.HIDDEN}
          status={WebSDKCampaignStatus.REJECTED}
          hasTargetingMatched={true}
        />
      );
      expect(getByText('Allocation Rejected')).toBeTruthy();
      expect(toJSON()).toMatchSnapshot();
    });

    it('should render "Targeting Rejected" when targeting not matched', () => {
      const { toJSON, getByText } = render(
        <Badge 
          displayStatus={CampaignDisplayStatus.HIDDEN}
          status={WebSDKCampaignStatus.REJECTED}
          hasTargetingMatched={false}
        />
      );
      expect(getByText('Targeting Rejected')).toBeTruthy();
      expect(toJSON()).toMatchSnapshot();
    });

    it('should use custom allocation label when provided', () => {
      const { toJSON, getByText } = render(
        <Badge 
          displayStatus={CampaignDisplayStatus.HIDDEN}
          status={WebSDKCampaignStatus.REJECTED}
          hasTargetingMatched={true}
          hidden={{ allocationLabel: 'Custom Allocation' }}
        />
      );
      expect(getByText('Custom Allocation')).toBeTruthy();
      expect(toJSON()).toMatchSnapshot();
    });

    it('should use custom targeting label when provided', () => {
      const { toJSON, getByText } = render(
        <Badge 
          displayStatus={CampaignDisplayStatus.HIDDEN}
          status={WebSDKCampaignStatus.REJECTED}
          hasTargetingMatched={false}
          hidden={{ targetingLabel: 'Custom Targeting' }}
        />
      );
      expect(getByText('Custom Targeting')).toBeTruthy();
      expect(toJSON()).toMatchSnapshot();
    });
  });

  describe('RESET status', () => {
    it('should render "Hidden" for RESET with ACCEPTED status', () => {
      const { toJSON, getByText } = render(
        <Badge 
          displayStatus={CampaignDisplayStatus.RESET}
          status={WebSDKCampaignStatus.ACCEPTED}
        />
      );
      expect(getByText('Hidden')).toBeTruthy();
      expect(toJSON()).toMatchSnapshot();
    });

    it('should render "Forced" for RESET with non-ACCEPTED status', () => {
      const { toJSON, getByText } = render(
        <Badge 
          displayStatus={CampaignDisplayStatus.RESET}
          status={WebSDKCampaignStatus.REJECTED}
        />
      );
      expect(getByText('Forced')).toBeTruthy();
      expect(toJSON()).toMatchSnapshot();
    });
  });

  describe('default case', () => {
    it('should render "Rejected" for unknown display status', () => {
      const { toJSON, getByText } = render(
        <Badge 
          displayStatus={'UNKNOWN' as CampaignDisplayStatus}
          status={WebSDKCampaignStatus.REJECTED}
        />
      );
      expect(getByText('Rejected')).toBeTruthy();
      expect(toJSON()).toMatchSnapshot();
    });
  });
});

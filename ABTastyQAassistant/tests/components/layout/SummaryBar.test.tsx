import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { SummaryBar } from '../../../src/components/layout/SummaryBar';

// Mock hooks
jest.mock('../../../src/hooks/useCampaignActions', () => ({
  useResetAllCampaignsAction: jest.fn(),
}));

// Mock icons
jest.mock('../../../src/assets/icons/ResetIcon', () => ({
  ResetIcon: () => 'ResetIcon',
}));

describe('SummaryBar', () => {
  let mockReinitializeAllCampaigns: jest.Mock;

  beforeEach(() => {
    mockReinitializeAllCampaigns = jest.fn();
    const { useResetAllCampaignsAction } = require('../../../src/hooks/useCampaignActions');
    (useResetAllCampaignsAction as jest.Mock).mockReturnValue({
      reinitializeAllCampaigns: mockReinitializeAllCampaigns,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render correct text for singular campaign', () => {
    const { getByText } = render(<SummaryBar totalCampaigns={1} />);

    expect(getByText('1 live campaign')).toBeTruthy();
  });

  it('should render correct text for multiple campaigns', () => {
    const { getByText } = render(<SummaryBar totalCampaigns={5} />);

    expect(getByText('5 live campaigns')).toBeTruthy();
  });

  it('should render correct text for zero campaigns', () => {
    const { getByText } = render(<SummaryBar totalCampaigns={0} />);

    expect(getByText('0 live campaigns')).toBeTruthy();
  });

  it('should render reset button with text', () => {
    const { getByText } = render(<SummaryBar totalCampaigns={3} />);

    expect(getByText('Reset all')).toBeTruthy();
  });

  it('should call reinitializeAllCampaigns when reset button is pressed', () => {
    const { getByText } = render(<SummaryBar totalCampaigns={3} />);
    const resetButton = getByText('Reset all');

    fireEvent.press(resetButton);

    expect(mockReinitializeAllCampaigns).toHaveBeenCalledTimes(1);
  });

  it('should handle multiple reset button presses', () => {
    const { getByText } = render(<SummaryBar totalCampaigns={3} />);
    const resetButton = getByText('Reset all');

    fireEvent.press(resetButton);
    fireEvent.press(resetButton);
    fireEvent.press(resetButton);

    expect(mockReinitializeAllCampaigns).toHaveBeenCalledTimes(3);
  });

  it('should render with large number of campaigns', () => {
    const { getByText } = render(<SummaryBar totalCampaigns={100} />);

    expect(getByText('100 live campaigns')).toBeTruthy();
  });

  it('should work correctly with different campaign counts', () => {
    const { rerender, getByText } = render(<SummaryBar totalCampaigns={1} />);
    expect(getByText('1 live campaign')).toBeTruthy();

    rerender(<SummaryBar totalCampaigns={2} />);
    expect(getByText('2 live campaigns')).toBeTruthy();

    rerender(<SummaryBar totalCampaigns={0} />);
    expect(getByText('0 live campaigns')).toBeTruthy();
  });
});

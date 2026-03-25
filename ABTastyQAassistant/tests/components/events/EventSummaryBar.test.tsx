import React from 'react';
import { render } from '@testing-library/react-native';
import { EventSummaryBar } from '../../../src/components/events/EventSummaryBar';

// Mock icons
jest.mock('../../../src/assets/icons/DeleteIcon', () => ({
  DeleteIcon: () => 'DeleteIcon',
}));

// Mock hooks
jest.mock('../../../src/hooks/useCampaignActions', () => ({
  useResetAllCampaignsAction: () => jest.fn(),
}));

describe('EventSummaryBar Component', () => {
  it('should render with different event counts', () => {
    const clearHits = jest.fn();
    
    // Zero events
    const zeroTree = render(<EventSummaryBar totalEvents={0} clearHits={clearHits} />);
    expect(zeroTree.getByText('0 events recorded')).toBeTruthy();
    expect(zeroTree.toJSON()).toMatchSnapshot();
    
    // Single event
    const singleTree = render(<EventSummaryBar totalEvents={1} clearHits={clearHits} />);
    expect(singleTree.getByText('1 event recorded')).toBeTruthy();
    expect(singleTree.toJSON()).toMatchSnapshot();
    
    // Multiple events
    const multipleTree = render(<EventSummaryBar totalEvents={5} clearHits={clearHits} />);
    expect(multipleTree.getByText('5 events recorded')).toBeTruthy();
    expect(multipleTree.toJSON()).toMatchSnapshot();
    
    // Large count
    const largeTree = render(<EventSummaryBar totalEvents={1000} clearHits={clearHits} />);
    expect(largeTree.getByText('1000 events recorded')).toBeTruthy();
    expect(largeTree.toJSON()).toMatchSnapshot();
  });

  it('should render Clear all button', () => {
    const clearHits = jest.fn();
    const { getByText, toJSON } = render(
      <EventSummaryBar totalEvents={5} clearHits={clearHits} />
    );
    
    expect(getByText('Clear all')).toBeTruthy();
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render with zero and multiple events', () => {
    const clearHits = jest.fn();
    
    // With zero events
    const zeroTree = render(<EventSummaryBar totalEvents={0} clearHits={clearHits} />).toJSON();
    expect(zeroTree).toMatchSnapshot();
    
    // With events
    const multiTree = render(<EventSummaryBar totalEvents={10} clearHits={clearHits} />).toJSON();
    expect(multiTree).toMatchSnapshot();
  });
});

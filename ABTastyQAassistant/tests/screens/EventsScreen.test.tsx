import React from 'react';
import { render } from '@testing-library/react-native';
import { EventsPage } from '../../src/screens/EventsScreen';

// Mock HitProvider context
const mockClearHits = jest.fn();
const mockSearchEvents = jest.fn();

jest.mock('../../src/hooks/useHitContext', () => ({
  useHitContext: jest.fn(() => ({
    hits: [],
    filteredHits: [],
    clearHits: mockClearHits,
    searchEvents: mockSearchEvents,
  })),
}));

// Mock components
jest.mock('../../src/components/layout', () => {
  const { Text } = require('react-native');
  const React = require('react');
  return {
    EventSummaryBar: ({ totalEvents, clearHits }: any) => React.createElement(Text, {}, `EventSummaryBar: ${totalEvents} events`),
  };
});

jest.mock('../../src/components/events/EmptyList', () => {
  const { Text } = require('react-native');
  const React = require('react');
  return {
    EmptyList: () => React.createElement(Text, {}, 'EmptyList'),
  };
});

jest.mock('../../src/components/events/EventList', () => {
  const { Text } = require('react-native');
  const React = require('react');
  return {
    EventList: ({ hits }: any) => React.createElement(Text, {}, `EventList: ${hits.length} hits`),
  };
});

describe('EventsScreen', () => {
  const { useHitContext } = require('../../src/hooks/useHitContext');

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render empty state when no events', () => {
    useHitContext.mockReturnValue({
      hits: [],
      filteredHits: [],
      clearHits: mockClearHits,
      searchEvents: mockSearchEvents,
    });

    const { toJSON, getByText } = render(<EventsPage />);
    
    expect(getByText('EventSummaryBar: 0 events')).toBeTruthy();
    expect(getByText('EmptyList')).toBeTruthy();
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render event list when events exist', () => {
    const mockHits = [
      { t: 'PAGE_VIEW', timestamp: 1000 },
      { t: 'CLICK', timestamp: 2000 },
    ];

    useHitContext.mockReturnValue({
      hits: mockHits,
      filteredHits: mockHits,
      clearHits: mockClearHits,
      searchEvents: mockSearchEvents,
    });

    const { toJSON, getByText, queryByText } = render(<EventsPage />);
    
    expect(getByText('EventSummaryBar: 2 events')).toBeTruthy();
    expect(getByText('EventList: 2 hits')).toBeTruthy();
    expect(queryByText('EmptyList')).toBeNull();
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render with filtered hits', () => {
    const mockHits = [
      { t: 'PAGE_VIEW', timestamp: 1000 },
      { t: 'CLICK', timestamp: 2000 },
      { t: 'CONVERSION', timestamp: 3000 },
    ];
    const mockFilteredHits = [
      { t: 'PAGE_VIEW', timestamp: 1000 },
    ];

    useHitContext.mockReturnValue({
      hits: mockHits,
      filteredHits: mockFilteredHits,
      clearHits: mockClearHits,
      searchEvents: mockSearchEvents,
    });

    const { toJSON, getByText } = render(<EventsPage />);
    
    // Should show total hits count, but render filtered hits
    expect(getByText('EventSummaryBar: 3 events')).toBeTruthy();
    expect(getByText('EventList: 1 hits')).toBeTruthy();
    expect(toJSON()).toMatchSnapshot();
  });
});

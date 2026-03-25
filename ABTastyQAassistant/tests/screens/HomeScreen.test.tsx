import React from 'react';
import { render } from '@testing-library/react-native';
import { HomeScreen } from '../../src/screens/HomeScreen';

// Mock navigation
const mockNavigate = jest.fn();
const useNavigationState = jest.fn();

jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useNavigation: () => ({
    navigate: mockNavigate,
  }),
  useNavigationState,
}));

// Mock material top tab navigator
let screenListenersRef: any = null;

jest.mock('@react-navigation/material-top-tabs', () => ({
  createMaterialTopTabNavigator: jest.fn(() => ({
    Navigator: ({ children, screenListeners }: any) => {
      // Capture screenListeners to trigger tab changes in tests
      screenListenersRef = screenListeners;
      return children;
    },
    Screen: ({ name, component: Component }: any) => <Component />,
  })),
}));

// Mock hooks
const mockDispatchAppData = jest.fn();
const mockSearchEvents = jest.fn();

const mockAppContext = {
  appDataState: {
    displayedAcceptedCampaigns: [],
    displayedRejectedCampaigns: [],
  },
  appData: {
    searchText: '',
  },
  dispatchAppData: mockDispatchAppData,
};

jest.mock('../../src/hooks', () => ({
  useAppContext: () => mockAppContext,
}));

jest.mock('../../src/hooks/useHitContext', () => ({
  useHitContext: () => ({
    hits: [],
    filteredHits: [],
    clearHits: jest.fn(),
    searchEvents: mockSearchEvents,
  }),
}));

jest.mock('../../src/hooks/useSDKIntegration', () => ({
  useSDKSync: jest.fn(),
}));

jest.mock('../../src/navigation/useTabScreenOptions', () => ({
  useTabScreenOptions: () => ({}),
}));

// Mock screens
jest.mock('../../src/screens/CampaignsScreen', () => {
  const { Text } = require('react-native');
  const React = require('react');
  return {
    CampaignsPage: () => React.createElement(Text, {}, 'CampaignsPage'),
  };
});

jest.mock('../../src/screens/EventsScreen', () => {
  const { Text } = require('react-native');
  const React = require('react');
  return {
    EventsPage: () => React.createElement(Text, {}, 'EventsPage'),
  };
});

jest.mock('../../src/screens/ContextScreen', () => {
  const { Text } = require('react-native');
  const React = require('react');
  return {
    ContextPage: () => React.createElement(Text, {}, 'ContextPage'),
  };
});

// Mock SearchBar with callback exposure for behavior testing
let searchBarOnChangeText: ((text: string) => void) | null = null;

jest.mock('../../src/components/common', () => {
  const { Text, TouchableOpacity } = require('react-native');
  const React = require('react');
  return {
    SearchBar: ({ onChangeText, value }: any) => {
      // Capture the callback so tests can trigger it
      searchBarOnChangeText = onChangeText;
      
      return React.createElement(
        TouchableOpacity,
        { 
          testID: 'search-bar',
          onPress: () => {} // Placeholder for interaction
        },
        React.createElement(Text, {}, `SearchBar: ${value}`)
      );
    },
  };
});

describe('HomeScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    searchBarOnChangeText = null;
    screenListenersRef = null;
    
    // Default: simulate being on Campaigns tab
    useNavigationState.mockImplementation((selector) => {
      const state = {
        index: 0,
        routes: [
          { key: 'Campaigns', name: 'Campaigns' },
          { key: 'Events', name: 'Events' },
          { key: 'Context', name: 'Context' },
        ],
      };
      return selector(state);
    });
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it('should render with search bar and tabs', () => {
    const { toJSON, getByTestId } = render(<HomeScreen />);
    
    expect(getByTestId('search-bar')).toBeTruthy();
    expect(toJSON()).toMatchSnapshot();
  });

  it('should dispatch search action after 300ms debounce', () => {
    render(<HomeScreen />);
    
    // Simulate user typing in SearchBar
    expect(searchBarOnChangeText).not.toBeNull();
    searchBarOnChangeText?.('test query');
    
    // Should not dispatch immediately
    expect(mockDispatchAppData).not.toHaveBeenCalled();
    
    // Advance timers by 300ms (debounce delay)
    jest.advanceTimersByTime(300);
    
    // Should dispatch search action with query (SEARCH_CAMPAIGNS on Campaigns tab)
    expect(mockDispatchAppData).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'SEARCH_CAMPAIGNS',
        payload: { searchTerm: 'test query' },
      })
    );
  });

  it('should cancel previous debounce on rapid typing', () => {
    render(<HomeScreen />);
    
    // First search
    searchBarOnChangeText?.('first');
    jest.advanceTimersByTime(100);
    
    // Second search before debounce completes
    searchBarOnChangeText?.('second');
    jest.advanceTimersByTime(100);
    
    // Third search
    searchBarOnChangeText?.('third query');
    jest.advanceTimersByTime(100);
    
    // None should have dispatched yet
    expect(mockDispatchAppData).not.toHaveBeenCalled();
    
    // Complete the debounce for the last search
    jest.advanceTimersByTime(200);
    
    // Only the last search should dispatch
    expect(mockDispatchAppData).toHaveBeenCalledTimes(1);
    expect(mockDispatchAppData).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'SEARCH_CAMPAIGNS',
        payload: { searchTerm: 'third query' },
      })
    );
  });

  it('should handle empty search text', () => {
    render(<HomeScreen />);
    
    // Search with empty string
    searchBarOnChangeText?.('');
    jest.advanceTimersByTime(300);
    
    // Should still dispatch even with empty string
    expect(mockDispatchAppData).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'SEARCH_CAMPAIGNS',
        payload: { searchTerm: '' },
      })
    );
  });

  it('should clear search when tab changes', () => {
    render(<HomeScreen />);

    // Simulate a tab change by calling the screenListeners.state callback
    expect(screenListenersRef).not.toBeNull();
    
    // Simulate tab change to Events tab
    screenListenersRef.state({
      data: {
        state: {
          index: 1,
          routes: [
            { key: 'Campaigns', name: 'Campaigns' },
            { key: 'Events', name: 'Events' },
            { key: 'Context', name: 'Context' },
          ],
        },
      },
    });

    // Verify search was cleared (dispatched with empty string)
    expect(mockDispatchAppData).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'SEARCH_CAMPAIGNS',
        payload: { searchTerm: '' },
      })
    );
    
    // Verify searchEvents was also called to clear Events search
    expect(mockSearchEvents).toHaveBeenCalledWith('');
  });

  it('should search events when on Events tab', () => {
    const { rerender } = render(<HomeScreen />);
    
    // First switch to Events tab - this triggers setActiveTab('Events')
    screenListenersRef.state({
      data: {
        state: {
          index: 1,
          routes: [
            { key: 'Campaigns', name: 'Campaigns' },
            { key: 'Events', name: 'Events' },
            { key: 'Context', name: 'Context' },
          ],
        },
      },
    });

    // Re-render to ensure state has updated
    rerender(<HomeScreen />);
    
    // Clear previous calls from tab change
    jest.clearAllMocks();
    
    // Now search while on Events tab
    searchBarOnChangeText?.('event search');
    jest.advanceTimersByTime(300);
    
    // Should call searchEvents, not dispatchAppData
    expect(mockSearchEvents).toHaveBeenCalledWith('event search');
    expect(mockDispatchAppData).not.toHaveBeenCalled();
  });

  it('should maintain search value through re-renders', () => {
    const { rerender } = render(<HomeScreen />);
    
    // Type search
    searchBarOnChangeText?.('persistent search');
    jest.advanceTimersByTime(300);
    
    expect(mockDispatchAppData).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'SEARCH_CAMPAIGNS',
        payload: { searchTerm: 'persistent search' },
      })
    );
    
    // Re-render component
    rerender(<HomeScreen />);
    
    // SearchBar value is maintained in component state (not from context)
    expect(searchBarOnChangeText).not.toBeNull();
  });
});

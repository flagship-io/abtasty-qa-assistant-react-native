import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { CollapseEvent } from '../../../src/components/events/EventCollapse';

// Mock icons
jest.mock('../../../src/assets/icons/ChevronUpIcon', () => ({
  ChevronUpIcon: () => 'ChevronUpIcon',
}));
jest.mock('../../../src/assets/icons/ChevronDownIcon', () => ({
  ChevronDownIcon: () => 'ChevronDownIcon',
}));

// Mock HumanizeDuration
jest.mock('../../../src/components/events/HumanizeDuration', () => ({
  HumanizeDuration: ({ timestamp }: { timestamp: number }) => `Duration: ${timestamp}`,
}));

describe('CollapseEvent Component', () => {
  const FIXED_TIMESTAMP = 1609459200000; // Fixed timestamp for consistent snapshots

  it('should render event with name and timestamp', () => {
    const hit = {
      t: 'PAGE_VIEW',
      timestamp: FIXED_TIMESTAMP,
      url: 'https://example.com',
    };
    const { toJSON, getByText } = render(<CollapseEvent hit={hit} />);
    expect(toJSON()).toMatchSnapshot();
    expect(getByText('PAGE_VIEW')).toBeTruthy();
  });

  it('should display "ACTIVATE" for missing event type', () => {
    const hit = {
      timestamp: FIXED_TIMESTAMP,
      data: 'test',
    };
    const { getByText, toJSON } = render(<CollapseEvent hit={hit} />);
    expect(getByText('ACTIVATE')).toBeTruthy();
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render collapsed by default — content not visible', () => {
    const hit = {
      t: 'CLICK',
      timestamp: FIXED_TIMESTAMP,
      target: 'button',
    };
    const { toJSON, queryByText } = render(<CollapseEvent hit={hit} />);
    // Expanded content ("target": "button") should not be visible when collapsed
    expect(queryByText('"target": "button"')).toBeNull();
    expect(toJSON()).toMatchSnapshot();
  });

  it('should show expanded content after pressing the row to expand', () => {
    const hit = {
      t: 'CLICK',
      timestamp: FIXED_TIMESTAMP,
      target: 'button',
    };
    const { getByText, queryByText } = render(<CollapseEvent hit={hit} />);

    // Starts collapsed — content not visible
    expect(queryByText('"target": "button"')).toBeNull();

    // Press the row to expand
    fireEvent.press(getByText('CLICK'));

    // Now expanded — content text is visible
    expect(getByText('"target": "button"')).toBeTruthy();
  });

  it('should collapse again on second press', () => {
    const hit = {
      t: 'CLICK',
      timestamp: FIXED_TIMESTAMP,
      target: 'button',
    };
    const { getByText, queryByText } = render(<CollapseEvent hit={hit} />);

    fireEvent.press(getByText('CLICK')); // expand
    expect(getByText('"target": "button"')).toBeTruthy();

    fireEvent.press(getByText('CLICK')); // collapse
    expect(queryByText('"target": "button"')).toBeNull();
  });

  it('should toggle expand state on press (snapshot)', () => {
    const hit = {
      t: 'CLICK',
      timestamp: FIXED_TIMESTAMP,
      target: 'button',
    };
    const { getByText, toJSON } = render(<CollapseEvent hit={hit} />);
    
    // Initial collapsed state
    expect(toJSON()).toMatchSnapshot();
    
    // Expand
    fireEvent.press(getByText('CLICK'));
    
    // Expanded state
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render event content when expanded', () => {
    const hit = {
      t: 'CONVERSION',
      timestamp: FIXED_TIMESTAMP,
      value: 100,
      currency: 'USD',
    };
    const { getByText, toJSON } = render(<CollapseEvent hit={hit} />);
    
    // Expand the component
    fireEvent.press(getByText('CONVERSION'));
    
    expect(toJSON()).toMatchSnapshot();
  });

  it('should handle empty hit object', () => {
    const hit = {};
    const { getByText, toJSON } = render(<CollapseEvent hit={hit} />);
    expect(getByText('ACTIVATE')).toBeTruthy();
    expect(toJSON()).toMatchSnapshot();
  });

  it('should format JSON content correctly', () => {
    const hit = {
      t: 'CUSTOM',
      timestamp: FIXED_TIMESTAMP,
      nested: { key: 'value' },
      array: [1, 2, 3],
    };
    const { toJSON } = render(<CollapseEvent hit={hit} />);
    expect(toJSON()).toMatchSnapshot();
  });
});

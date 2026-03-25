import React from 'react';
import { render, act, waitFor } from '@testing-library/react-native';
import { HumanizeDuration } from '../../../src/components/events/HumanizeDuration';

describe('HumanizeDuration Component', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should format different time ranges correctly', () => {
    // Just now (< 15 seconds)
    const justNow = render(<HumanizeDuration timestamp={Date.now() - 5000} />);
    expect(justNow.getByText('Just now')).toBeTruthy();
    expect(justNow.toJSON()).toMatchSnapshot();
    
    // Seconds (< 1 minute)
    const seconds = render(<HumanizeDuration timestamp={Date.now() - 30000} />);
    expect(seconds.getByText('30 sec. ago')).toBeTruthy();
    expect(seconds.toJSON()).toMatchSnapshot();
    
    // A minute ago (1-2 minutes)
    const minute = render(<HumanizeDuration timestamp={Date.now() - 90000} />);
    expect(minute.getByText('a min. ago')).toBeTruthy();
    expect(minute.toJSON()).toMatchSnapshot();
    
    // Minutes (< 1 hour)
    const minutes = render(<HumanizeDuration timestamp={Date.now() - 30 * 60 * 1000} />);
    expect(minutes.getByText('30 min. ago')).toBeTruthy();
    expect(minutes.toJSON()).toMatchSnapshot();
    
    // 1 hour ago (1-2 hours)
    const hour = render(<HumanizeDuration timestamp={Date.now() - 90 * 60 * 1000} />);
    expect(hour.getByText('1 hour ago')).toBeTruthy();
    expect(hour.toJSON()).toMatchSnapshot();
    
    // Hours (< 1 day)
    const hours = render(<HumanizeDuration timestamp={Date.now() - 5 * 60 * 60 * 1000} />);
    expect(hours.getByText('5 hours ago')).toBeTruthy();
    expect(hours.toJSON()).toMatchSnapshot();
    
    // One day ago (1-2 days)
    const day = render(<HumanizeDuration timestamp={Date.now() - 36 * 60 * 60 * 1000} />);
    expect(day.getByText('one day ago')).toBeTruthy();
    expect(day.toJSON()).toMatchSnapshot();
    
    // Days (< 1 month)
    const days = render(<HumanizeDuration timestamp={Date.now() - 7 * 24 * 60 * 60 * 1000} />);
    expect(days.getByText('7 days ago')).toBeTruthy();
    expect(days.toJSON()).toMatchSnapshot();
    
    // Months
    const months = render(<HumanizeDuration timestamp={Date.now() - 60 * 24 * 60 * 60 * 1000} />);
    expect(months.getByText('2 months ago')).toBeTruthy();
    expect(months.toJSON()).toMatchSnapshot();
  });

  it('should handle custom interval and cleanup', () => {
    const timestamp = Date.now() - 5000;
    
    // Custom update interval
    const { unmount, toJSON } = render(
      <HumanizeDuration timestamp={timestamp} updateInterval={5000} />
    );
    expect(toJSON()).toMatchSnapshot();
    
    // Cleanup on unmount
    unmount();
    // Should not throw after unmount
  });

  it('should update duration after interval', async () => {
    const timestamp = Date.now() - 10000; // 10 seconds ago
    const { getByText, rerender } = render(
      <HumanizeDuration timestamp={timestamp} updateInterval={1000} />
    );
    
    expect(getByText('Just now')).toBeTruthy();
    
    // Advance time and rerender with new timestamp to simulate update
    jest.advanceTimersByTime(20000);
  });
});

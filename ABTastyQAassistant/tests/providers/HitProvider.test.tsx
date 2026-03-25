import React from 'react';
import { renderHook, waitFor } from '@testing-library/react-native';
import { HitProvider } from '../../src/providers/HitProvider';
import { useHitContext } from '../../src/hooks/useHitContext';
import { ABTastyQA } from '@flagship.io/react-native-sdk';
import * as useSDKIntegration from '../../src/hooks/useSDKIntegration';

// Mock the SDK integration hooks
jest.mock('../../src/hooks/useSDKIntegration');

describe('HitProvider', () => {
  let mockABTastyQA: ABTastyQA;
  let mockSetHits: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    mockSetHits = jest.fn();

    mockABTastyQA = {
      envId: 'test-env-123',
      ABTastyQAEventBus: {
        emitQAEventToSDK: jest.fn(),
        onQAEventFromSDK: jest.fn(() => jest.fn()),
      },
    } as any;

    // Mock useEventsListener to capture setHits
    (useSDKIntegration.useEventsListener as jest.Mock).mockImplementation(
      (_abTastyQA: ABTastyQA, setHits: (hits: any[]) => void) => {
        mockSetHits.mockImplementation(setHits);
      }
    );
  });

  it('should provide initial empty hits state', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <HitProvider ABTastQA={mockABTastyQA}>{children}</HitProvider>
    );

    const { result } = renderHook(() => useHitContext(), { wrapper });

    expect(result.current.hits).toEqual([]);
    expect(result.current.filteredHits).toEqual([]);
    expect(useSDKIntegration.useEventsListener).toHaveBeenCalledTimes(1);
  });

  it('should update hits when events are received', async () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <HitProvider ABTastQA={mockABTastyQA}>{children}</HitProvider>
    );

    const { result } = renderHook(() => useHitContext(), { wrapper });

    const mockHits = [
      { t: 'PAGEVIEW', page: '/home' },
      { t: 'ACTIVATE', campaignId: 'campaign1' },
    ];

    // Simulate receiving hits
    await waitFor(() => {
      mockSetHits(mockHits);
    });

    await waitFor(() => {
      expect(result.current.hits).toEqual(mockHits);
    });
  });

  it('should filter hits based on search term', async () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <HitProvider ABTastQA={mockABTastyQA}>{children}</HitProvider>
    );

    const { result } = renderHook(() => useHitContext(), { wrapper });

    const mockHits = [
      { t: 'PAGEVIEW', page: '/home' },
      { t: 'ACTIVATE', campaignId: 'campaign1' },
      { t: 'EVENT', action: 'click' },
    ];

    // Add hits first
    await waitFor(() => {
      mockSetHits(mockHits);
    });

    // Search for ACTIVATE events
    await waitFor(() => {
      result.current.searchEvents('ACTIVATE');
    });

    await waitFor(() => {
      expect(result.current.filteredHits.length).toBe(1);
      expect(result.current.filteredHits[0].t).toBe('ACTIVATE');
    });
  });

  it('should clear hits when clearHits is called', async () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <HitProvider ABTastQA={mockABTastyQA}>{children}</HitProvider>
    );

    const { result } = renderHook(() => useHitContext(), { wrapper });

    // Add some hits
    await waitFor(() => {
      mockSetHits([{ t: 'PAGEVIEW' }]);
    });

    // Clear hits
    await waitFor(() => {
      result.current.clearHits();
    });

    await waitFor(() => {
      expect(result.current.hits).toEqual([]);
    });
  });

  it('should return all hits when search term is empty', async () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <HitProvider ABTastQA={mockABTastyQA}>{children}</HitProvider>
    );

    const { result } = renderHook(() => useHitContext(), { wrapper });

    const mockHits = [
      { t: 'PAGEVIEW' },
      { t: 'ACTIVATE' },
    ];

    await waitFor(() => {
      mockSetHits(mockHits);
    });

    await waitFor(() => {
      expect(result.current.filteredHits).toEqual(mockHits);
    });
  });

  it('should search in JSON stringified hit content', async () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <HitProvider ABTastQA={mockABTastyQA}>{children}</HitProvider>
    );

    const { result } = renderHook(() => useHitContext(), { wrapper });

    const mockHits = [
      { t: 'PAGEVIEW', page: '/special-page' },
      { t: 'ACTIVATE', campaignId: 'unique123' },
    ];

    await waitFor(() => {
      mockSetHits(mockHits);
    });

    // Search for content in JSON
    await waitFor(() => {
      result.current.searchEvents('unique123');
    });

    await waitFor(() => {
      expect(result.current.filteredHits.length).toBe(1);
      expect(result.current.filteredHits[0].campaignId).toBe('unique123');
    });
  });

  it('should call useEventsListener exactly once', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <HitProvider ABTastQA={mockABTastyQA}>{children}</HitProvider>
    );

    renderHook(() => useHitContext(), { wrapper });

    expect(useSDKIntegration.useEventsListener).toHaveBeenCalledTimes(1);
    expect(useSDKIntegration.useEventsListener).toHaveBeenCalledWith(
      mockABTastyQA,
      expect.any(Function)
    );
  });
});

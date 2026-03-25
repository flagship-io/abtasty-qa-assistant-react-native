import React from 'react';
import { renderHook, waitFor } from '@testing-library/react-native';
import {
  useBucketingFileSync,
  useQAReadyEmitter,
  useAllocatedVariationsListener,
  useEventsListener,
  useForcedAllocationSync,
  useForcedUnallocationSync,
} from '../../src/hooks/useSDKIntegration';
import { AppContext } from '../../src/contexts/appContext';
import { initialAppDataState } from '../../src/data/initialAppDataState';
import { CampaignType } from '../../src/types.local';
import * as api from '../../src/api';
import {
  ABTastyQA,
  QAEventQaAssistantName,
  QAEventSdkName,
} from '@flagship.io/react-native-sdk';

// Mock the API module
jest.mock('../../src/api');

describe('SDK Integration Hooks', () => {
  let mockABTastyQA: ABTastyQA;
  let mockDispatch: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    mockDispatch = jest.fn();

    // Mock ABTastyQA instance
    mockABTastyQA = {
      ABTastyQAEventBus: {
        emitQAEventToSDK: jest.fn(),
        onQAEventFromSDK: jest.fn(() => jest.fn()), // Returns cleanup function
      },
    } as any;
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  describe('useBucketingFileSync', () => {
    it('should fetch bucketing file on mount with valid envId', async () => {
      const mockBucketingFile = {
        campaigns: [{ id: 'campaign1', name: 'Test Campaign' }],
      };
      (api.getBucketingFile as jest.Mock).mockResolvedValue(mockBucketingFile);

      renderHook(() => useBucketingFileSync('env123', mockDispatch));

      await waitFor(() => {
        expect(api.getBucketingFile).toHaveBeenCalledWith('env123');
        expect(api.getBucketingFile).toHaveBeenCalledTimes(1);
      });

      await waitFor(() => {
        expect(mockDispatch).toHaveBeenCalledWith(
          expect.objectContaining({ type: 'SET_IS_CAMPAIGNS_LOADING', payload: true })
        );
      });

      await waitFor(() => {
        expect(mockDispatch).toHaveBeenCalledWith(
          expect.objectContaining({
            type: 'SET_BUCKETING_FILE',
            payload: mockBucketingFile,
          })
        );
        expect(mockDispatch).toHaveBeenCalledTimes(2);
      });
    });

    it('should not fetch when envId is empty', () => {
      const consoleWarn = jest.spyOn(console, 'warn').mockImplementation();

      renderHook(() => useBucketingFileSync('', mockDispatch));

      expect(api.getBucketingFile).not.toHaveBeenCalled();
      expect(consoleWarn).toHaveBeenCalledWith(
        'ABTasty QA Assistant: envId is required to fetch bucketing file.'
      );

      consoleWarn.mockRestore();
    });

    it('should handle fetch errors', async () => {
      const consoleError = jest.spyOn(console, 'error').mockImplementation();
      (api.getBucketingFile as jest.Mock).mockRejectedValue(new Error('Network error'));

      renderHook(() => useBucketingFileSync('env123', mockDispatch));

      await waitFor(() => {
        expect(consoleError).toHaveBeenCalledWith(
          'ABTasty QA Assistant Error: Failed to fetch bucketing file.',
          expect.any(Error)
        );
      });

      consoleError.mockRestore();
    });

    it('should abort fetch on unmount', async () => {
      let resolvePromise: (value: unknown) => void;
      const pendingPromise = new Promise((resolve) => {
        resolvePromise = resolve;
      });
      
      (api.getBucketingFile as jest.Mock).mockReturnValue(pendingPromise);

      const { unmount } = renderHook(() => useBucketingFileSync('env123', mockDispatch));

      expect(api.getBucketingFile).toHaveBeenCalledTimes(1);
      
      unmount();
      
      // Resolve the promise to clean up
      resolvePromise!({});
    });

    it('should prevent concurrent fetches', async () => {
      const mockBucketingFile = { campaigns: [] };
      let resolveFirstFetch: (value: unknown) => void;
      const firstFetchPromise = new Promise((resolve) => {
        resolveFirstFetch = resolve;
      });

      (api.getBucketingFile as jest.Mock).mockReturnValueOnce(firstFetchPromise);

      const { rerender } = renderHook(
        ({ envId }) => useBucketingFileSync(envId, mockDispatch),
        { initialProps: { envId: 'env123' } }
      );

      // First call initiated
      expect(api.getBucketingFile).toHaveBeenCalledTimes(1);

      // Trigger re-render while first fetch is pending
      rerender({ envId: 'env123' });

      // Should not call API again (concurrent fetch prevention)
      expect(api.getBucketingFile).toHaveBeenCalledTimes(1);

      // Complete the first fetch
      resolveFirstFetch!(mockBucketingFile);
      await waitFor(() => {
        expect(mockDispatch).toHaveBeenCalledWith(
          expect.objectContaining({
            type: 'SET_BUCKETING_FILE',
            payload: mockBucketingFile,
          })
        );
      });
    });

    it('should abort previous fetch when new fetch is initiated after first completes', async () => {
      const mockBucketingFile1 = { campaigns: [{ id: 'campaign1' }] };
      const mockBucketingFile2 = { campaigns: [{ id: 'campaign2' }] };

      (api.getBucketingFile as jest.Mock)
        .mockResolvedValueOnce(mockBucketingFile1)
        .mockResolvedValueOnce(mockBucketingFile2);

      const { rerender } = renderHook(
        ({ envId }) => useBucketingFileSync(envId, mockDispatch),
        { initialProps: { envId: 'env123' } }
      );

      // Wait for first fetch to complete
      await waitFor(() => {
        expect(mockDispatch).toHaveBeenCalledWith(
          expect.objectContaining({
            type: 'SET_BUCKETING_FILE',
            payload: mockBucketingFile1,
          })
        );
      });

      // Trigger new fetch with different envId
      rerender({ envId: 'env456' });

      // Should call API again
      await waitFor(() => {
        expect(api.getBucketingFile).toHaveBeenCalledTimes(2);
        expect(api.getBucketingFile).toHaveBeenCalledWith('env456');
      });
    });
  });

  describe('useQAReadyEmitter', () => {
    it('should emit QA_READY event when bucketing file is loaded', () => {
      const mockBucketingFile = {
        campaigns: [{ id: 'campaign1' }],
      };

      renderHook(() => useQAReadyEmitter(mockABTastyQA, mockBucketingFile as any));

      expect(mockABTastyQA.ABTastyQAEventBus.emitQAEventToSDK).toHaveBeenCalledWith(
        QAEventQaAssistantName.QA_READY
      );
      expect(mockABTastyQA.ABTastyQAEventBus.emitQAEventToSDK).toHaveBeenCalledTimes(1);
    });

    it('should not emit when bucketing file is undefined', () => {
      renderHook(() => useQAReadyEmitter(mockABTastyQA, undefined));

      expect(mockABTastyQA.ABTastyQAEventBus.emitQAEventToSDK).not.toHaveBeenCalled();
    });

    it('should only emit once on initial load, not on subsequent changes', () => {
      const mockBucketingFile1 = { campaigns: [{ id: 'campaign1' }] };
      const mockBucketingFile2 = { campaigns: [{ id: 'campaign2' }] };

      const { rerender } = renderHook(
        ({ file }) => useQAReadyEmitter(mockABTastyQA, file),
        { initialProps: { file: mockBucketingFile1 as any } }
      );

      // Should emit once on initial load
      expect(mockABTastyQA.ABTastyQAEventBus.emitQAEventToSDK).toHaveBeenCalledTimes(1);

      // Re-render with different bucketing file
      rerender({ file: mockBucketingFile2 as any });

      // Should still only be called once (no re-emission on change)
      expect(mockABTastyQA.ABTastyQAEventBus.emitQAEventToSDK).toHaveBeenCalledTimes(1);
    });
  });

  describe('useAllocatedVariationsListener', () => {
    it('should register listener for SDK_ALLOCATED_VARIATIONS event', () => {
      renderHook(() => useAllocatedVariationsListener(mockABTastyQA, mockDispatch));

      expect(mockABTastyQA.ABTastyQAEventBus.onQAEventFromSDK).toHaveBeenCalledWith(
        QAEventSdkName.SDK_ALLOCATED_VARIATIONS,
        expect.any(Function)
      );
    });

    it('should dispatch action when valid variations data received', () => {
      let eventCallback: any;
      (mockABTastyQA.ABTastyQAEventBus.onQAEventFromSDK as jest.Mock).mockImplementation(
        (event, callback) => {
          eventCallback = callback;
          return jest.fn();
        }
      );

      renderHook(() => useAllocatedVariationsListener(mockABTastyQA, mockDispatch));

      const mockData = {
        value: {
          campaign1: {
            campaignId: 'campaign1',
            variationGroupId: 'vg1',
            variationId: 'v1',
          },
        },
      };

      eventCallback(mockData);

      expect(mockDispatch).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'SPLIT_CAMPAIGNS_BY_ALLOCATION',
          payload: mockData,
        })
      );
      expect(mockDispatch).toHaveBeenCalledTimes(1);
    });

    it('should not dispatch when invalid variations data received', () => {
      let eventCallback: any;
      (mockABTastyQA.ABTastyQAEventBus.onQAEventFromSDK as jest.Mock).mockImplementation(
        (event, callback) => {
          eventCallback = callback;
          return jest.fn();
        }
      );

      renderHook(() => useAllocatedVariationsListener(mockABTastyQA, mockDispatch));

      // Missing required fields
      const invalidData = {
        value: {
          campaign1: { variationGroupId: 'vg1' }, // Missing variationId and campaignId
        },
      };

      eventCallback(invalidData);

      expect(mockDispatch).not.toHaveBeenCalled();
    });

    it('should cleanup listener on unmount', () => {
      const mockCleanup = jest.fn();
      (mockABTastyQA.ABTastyQAEventBus.onQAEventFromSDK as jest.Mock).mockReturnValue(
        mockCleanup
      );

      const { unmount } = renderHook(() =>
        useAllocatedVariationsListener(mockABTastyQA, mockDispatch)
      );

      unmount();

      expect(mockCleanup).toHaveBeenCalled();
      expect(mockCleanup).toHaveBeenCalledTimes(1);
    });
  });

  describe('useEventsListener', () => {
    it('should register listener for SDK_HIT_SENT event', () => {
      const mockSetHits = jest.fn();

      renderHook(() => useEventsListener(mockABTastyQA, mockSetHits));

      expect(mockABTastyQA.ABTastyQAEventBus.onQAEventFromSDK).toHaveBeenCalledWith(
        QAEventSdkName.SDK_HIT_SENT,
        expect.any(Function)
      );
    });

    it('should prepend new hits to existing hits', () => {
      let eventCallback: any;
      let capturedResult: any;
      const mockSetHits = jest.fn((updater) => {
        if (typeof updater === 'function') {
          const prevHits = [{ type: 'existing' }];
          capturedResult = updater(prevHits);
          return capturedResult;
        }
      });

      (mockABTastyQA.ABTastyQAEventBus.onQAEventFromSDK as jest.Mock).mockImplementation(
        (event, callback) => {
          eventCallback = callback;
          return jest.fn();
        }
      );

      renderHook(() => useEventsListener(mockABTastyQA, mockSetHits));

      const newHits = [{ type: 'PAGEVIEW' }, { type: 'EVENT' }];
      eventCallback({ value: newHits });

      expect(mockSetHits).toHaveBeenCalled();
      expect(mockSetHits).toHaveBeenCalledTimes(1);
      expect(mockSetHits).toHaveBeenCalledWith(expect.any(Function));

      expect(capturedResult).toEqual([
        { type: 'PAGEVIEW' },
        { type: 'EVENT' },
        { type: 'existing' },
      ]);
    });

    it('should cleanup listener on unmount', () => {
      const mockCleanup = jest.fn();
      const mockSetHits = jest.fn();
      (mockABTastyQA.ABTastyQAEventBus.onQAEventFromSDK as jest.Mock).mockReturnValue(
        mockCleanup
      );

      const { unmount } = renderHook(() => useEventsListener(mockABTastyQA, mockSetHits));

      unmount();

      expect(mockCleanup).toHaveBeenCalled();
    });
  });

  describe('useForcedAllocationSync', () => {
    it('should emit forced allocation event when flag is true', () => {
      const mockState = {
        ...initialAppDataState,
        ABTastQA: mockABTastyQA,
        shouldSendForcedAllocation: true,
        variationsForcedAllocation: {
          campaign1: {
            campaignId: 'campaign1',
            campaignName: 'Test Campaign',
            campaignType: CampaignType.ab,
            variationGroupId: 'vg1',
            variation: {
              id: 'v1',
              name: 'Variation 1',
              allocation: 50,
              reference: false,
              modifications: { type: 'FLAG', value: {} },
            },
          },
        },
      };

      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <AppContext.Provider
          value={{
            appDataState: mockState,
            dispatchAppData: mockDispatch,
          }}
        >
          {children}
        </AppContext.Provider>
      );

      renderHook(() => useForcedAllocationSync(), { wrapper });

      expect(mockABTastyQA.ABTastyQAEventBus.emitQAEventToSDK).toHaveBeenCalledWith(
        QAEventQaAssistantName.QA_APPLY_FORCED_ALLOCATION,
        { value: mockState.variationsForcedAllocation }
      );
      expect(mockABTastyQA.ABTastyQAEventBus.emitQAEventToSDK).toHaveBeenCalledTimes(1);

      expect(mockDispatch).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'SET_SHOULD_SEND_FORCED_ALLOCATION',
          payload: false,
        })
      );
      expect(mockDispatch).toHaveBeenCalledTimes(1);
    });

    it('should not emit when flag is false', () => {
      const mockState = {
        ...initialAppDataState,
        ABTastQA: mockABTastyQA,
        shouldSendForcedAllocation: false,
      };

      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <AppContext.Provider
          value={{
            appDataState: mockState,
            dispatchAppData: mockDispatch,
          }}
        >
          {children}
        </AppContext.Provider>
      );

      renderHook(() => useForcedAllocationSync(), { wrapper });

      expect(mockABTastyQA.ABTastyQAEventBus.emitQAEventToSDK).not.toHaveBeenCalled();
      expect(mockDispatch).not.toHaveBeenCalled();
    });
  });

  describe('useForcedUnallocationSync', () => {
    it('should emit forced unallocation event when flag is true', () => {
      const mockState = {
        ...initialAppDataState,
        ABTastQA: mockABTastyQA,
        shouldSendForcedUnallocation: true,
        variationsForcedUnallocation: {
          campaign2: {
            campaignId: 'campaign2',
            campaignName: 'Test Campaign 2',
            campaignType: CampaignType.ab,
            variationGroupId: 'vg2',
            variation: {
              id: 'v2',
              name: 'Variation 2',
              allocation: 50,
              reference: false,
              modifications: { type: 'FLAG', value: {} },
            },
          },
        },
      };

      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <AppContext.Provider
          value={{
            appDataState: mockState,
            dispatchAppData: mockDispatch,
          }}
        >
          {children}
        </AppContext.Provider>
      );

      renderHook(() => useForcedUnallocationSync(), { wrapper });

      expect(mockABTastyQA.ABTastyQAEventBus.emitQAEventToSDK).toHaveBeenCalledWith(
        QAEventQaAssistantName.QA_APPLY_FORCED_UNALLOCATION,
        { value: mockState.variationsForcedUnallocation }
      );
      expect(mockABTastyQA.ABTastyQAEventBus.emitQAEventToSDK).toHaveBeenCalledTimes(1);

      expect(mockDispatch).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'SET_SHOULD_SEND_FORCED_UNALLOCATION',
          payload: false,
        })
      );
      expect(mockDispatch).toHaveBeenCalledTimes(1);
    });

    it('should not emit when flag is false', () => {
      const mockState = {
        ...initialAppDataState,
        ABTastQA: mockABTastyQA,
        shouldSendForcedUnallocation: false,
      };

      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <AppContext.Provider
          value={{
            appDataState: mockState,
            dispatchAppData: mockDispatch,
          }}
        >
          {children}
        </AppContext.Provider>
      );

      renderHook(() => useForcedUnallocationSync(), { wrapper });

      expect(mockABTastyQA.ABTastyQAEventBus.emitQAEventToSDK).not.toHaveBeenCalled();
      expect(mockDispatch).not.toHaveBeenCalled();
    });
  });
});

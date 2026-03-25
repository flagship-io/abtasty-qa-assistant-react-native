import React from 'react';
import { renderHook, waitFor } from '@testing-library/react-native';
import { AppProvider } from '../../src/providers/AppProvider';
import { useAppContext } from '../../src/hooks/useAppContext';
import { ABTastyQA } from '@flagship.io/react-native-sdk';
import * as useSDKIntegration from '../../src/hooks/useSDKIntegration';

// Mock the SDK integration hooks
jest.mock('../../src/hooks/useSDKIntegration');

describe('AppProvider', () => {
  let mockABTastyQA: ABTastyQA;

  beforeEach(() => {
    jest.clearAllMocks();

    mockABTastyQA = {
      envId: 'test-env-123',
      ABTastyQAEventBus: {
        emitQAEventToSDK: jest.fn(),
        onQAEventFromSDK: jest.fn(() => jest.fn()),
      },
    } as any;

    // Mock all SDK integration hooks
    (useSDKIntegration.useBucketingFileSync as jest.Mock).mockImplementation(() => {});
    (useSDKIntegration.useQAReadyEmitter as jest.Mock).mockImplementation(() => {});
    (useSDKIntegration.useAllocatedVariationsListener as jest.Mock).mockImplementation(() => {});
    (useSDKIntegration.useEventsListener as jest.Mock).mockImplementation(() => {});
  });

  it('should provide initial app state with correct values', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <AppProvider ABTastQA={mockABTastyQA}>{children}</AppProvider>
    );

    const { result } = renderHook(() => useAppContext(), { wrapper });

    expect(result.current.appDataState).toBeDefined();
    expect(result.current.appDataState.fsEnvId).toBe('test-env-123');
    expect(result.current.appDataState.ABTastQA).toBe(mockABTastyQA);
    expect(result.current.appDataState.isCampaignsLoading).toBe(true);
    expect(result.current.dispatchAppData).toBeDefined();
    expect(typeof result.current.dispatchAppData).toBe('function');
  });

  it('should call useBucketingFileSync with correct envId', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <AppProvider ABTastQA={mockABTastyQA}>{children}</AppProvider>
    );

    renderHook(() => useAppContext(), { wrapper });

    expect(useSDKIntegration.useBucketingFileSync).toHaveBeenCalledTimes(1);
    expect(useSDKIntegration.useBucketingFileSync).toHaveBeenCalledWith(
      'test-env-123',
      expect.any(Function)
    );
  });

  it('should call useQAReadyEmitter with ABTastyQA instance', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <AppProvider ABTastQA={mockABTastyQA}>{children}</AppProvider>
    );

    renderHook(() => useAppContext(), { wrapper });

    expect(useSDKIntegration.useQAReadyEmitter).toHaveBeenCalledTimes(1);
    expect(useSDKIntegration.useQAReadyEmitter).toHaveBeenCalledWith(
      mockABTastyQA,
      undefined // bucketingFile is initially undefined
    );
  });

  it('should call useAllocatedVariationsListener with ABTastyQA', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <AppProvider ABTastQA={mockABTastyQA}>{children}</AppProvider>
    );

    renderHook(() => useAppContext(), { wrapper });

    expect(useSDKIntegration.useAllocatedVariationsListener).toHaveBeenCalledTimes(1);
    expect(useSDKIntegration.useAllocatedVariationsListener).toHaveBeenCalledWith(
      mockABTastyQA,
      expect.any(Function)
    );
  });

  it('should provide dispatchAppData that can update state', async () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <AppProvider ABTastQA={mockABTastyQA}>{children}</AppProvider>
    );

    const { result } = renderHook(() => useAppContext(), { wrapper });

    // Dispatch an action to update loading state
    await waitFor(() => {
      result.current.dispatchAppData({
        type: 'SET_IS_CAMPAIGNS_LOADING',
        payload: false,
      });
    });

    await waitFor(() => {
      expect(result.current.appDataState.isCampaignsLoading).toBe(false);
    });
  });

  it('should initialize all hooks exactly once', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <AppProvider ABTastQA={mockABTastyQA}>{children}</AppProvider>
    );

    renderHook(() => useAppContext(), { wrapper });

    expect(useSDKIntegration.useBucketingFileSync).toHaveBeenCalledTimes(1);
    expect(useSDKIntegration.useQAReadyEmitter).toHaveBeenCalledTimes(1);
    expect(useSDKIntegration.useAllocatedVariationsListener).toHaveBeenCalledTimes(1);
  });

  it('should include HitProvider in context tree', () => {
    // HitProvider is rendered as child, which means useEventsListener is called
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <AppProvider ABTastQA={mockABTastyQA}>{children}</AppProvider>
    );

    renderHook(() => useAppContext(), { wrapper });

    // useEventsListener is called by HitProvider
    expect(useSDKIntegration.useEventsListener).toHaveBeenCalledTimes(1);
  });
});

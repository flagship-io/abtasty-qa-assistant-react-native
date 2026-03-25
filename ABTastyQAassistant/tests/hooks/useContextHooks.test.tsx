import React from 'react';
import { renderHook } from '@testing-library/react-native';
import { useAppContext } from '../../src/hooks/useAppContext';
import { useHitContext } from '../../src/hooks/useHitContext';
import { useHits } from '../../src/hooks/useHits';
import { AppContext } from '../../src/contexts/appContext';
import { HitsContext } from '../../src/contexts/hitsContext';
import { initialAppDataState } from '../../src/data/initialAppDataState';

// Mock data
const mockHits = [
  { type: 'PAGEVIEW', timestamp: 1234567890 },
  { type: 'EVENT', timestamp: 1234567891 },
];

describe('Context Hooks', () => {
  describe('useAppContext', () => {
    it('should return app context value when used within AppProvider', () => {
      const mockDispatch = jest.fn();
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <AppContext.Provider
          value={{
            appDataState: initialAppDataState,
            dispatchAppData: mockDispatch,
          }}
        >
          {children}
        </AppContext.Provider>
      );

      const { result } = renderHook(() => useAppContext(), { wrapper });

      expect(result.current.appDataState).toEqual(initialAppDataState);
      expect(result.current.dispatchAppData).toBe(mockDispatch);
    });

    it('should return default context when used outside AppProvider', () => {
      const { result } = renderHook(() => useAppContext());

      expect(result.current.appDataState).toEqual(initialAppDataState);
      expect(result.current.dispatchAppData).toBeDefined();
    });

    it('should provide access to bucketing file from context', () => {
      const mockBucketingFile = {
        campaigns: [
          {
            id: 'campaign1',
            name: 'Test Campaign',
            variationGroups: [],
          },
        ],
      };

      const mockDispatch = jest.fn();
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <AppContext.Provider
          value={{
            appDataState: {
              ...initialAppDataState,
              bucketingFile: mockBucketingFile as any,
            },
            dispatchAppData: mockDispatch,
          }}
        >
          {children}
        </AppContext.Provider>
      );

      const { result } = renderHook(() => useAppContext(), { wrapper });

      expect(result.current.appDataState.bucketingFile).toEqual(mockBucketingFile);
    });
  });

  describe('useHitContext', () => {
    it('should return hits context value', () => {
      const mockClearHits = jest.fn();
      const mockSearchEvents = jest.fn();
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <HitsContext.Provider
          value={{
            hits: mockHits,
            filteredHits: mockHits,
            clearHits: mockClearHits,
            searchEvents: mockSearchEvents,
          }}
        >
          {children}
        </HitsContext.Provider>
      );

      const { result } = renderHook(() => useHitContext(), { wrapper });

      expect(result.current.hits).toEqual(mockHits);
      expect(result.current.clearHits).toBe(mockClearHits);
      expect(result.current.searchEvents).toBe(mockSearchEvents);
    });

    it('should provide empty hits array by default', () => {
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <HitsContext.Provider
          value={{
            hits: [],
            filteredHits: [],
            clearHits: jest.fn(),
            searchEvents: jest.fn(),
          }}
        >
          {children}
        </HitsContext.Provider>
      );

      const { result } = renderHook(() => useHitContext(), { wrapper });

      expect(result.current.hits).toEqual([]);
      expect(result.current.filteredHits).toEqual([]);
    });
  });

  describe('useHits', () => {
    it('should return hits array from hits context', () => {
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <HitsContext.Provider
          value={{
            hits: mockHits,
            filteredHits: mockHits,
            clearHits: jest.fn(),
            searchEvents: jest.fn(),
          }}
        >
          {children}
        </HitsContext.Provider>
      );

      const { result } = renderHook(() => useHits(), { wrapper });

      expect(result.current).toEqual(mockHits);
    });

    it('should return empty array when no hits available', () => {
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <HitsContext.Provider
          value={{
            hits: [],
            filteredHits: [],
            clearHits: jest.fn(),
            searchEvents: jest.fn(),
          }}
        >
          {children}
        </HitsContext.Provider>
      );

      const { result } = renderHook(() => useHits(), { wrapper });

      expect(result.current).toEqual([]);
    });

    it('should return multiple hits in correct order', () => {
      const multipleHits = [
        { type: 'PAGEVIEW', timestamp: 1 },
        { type: 'EVENT', timestamp: 2 },
        { type: 'TRANSACTION', timestamp: 3 },
      ];
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <HitsContext.Provider
          value={{
            hits: multipleHits,
            filteredHits: multipleHits,
            clearHits: jest.fn(),
            searchEvents: jest.fn(),
          }}
        >
          {children}
        </HitsContext.Provider>
      );

      const { result } = renderHook(() => useHits(), { wrapper });

      expect(result.current).toEqual(multipleHits);
      expect(result.current).toHaveLength(3);
    });
  });
});


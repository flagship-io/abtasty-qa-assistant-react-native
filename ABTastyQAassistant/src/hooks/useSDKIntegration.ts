import { Dispatch, useEffect, useRef } from "react";
import { getBucketingFile } from "../api";
import {
  setBucketingFile,
  setIsCampaignsLoading,
  setShouldSendForcedAllocation,
  setShouldSendForcedUnallocation,
  splitCampaignsByAllocationActionCreator,
} from "../reducers/actionsCreator";
import {
  ABTastyQA,
  QAEventQaAssistantName,
  QAEventSdkName,
  VisitorVariations,
} from "@flagship.io/react-native-sdk";
import { BucketingDTO, DispatchAppData } from "../types.local";
import { validateVariationType } from "../utils";
import { useAppContext } from "./useAppContext";

/**
 * Fetches and syncs bucketing file from the API
 * @param envId - Environment ID
 * @param dispatchAppData - Dispatch function for app data
 */
export function useBucketingFileSync(
  envId: string,
  dispatchAppData: DispatchAppData,
) {
  const abortControllerRef = useRef<AbortController | null>(null);
  const isFetchingRef = useRef(false);

  useEffect(() => {
    if (!envId) {
      console.warn(
        "ABTasty QA Assistant: envId is required to fetch bucketing file.",
      );
      return;
    }

    if (isFetchingRef.current) {
      return;
    }

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();
    isFetchingRef.current = true;

    dispatchAppData(setIsCampaignsLoading(true));

    getBucketingFile(envId)
      .then((bucketingFile) => {
        if (!abortControllerRef.current?.signal.aborted) {
          dispatchAppData(setBucketingFile(bucketingFile));
          console.log(
            "ABTasty QA Assistant: Bucketing file fetched successfully.",
          );
        }
      })
      .catch((error) => {
        if (!abortControllerRef.current?.signal.aborted) {
          console.error(
            "ABTasty QA Assistant Error: Failed to fetch bucketing file.",
            error,
          );
          dispatchAppData(setIsCampaignsLoading(false));
        }
      })
      .finally(() => {
        isFetchingRef.current = false;
      });

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
        abortControllerRef.current = null;
      }
      isFetchingRef.current = false;
    };
  }, [envId, dispatchAppData]);
}

/**
 * Emits QA_READY event to SDK when bucketing file is loaded for the first time only
 * @param ABTastQA - ABTasty QA instance
 * @param bucketingFile - Bucketing file data
 */
export function useQAReadyEmitter(
  ABTastQA: ABTastyQA,
  bucketingFile?: BucketingDTO,
) {
  const hasEmittedRef = useRef(false);

  useEffect(() => {
    if (bucketingFile && !hasEmittedRef.current) {
      ABTastQA.ABTastyQAEventBus.emitQAEventToSDK(
        QAEventQaAssistantName.QA_READY,
      );
      hasEmittedRef.current = true;
    }
  }, [ABTastQA, bucketingFile]);
}

/**
 * Listens to SDK_ALLOCATED_VARIATIONS events from the SDK
 * @param ABTastQA - ABTasty QA instance
 * @param dispatchAppData - Dispatch function for app data
 */
export function useAllocatedVariationsListener(
  ABTastQA: ABTastyQA,
  dispatchAppData: DispatchAppData,
) {
  useEffect(() => {
    const cleanupSplitCampaignsByAllocation =
      ABTastQA.ABTastyQAEventBus.onQAEventFromSDK(
        QAEventSdkName.SDK_ALLOCATED_VARIATIONS,
        (data: { value: Record<string, VisitorVariations> }) => {
          if (!validateVariationType(data.value)) {
            return;
          }
          dispatchAppData(splitCampaignsByAllocationActionCreator(data));
        },
      );
    return () => {
      cleanupSplitCampaignsByAllocation();
    };
  }, [ABTastQA, dispatchAppData]);
}

export function useEventsListener(
  ABTastQA: ABTastyQA,
  setHits: Dispatch<React.SetStateAction<Record<string, unknown>[]>>,
) {
  useEffect(() => {
    const cleanupEventsListener = ABTastQA.ABTastyQAEventBus.onQAEventFromSDK(
      QAEventSdkName.SDK_HIT_SENT,
      (data) => {
        setHits((prevHits) => [...data.value, ...prevHits]);
      },
    );
    return () => {
      cleanupEventsListener();
    };
  }, [ABTastQA, setHits]);
}

/**
 * Syncs forced allocations to the SDK when state changes
 */
export function useForcedAllocationSync() {
  const { appDataState, dispatchAppData } = useAppContext();
  const ABTastQA = appDataState.ABTastQA;

  useEffect(() => {
    if (appDataState.shouldSendForcedAllocation) {
      ABTastQA.ABTastyQAEventBus.emitQAEventToSDK(
        QAEventQaAssistantName.QA_APPLY_FORCED_ALLOCATION,
        { value: appDataState.variationsForcedAllocation },
      );
      dispatchAppData(setShouldSendForcedAllocation(false));
    }
  }, [appDataState, ABTastQA, dispatchAppData]);
}

export function useForcedUnallocationSync() {
  const { appDataState, dispatchAppData } = useAppContext();
  const ABTastQA = appDataState.ABTastQA;

  useEffect(() => {
    if (appDataState.shouldSendForcedUnallocation) {
      ABTastQA.ABTastyQAEventBus.emitQAEventToSDK(
        QAEventQaAssistantName.QA_APPLY_FORCED_UNALLOCATION,
        { value: appDataState.variationsForcedUnallocation },
      );
      dispatchAppData(setShouldSendForcedUnallocation(false));
    }
  }, [appDataState, ABTastQA, dispatchAppData]);
}

export function useSDKSync() {
  useForcedAllocationSync();
  useForcedUnallocationSync();
}

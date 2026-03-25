import { useCallback } from "react";
import {
  applyForceAllocation,
  applyForcedUnallocation,
  applyForcedVariation,
  resetAllCampaigns,
  unsetForcedAllocation,
  unsetForcedUnallocation,
} from "../reducers/actionsCreator";
import { FsVariationToForce } from "../types.local";
import { useAppContext } from "./useAppContext";
import {
  useForcedAllocations,
  useForcedUnallocations,
  useForcedVariations,
} from "./useCampaigns";
import { QAEventQaAssistantName } from "@flagship.io/react-native-sdk";

/**
 * Hook for forcing specific variations
 * @returns Actions to apply or reset forced variations
 */
export function useForcedVariationActions() {
  const { appDataState, dispatchAppData } = useAppContext();
  const ABTastQA = appDataState.ABTastQA;
  const forcedVariations = useForcedVariations() || {};

  const applyVariation = useCallback(
    (value?: Record<string, FsVariationToForce>) => {
      const variationsToApply = { ...forcedVariations, ...value };

      ABTastQA.ABTastyQAEventBus.emitQAEventToSDK(
        QAEventQaAssistantName.QA_APPLY_FORCED_VARIATIONS,
        { value: variationsToApply }
      );

      dispatchAppData(applyForcedVariation(variationsToApply));
    },
    [ABTastQA, forcedVariations, dispatchAppData]
  );

  return { applyVariation };
}

/**
 * Hook for forcing campaign allocation (making rejected campaigns appear)
 * @returns Actions to apply or unset forced allocations
 */
export function useCampaignAllocation() {
  const { dispatchAppData } = useAppContext();
  const forcedAllocations = useForcedAllocations() || {};

  const applyAllocation = useCallback(
    (value?: Record<string, FsVariationToForce>) => {
      const allocationsToApply = { ...forcedAllocations, ...value };
      dispatchAppData(applyForceAllocation(allocationsToApply));
    },
    [forcedAllocations, dispatchAppData]
  );

  const unsetAllocation = useCallback(
    (campaignId: string) => {
      dispatchAppData(unsetForcedAllocation(campaignId));
    },
    [dispatchAppData]
  );

  return { applyAllocation, unsetAllocation };
}

/**
 * Hook for forcing campaign unallocation (hiding accepted campaigns)
 * @returns Actions to apply or unset forced unallocations
 */
export function useCampaignUnallocation() {
  const { dispatchAppData } = useAppContext();
  const forcedUnallocations = useForcedUnallocations() || {};

  const applyUnallocation = useCallback(
    (value?: Record<string, FsVariationToForce>) => {
      const unallocationsToApply = { ...forcedUnallocations, ...value };
      dispatchAppData(applyForcedUnallocation(unallocationsToApply));
    },
    [forcedUnallocations, dispatchAppData]
  );

  const unsetUnallocation = useCallback(
    (campaignId: string) => {
      dispatchAppData(unsetForcedUnallocation(campaignId));
    },
    [dispatchAppData]
  );

  return { applyUnallocation, unsetUnallocation };
}

export function useResetAllCampaignsAction() {
  const { dispatchAppData } = useAppContext();

  const reinitializeAllCampaigns = useCallback(() => {
    dispatchAppData(resetAllCampaigns());
  }, [dispatchAppData]);

  return { reinitializeAllCampaigns };
}

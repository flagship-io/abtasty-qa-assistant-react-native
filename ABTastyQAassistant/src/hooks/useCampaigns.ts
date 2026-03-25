import { useMemo } from "react";
import {
  CampaignDisplayStatus,
  FsCampaign,
  FsVariationToForce,
  WebSDKCampaignStatus,
} from "../types.local";
import { useAppContext } from "./useAppContext";

/**
 * Gets a campaign by ID from accepted or rejected campaigns
 * @param campaignId - The campaign ID to find
 * @returns Campaign if found, undefined otherwise
 */
export function useCampaign(campaignId: string): FsCampaign | undefined {
  const { appDataState } = useAppContext();

  return useMemo(() => {
    return (
      appDataState.allAcceptedCampaigns?.find((c) => c.id === campaignId) ||
      appDataState.allRejectedCampaigns?.find((c) => c.id === campaignId)
    );
  }, [
    appDataState.allAcceptedCampaigns,
    appDataState.allRejectedCampaigns,
    campaignId,
  ]);
}

/**
 * Gets forced and allocated variations for a specific campaign
 * @param campaignId - The campaign ID to get variations for
 * @returns Object containing forcedVariation, allocatedVariation, forcedAllocation, and forcedUnallocation
 */
export function useCampaignVariationStates(campaignId: string) {
  const forcedVariations = useForcedVariations();
  const allocatedVariations = useAllocatedVariations();
  const forcedAllocations = useForcedAllocations();
  const forcedUnallocations = useForcedUnallocations();

  const forcedVariation = forcedVariations?.[campaignId] as
    | FsVariationToForce
    | undefined;
  const allocatedVariation = allocatedVariations?.[campaignId];
  const forcedAllocation = forcedAllocations?.[campaignId] as
    | FsVariationToForce
    | undefined;
  const forcedUnallocation = forcedUnallocations?.[campaignId] as
    | FsVariationToForce
    | undefined;

  return {
    forcedVariation,
    allocatedVariation,
    forcedAllocation,
    forcedUnallocation,
  };
}

/**
 * Determines if the variation action button should be shown
 * @param campaignStatus - Campaign status (ACCEPTED or REJECTED)
 * @param campaignDisplayStatus - Display status (SHOWN, HIDDEN, or RESET)
 * @returns True if action button should be visible
 */
export function useCanShowVariationAction(
  campaignStatus: WebSDKCampaignStatus,
  campaignDisplayStatus: CampaignDisplayStatus
): boolean {
  return useMemo(() => {
    if (
      campaignStatus === WebSDKCampaignStatus.ACCEPTED &&
      campaignDisplayStatus === CampaignDisplayStatus.SHOWN
    ) {
      return true;
    }
    if (
      campaignStatus === WebSDKCampaignStatus.REJECTED &&
      campaignDisplayStatus === CampaignDisplayStatus.RESET
    ) {
      return true;
    }
    return false;
  }, [campaignStatus, campaignDisplayStatus]);
}

/**
 * Gets all allocated variations from state
 */
export function useAllocatedVariations() {
  return useAppContext().appDataState.allocatedVariations;
}

/**
 * Gets all forced variations from state
 */
export function useForcedVariations() {
  return useAppContext().appDataState.forcedVariations;
}

/**
 * Gets all forced allocations from state
 */
export function useForcedAllocations() {
  return useAppContext().appDataState.variationsForcedAllocation;
}

/**
 * Gets all forced unallocations from state
 */
export function useForcedUnallocations() {
  return useAppContext().appDataState.variationsForcedUnallocation;
}

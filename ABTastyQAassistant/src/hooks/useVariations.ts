import { useMemo } from "react";
import { FsVariation } from "../types.local";
import { useCampaign, useCampaignVariationStates } from "./useCampaigns";

/**
 * Gets all variations for a campaign
 * @param campaignId - The campaign ID
 * @returns Array of variations with variationGroupId and variationGroupName
 */
export function useCampaignVariations(campaignId: string) {
  const campaign = useCampaign(campaignId);

  return useMemo(() => {
    if (!campaign) {
      return [];
    }
    const variations: FsVariation[] = [];
    campaign.variationGroups.forEach((variationGroup) => {
      variations.push(
        ...variationGroup.variations.map((variation) => ({
          ...variation,
          variationGroupId: variationGroup.id,
          variationGroupName: variationGroup.name,
        }))
      );
    });
    return variations;
  }, [campaign]);
}

/**
 * Gets a specific variation by ID for a campaign
 * @param campaignId - The campaign ID
 * @param variationId - The variation ID to find
 * @returns Variation if found, undefined otherwise
 */
export function useVariation(
  campaignId: string,
  variationId: string
): FsVariation | undefined {
  const variations = useCampaignVariations(campaignId);

  return useMemo(() => {
    return variations.find((variation) => variation.id === variationId);
  }, [variations, variationId]);
}

/**
 * Gets the active (default selected) variation ID for a campaign
 * Priority: forcedVariation > allocatedVariation > forcedAllocation > forcedUnallocation
 * @param campaignId - The campaign ID
 * @returns The active variation ID or undefined
 */
export function useActiveVariationId(campaignId: string): string | undefined {
  const {
    allocatedVariation,
    forcedVariation,
    forcedAllocation,
    forcedUnallocation,
  } = useCampaignVariationStates(campaignId);

  const activeVariationId = useMemo(() => {
    return (
      forcedVariation?.variation?.id ||
      allocatedVariation?.variationId ||
      forcedAllocation?.variation?.id ||
      forcedUnallocation?.variation?.id
    );
  }, [forcedVariation, allocatedVariation, forcedAllocation, forcedUnallocation]);

  return activeVariationId;
}

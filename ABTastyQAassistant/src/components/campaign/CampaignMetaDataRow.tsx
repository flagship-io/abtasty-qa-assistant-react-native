import React from "react";
import { StyleSheet, View, ViewStyle } from "react-native";
import {
  CampaignDisplayStatus,
  FsCampaign,
  FsVariationToForce,
  WebSDKCampaignStatus,
} from "../../types.local";
import { Badge, Button } from "../common";
import { EyeHideIcon } from "../../assets/icons/EyeHideIcon";
import { EyeShowIcon } from "../../assets/icons/EyeShowIcon";
import { ResetIcon } from "../../assets/icons/ResetIcon";
import { useCampaignAllocation, useCampaignUnallocation } from "../../hooks";
import { useCallback, useMemo } from "react";

type Props = {
  campaign: FsCampaign;
  styles?: ViewStyle;
};

interface ActionButtonConfig {
  icon: React.ComponentType<{ width: number; height: number }>;
  label: string;
}

function createVariationToForce(campaign: FsCampaign): FsVariationToForce {
  const firstGroup = campaign.variationGroups[0];
  return {
    campaignId: campaign.id,
    campaignName: campaign.name,
    campaignType: campaign.type,
    CampaignSlug: campaign.slug,
    variationGroupId: firstGroup.id,
    variationGroupName: firstGroup.name,
    variation: firstGroup.variations[0],
  };
}

function getButtonConfig(
  displayStatus: CampaignDisplayStatus,
): ActionButtonConfig {
  switch (displayStatus) {
    case CampaignDisplayStatus.HIDDEN:
      return { icon: EyeShowIcon, label: "Force display" };
    case CampaignDisplayStatus.RESET:
      return { icon: ResetIcon, label: "Initial state" };
    case CampaignDisplayStatus.SHOWN:
    default:
      return { icon: EyeHideIcon, label: "Hide" };
  }
}

export function CampaignMetaDataRow({ campaign, styles }: Props) {
  const { applyAllocation, unsetAllocation } = useCampaignAllocation();
  const { applyUnallocation, unsetUnallocation } = useCampaignUnallocation();

  const buttonConfig = useMemo(
    () => getButtonConfig(campaign.displayStatus),
    [campaign.displayStatus],
  );

  const handlePress = useCallback(() => {
    const { displayStatus, status, id } = campaign;

    switch (displayStatus) {
      case CampaignDisplayStatus.HIDDEN: {
        const variationToForce = createVariationToForce(campaign);
        applyAllocation({ [id]: variationToForce });
        break;
      }
      case CampaignDisplayStatus.RESET: {
        if (status === WebSDKCampaignStatus.ACCEPTED) {
          unsetUnallocation(id);
        } else {
          unsetAllocation(id);
        }
        break;
      }
      case CampaignDisplayStatus.SHOWN: {
        const variationToForce = createVariationToForce(campaign);
        applyUnallocation({ [id]: variationToForce });
        break;
      }
    }
  }, [
    campaign,
    applyAllocation,
    unsetAllocation,
    applyUnallocation,
    unsetUnallocation,
  ]);

  const hiddenLabel = useMemo(
    () => ({
      targetingLabel: "Targeting Rejected",
      allocationLabel: "Allocation Rejected",
    }),
    [campaign.hasTargetingMatched],
  );

  return (
    <View style={[localStyles.container, styles]}>
      <Badge
        displayStatus={campaign.displayStatus}
        status={campaign.status}
        hasTargetingMatched={campaign.hasTargetingMatched}
        hidden={hiddenLabel}
      />
      <Button
        borderWidth={1}
        label={buttonConfig.label}
        onPress={handlePress}
        leftIcon={<buttonConfig.icon width={15} height={15} />}
      />
    </View>
  );
}

const localStyles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: 8,
  },
});

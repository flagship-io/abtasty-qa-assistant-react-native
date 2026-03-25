import React from "react";
import { View, StyleSheet } from "react-native";
import {
  CampaignDisplayStatus,
  CampaignType,
  FsCampaign,
} from "../types.local";
import { useRoute } from "@react-navigation/native";
import { COLORS } from "../constants";
import { AllocationVariationGr } from "../components/allocation";
import { useCampaign } from "../hooks";
import { useMemo } from "react";
import { Alert } from "../components/common";

export type AllocationScreenProps = {
  campaignId: string;
};

function getAlertMessage(
  hasMatched: boolean,
  displayStatus: CampaignDisplayStatus,
): string | null {
  if (
    displayStatus === CampaignDisplayStatus.SHOWN 
  ) {
    return null;
  }

  if (hasMatched && displayStatus === CampaignDisplayStatus.HIDDEN) {
    return "You are part of the untracked traffic for this campaign.";
  }

  if (displayStatus === CampaignDisplayStatus.RESET) {
    return "Allocation has been bypassed.";
  }

  return "You are not part of the allocated traffic for this campaign.";
}

export function AllocationScreen() {
  const route = useRoute();
  const { campaignId } = route.params as AllocationScreenProps;
  const campaign = useCampaign(campaignId) as FsCampaign;
  const variationGroups = campaign.variationGroups;
  const displayStatus = campaign.displayStatus;
  const hasTargetingMatched = campaign.hasTargetingMatched;
  const isUntracked = campaign.isUntracked;
  const isPersonalCampaign = campaign.type === CampaignType.perso;

  const alertMessage = useMemo(
    () => getAlertMessage(hasTargetingMatched ?? false, displayStatus),
    [hasTargetingMatched, displayStatus],
  );

  return (
    <View style={localStyles.container}>
      {variationGroups.map((vg) => (
        <AllocationVariationGr
          key={vg.id}
          variationGroup={vg}
          displayStatus={displayStatus}
          isUntracked={isUntracked}
          isPersonalCampaign={isPersonalCampaign}
          campaignStatus={campaign.status}
        />
      ))}
      {alertMessage && <Alert message={alertMessage} />}
    </View>
  );
}

const localStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: 15,
  },
});

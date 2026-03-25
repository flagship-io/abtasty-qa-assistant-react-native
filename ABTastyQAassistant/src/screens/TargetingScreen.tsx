import React from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { CampaignDisplayStatus, FsCampaign } from "../types.local";
import { useRoute } from "@react-navigation/native";
import { COLORS } from "../constants";
import { TargetingVariationGr } from "../components/targeting";
import { Alert } from "../components/common";
import { useCampaign } from "../hooks";
import { useMemo } from "react";

export type TargetingScreenProps = {
  campaignId: string;
};

function getAlertMessage(
  hasMatched: boolean,
  displayStatus: CampaignDisplayStatus,
): string | null {
  if (
    displayStatus === CampaignDisplayStatus.SHOWN ||
    (hasMatched && displayStatus === CampaignDisplayStatus.RESET)
  ) {
    return null;
  }

  if (hasMatched && displayStatus === CampaignDisplayStatus.HIDDEN) {
    return "Targeting matched but the campaign is untracked";
  }

  if (displayStatus === CampaignDisplayStatus.RESET) {
    return "Targeting has been bypassed.";
  }

  return "Targeting does not match your current values:";
}

export function TargetingScreen() {
  const route = useRoute();
  const { campaignId } = route.params as TargetingScreenProps;

  const campaign = useCampaign(campaignId) as FsCampaign;
  const variationGroups = campaign.variationGroups;
  const hasTargetingMatched = campaign.hasTargetingMatched;
  const displayStatus = campaign.displayStatus;
  const isUntracked = campaign.isUntracked;

  const alertMessage = useMemo(
    () => getAlertMessage(hasTargetingMatched ?? false, displayStatus),
    [hasTargetingMatched, displayStatus],
  );

  return (
    <ScrollView style={localStyles.container}>
      {alertMessage && <Alert message={alertMessage} />}
      <View>
        <View>
          {variationGroups.map((group, index) => (
            <TargetingVariationGr
              key={index}
              variationGroup={group}
              hasTargetingMatched={hasTargetingMatched}
              displayStatus={displayStatus}
              showGroupNames={variationGroups.length > 1}
              isUntracked={isUntracked}
              campaignStatus={campaign.status}
            />
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const localStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: 15,
  },

  alertContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderRadius: 4,
    backgroundColor: COLORS.warning,
    marginBottom: 15,
    gap: 5,
  },
});

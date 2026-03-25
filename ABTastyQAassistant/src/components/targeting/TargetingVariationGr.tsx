import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { CampaignDisplayStatus, VariationGroupDTO, WebSDKCampaignStatus } from "../../types.local";
import { TargetingGroupItem } from "./TargetingGroupItem";

type Props = {
  variationGroup: VariationGroupDTO;
  hasTargetingMatched?: boolean;
  displayStatus: CampaignDisplayStatus;
  showGroupNames?: boolean;
  isUntracked?: boolean;
  campaignStatus: WebSDKCampaignStatus;
};

export function TargetingVariationGr({
  variationGroup,
  hasTargetingMatched,
  displayStatus,
  showGroupNames,
  isUntracked,
  campaignStatus
}: Props) {
  return (
    <View>
      {showGroupNames && (
        <Text style={localStyles.groupName}>{variationGroup.name}</Text>
      )}
      {variationGroup.targeting.targetingGroups.map((group, index) => (
        <TargetingGroupItem
          style={localStyles.targetingGroupItem}
          key={index}
          targetingGroup={group}
          hasTargetingMatched={hasTargetingMatched}
          displayStatus={displayStatus}
          isLast={index === variationGroup.targeting.targetingGroups.length - 1}
          isUntracked={isUntracked}
          campaignStatus={campaignStatus}
        />
      ))}
    </View>
  );
}

const localStyles = StyleSheet.create({
  groupName: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 10,
  },
  targetingGroupItem: {
    marginBottom: 15,
  },
});

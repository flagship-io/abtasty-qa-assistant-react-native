import React from "react";
import { StyleSheet, Text, View } from "react-native";
import {
  CampaignDisplayStatus,
  VariationGroupDTO,
  WebSDKCampaignStatus,
} from "../../types.local";
import { AllocationItem } from "./AllocationItem";
import { COLORS } from "../../constants";
import { useMemo } from "react";
import { useAllocationBackground } from "../../hooks/useBackground";

type Props = {
  variationGroup: VariationGroupDTO;
  displayStatus: CampaignDisplayStatus;
  isUntracked?: boolean;
  isPersonalCampaign?: boolean;
  campaignStatus: WebSDKCampaignStatus;
};

export function AllocationVariationGr({
  variationGroup,
  displayStatus,
  isPersonalCampaign,
  campaignStatus,
}: Props) {
  const allMatched = useMemo(() => {
    return variationGroup.targeting.targetingGroups.some((tg) => tg.allMatched);
  }, [variationGroup]);

  const { backgroundColor, borderColor, iconColor, Icon } =
    useAllocationBackground(displayStatus, allMatched, campaignStatus);

  const targetingContainer = useMemo(
    () => ({
      backgroundColor: backgroundColor,
      borderColor: borderColor,
      borderWidth: 1,
    }),
    [backgroundColor, borderColor]
  );
  return (
    <View style={localStyles.container}>
      {isPersonalCampaign && (
        <Text style={localStyles.groupName}>{variationGroup.name}</Text>
      )}
      <View style={localStyles.section}>
        <View>
          <Icon color={iconColor} />
        </View>
        <View style={[targetingContainer, localStyles.targetingContainer]}>
          {variationGroup.variations.map((variation) => (
            <AllocationItem
              key={variation.id}
              variationName={variation.name}
              allocation={variation.allocation}
            />
          ))}
        </View>
      </View>
    </View>
  );
}

const localStyles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.background,

    marginBottom: 15,
  },
  section: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  targetingContainer: {
    flex: 15,
    borderRadius: 4,
    padding: 10,
  },
  groupName: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 10,
  },
});

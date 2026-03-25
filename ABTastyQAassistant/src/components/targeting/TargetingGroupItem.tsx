import React from "react";
import { StyleSheet, Text, View, ViewStyle } from "react-native";
import { CampaignDisplayStatus, TargetingGroups, WebSDKCampaignStatus } from "../../types.local";
import { TargetingItem } from "./TargetingItem";
import { COLORS } from "../../constants";
import { useMemo } from "react";
import { useTargetingBackground } from "../../hooks/useBackground";

type Props = {
  targetingGroup: TargetingGroups;
  hasTargetingMatched?: boolean;
  displayStatus: CampaignDisplayStatus;
  campaignStatus: WebSDKCampaignStatus;
  isLast?: boolean;
  style?: ViewStyle;
  isUntracked?: boolean
};


export function TargetingGroupItem({
  targetingGroup,
  campaignStatus,
  displayStatus,
  isLast,
  style,
  isUntracked
}: Props) {
  const { backgroundColor, borderColor, iconColor, Icon } = useTargetingBackground(
    displayStatus,
    isUntracked,
    targetingGroup.allMatched,
    campaignStatus
  );
  
  const targetingContainer = useMemo(
    () => ({
      backgroundColor: backgroundColor,
      borderColor: borderColor,
      borderWidth: 1,
    }),
    [backgroundColor, borderColor]
  );


  return (
    <View style={style}>
      <View style={localStyles.content}>
        <View style={localStyles.iconContainer}>
          <Icon color={iconColor} />
        </View>

        <View style={[localStyles.targetingContainer, targetingContainer]}>
          {targetingGroup.targetings.map((targeting, index) => (
            <TargetingItem
              key={index}
              targetings={targeting}
              isLast={index === targetingGroup.targetings.length - 1}
            />
          ))}
        </View>
      </View>
      {!isLast && <Text style={localStyles.orText}>OR</Text>}
    </View>
  );
}

const localStyles = StyleSheet.create({
  content: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  iconContainer: {
    flex: 1,
  },
  targetingContainer: {
    flex: 15,
    borderRadius: 4,
    padding: 10,
  },
  orText: {
    fontWeight: "600",
    backgroundColor: COLORS.greyLight,
    borderColor: COLORS.border,
    borderWidth: 1,
    padding: 8,
    borderRadius: 4,
    alignSelf: "flex-start",
    marginTop: 10,
    marginLeft: "8%",
  },
});

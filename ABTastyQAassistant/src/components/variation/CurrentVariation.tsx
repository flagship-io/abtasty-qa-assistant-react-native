import React from "react";
import { StyleSheet, Text, View, ViewStyle } from "react-native";
import {
  CampaignDisplayStatus,
  FsVariation,
  WebSDKCampaignStatus,
} from "../../types.local";
import { COLORS } from "../../constants";

type Props = {
  variation?: FsVariation | undefined;
  styles?: ViewStyle;
  shouldCombineGrpName?: boolean;
  displayStatus: CampaignDisplayStatus;
  campaignStatus: WebSDKCampaignStatus;
};

export function CurrentVariation({
  variation,
  styles,
  shouldCombineGrpName,
  displayStatus,
  campaignStatus,
}: Props) {
  if (
    displayStatus === CampaignDisplayStatus.HIDDEN ||
    !variation ||
    (displayStatus === CampaignDisplayStatus.RESET &&
      campaignStatus === WebSDKCampaignStatus.ACCEPTED)
  ) {
    return null;
  }

  return (
    <View style={[localStyles.container, styles]}>
      <Text>
        ✅ Your are viewing:{" "}
        {shouldCombineGrpName
          ? `${variation.variationGroupName} - ${variation.name}`
          : variation.name}
      </Text>
    </View>
  );
}

const localStyles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.success,
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
  },
});

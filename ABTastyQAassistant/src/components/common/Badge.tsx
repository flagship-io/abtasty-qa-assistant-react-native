import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { COLORS } from "../../constants";
import {
  CampaignDisplayStatus,
  WebSDKCampaignStatus,
} from "../../types.local";

type Props = {
  displayStatus: CampaignDisplayStatus;
  status: WebSDKCampaignStatus;
  hasTargetingMatched?: boolean;
  hidden?: {
    targetingLabel?: string;
    allocationLabel?: string;
  };
};

function useBackground({
  displayStatus,
  status,
  hasTargetingMatched,
  hidden,
}: Props) {
  switch (displayStatus) {
    case "SHOWN":
      return {
        background: styles.backgroundShown,
        textStyle: styles.textShown,
        label: "Accepted",
      };
    case "HIDDEN": {
      return {
        background: styles.backgroundHidden,
        textStyle: styles.textHidden,
        label: hasTargetingMatched
          ? hidden?.allocationLabel || "Allocation Rejected"
          : hidden?.targetingLabel || "Targeting Rejected",
      };
    }
    case "RESET":
      return {
        background: styles.backgroundReset,
        textStyle: styles.textReset,
        label: status === WebSDKCampaignStatus.ACCEPTED ? "Hidden" : "Forced",
      };
    default:
      return {
        background: styles.backgroundHidden,
        textStyle: styles.textHidden,
        label: "Rejected",
      };
  }
}

export function Badge(pros: Props) {
  const { background, textStyle, label } = useBackground(pros);
  return (
    <View style={[styles.container, background]}>
      <Text style={textStyle}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  backgroundShown: {
    backgroundColor: COLORS.success,
  },
  backgroundHidden: {
    backgroundColor: COLORS.danger,
  },
  backgroundReset: {
    backgroundColor: COLORS.warning,
  },
  textShown: {
    fontSize: 13,
    fontWeight: "600",
    color: COLORS.textSuccess,
  },
  textHidden: {
    fontSize: 13,
    fontWeight: "600",
    color: COLORS.textDanger,
  },
  textReset: {
    fontSize: 13,
    fontWeight: "600",
    color: COLORS.textWarning,
  },
});

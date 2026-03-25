import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { COLORS } from "../../constants";
import { useResetAllCampaignsAction } from "../../hooks/useCampaignActions";
import { ResetIcon } from "../../assets/icons/ResetIcon";

type SummaryBarProps = {
  totalCampaigns: number;
};

export function SummaryBar({ totalCampaigns }: SummaryBarProps) {
  const { reinitializeAllCampaigns } = useResetAllCampaignsAction();
  return (
    <View style={styles.summaryBar}>
      <Text style={styles.summaryText}>
        {totalCampaigns} live campaign{totalCampaigns !== 1 ? "s" : ""}
      </Text>
      <TouchableOpacity
        onPress={reinitializeAllCampaigns}
        style={styles.resetButton}
      >
        <ResetIcon width={15} height={15}/>
        <Text style={styles.resetText}>Reset all</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  summaryBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    borderBottomColor: COLORS.separator,
    borderBottomWidth: 1,
  },
  summaryText: {
    fontSize: 16,
    color: "#111827",
  },
  resetButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  resetIcon: {
    fontSize: 18,
    color: "#111827",
  },
  resetText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#111827",
  },
});

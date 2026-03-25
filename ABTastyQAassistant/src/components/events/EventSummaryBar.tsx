import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { COLORS } from "../../constants";
import { DeleteIcon } from "../../assets/icons/DeleteIcon";

type SummaryBarProps = {
  totalEvents: number;
  clearHits: () => void;
};

export function EventSummaryBar({ totalEvents, clearHits }: SummaryBarProps) {
  const isDisabled = totalEvents === 0;
  const textColor = isDisabled ? COLORS.textGray : COLORS.dangerDark;
  return (
    <View style={styles.summaryBar}>
      <Text style={styles.summaryText}>
        {totalEvents} event{totalEvents !== 1 ? "s" : ""} recorded
      </Text>
      <TouchableOpacity
        onPress={clearHits}
        style={styles.resetButton}
        disabled={totalEvents === 0}
      >
        <DeleteIcon width={15} height={15} color={textColor} />
        <Text style={[styles.resetText, { color: textColor }]}>Clear all</Text>
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
  },
  resetText: {
    fontSize: 14,
    fontWeight: "500",
  },
});

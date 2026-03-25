import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { COLORS } from "../../constants";

type Props = {
  variationName?: string;
  allocation?: number;
};

export function AllocationItem({ variationName, allocation }: Props) {
  return (
    <View style={localStyles.container}>
      <Text style={localStyles.variationNameText}>{variationName}:</Text>
      <Text style={localStyles.allocationText}>{allocation ?? 0}%</Text>
    </View>
  );
}

const localStyles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 10,
  },
  variationNameText: {
    fontWeight: "bold",
  },
  allocationText: {
    fontWeight: "600",
    backgroundColor: COLORS.blueLight,
    borderRadius: 15,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
});

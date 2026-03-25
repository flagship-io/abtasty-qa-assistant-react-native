import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { COLORS } from "../../constants";
import { EmptyStateIcon } from "../../assets/icons/EmptyStateIcon";

export function EmptyList() {
  return (
    <View style={localStyles.container}>
      <View style={localStyles.image}>
        <EmptyStateIcon width={120} height={120} />
      </View>
      <Text style={localStyles.text1}>No event has been recorded so far</Text>
      <Text style={localStyles.text2}>
        Interact with the page to see events here.
      </Text>
    </View>
  );
}

const localStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    paddingTop: 40,
  },
  image: {
    backgroundColor: "#E5E7EB",
    width: 120,
    height: 120,
    marginBottom: 16,
  },
  text1: {
    fontSize: 18,
    marginBottom: 8,
    color: COLORS.textSecondary,
    fontWeight: "700",
  },
  text2: {
    fontSize: 14,
    color: COLORS.textPrimary,
  },
});

import React from "react";
import { StyleSheet, Text, View, ViewStyle } from "react-native";
import { FsVariation } from "../../types.local";
import { COLORS } from "../../constants";

type Props = {
  modifications?: FsVariation["modifications"]["value"];
  styles?: ViewStyle;
};

const formatValue = (value: unknown): string => {
  if (value === null) return "null";
  if (value === undefined) return "undefined";
  if (typeof value === "boolean") return value ? "true" : "false";
  if (typeof value === "string") return value;
  if (typeof value === "number") return String(value);
  if (Array.isArray(value)) return JSON.stringify(value, null, 0);
  if (typeof value === "object") return JSON.stringify(value, null, 2);
  return String(value);
};

export function FlagValue({ modifications }: Props) {
  if (
    typeof modifications !== "object" ||
    modifications === null ||
    Array.isArray(modifications)
  ) {
    return null;
  }
  
  const entries = Object.entries(modifications);
  return (
    <View style={localStyles.container}>
      {entries.map(([key, value]) => (
        <View key={key} style={localStyles.content}>
          <Text style={localStyles.keyText}> {key}</Text>
          <Text style={localStyles.operatorText}>IS</Text>
          <Text style={localStyles.valueText}>{formatValue(value)}</Text>
        </View>
      ))}
    </View>
  );
}

const localStyles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: COLORS.backgroundSecondary,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    gap: 10,
    marginBottom: 8,
  },
  keyText: {
    fontWeight: "600",
    color: COLORS.textSecondary,
  },
  operatorText: {
    fontWeight: "600",
    backgroundColor: COLORS.background,
    borderColor: COLORS.border,
    borderWidth: 1,
    borderRadius: 15,
    paddingHorizontal: 10,
    paddingVertical: 2,

    marginHorizontal: 5,
  },
  valueText: {
    fontWeight: "600",
    backgroundColor: COLORS.blueLight,
    borderRadius: 15,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
});

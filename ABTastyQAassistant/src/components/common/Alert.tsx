import React, { memo, useMemo } from "react";
import { View, Text, StyleSheet, ViewStyle, TextStyle } from "react-native";
import { WarningIcon } from "../../assets/icons/WarningIcon";
import { COLORS } from "../../constants";

export interface AlertProps {
  message: string;
  type?: "warning" | "error" | "info" | "success";
  icon?: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
  iconSize?: number;
}

export const Alert = memo<AlertProps>(
  ({ message, type = "warning", icon, style, textStyle, iconSize = 15 }) => {
    const backgroundColor = useMemo(() => {
      switch (type) {
        case "error":
          return COLORS.danger || "#ffebee";
        case "info":
          return COLORS.blueLight || "#e3f2fd";
        case "success":
          return COLORS.success || "#e8f5e9";
        case "warning":
        default:
          return COLORS.warning || "#fff3e0";
      }
    }, [type]);

    const defaultIcon = useMemo(() => {
      if (icon !== undefined) return icon;
      return <WarningIcon width={iconSize} height={iconSize} />;
    }, [icon, iconSize]);

    return (
      <View style={[localStyles.container, { backgroundColor }, style]}>
        {defaultIcon}
        <Text style={[localStyles.text, textStyle]}>{message}</Text>
      </View>
    );
  },
);

Alert.displayName = "Alert";

const localStyles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderRadius: 4,
    marginBottom: 15,
    gap: 5,
  },
  text: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
  },
});

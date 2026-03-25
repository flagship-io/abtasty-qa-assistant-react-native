import React from "react";
import { StyleSheet, Text, TouchableOpacity, ViewStyle } from "react-native";
import { COLORS } from "../../constants";

type ButtonProps = {
  onPress?: () => void;
  backgroundColor?: string;
  borderRadius?: number;
  borderColor?: string;
  borderWidth?: number;
  textColor?: string;
  style?: ViewStyle;
  children?: React.ReactNode;
  label?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
};

export function Button({
  onPress,
  backgroundColor,
  borderColor,
  borderRadius,
  borderWidth,
  textColor,
  style,
  label,
  leftIcon,
  rightIcon,
}: ButtonProps) {
  const containerStyle = {
    backgroundColor: backgroundColor || COLORS.background,
    borderRadius: borderRadius || 4,
    borderColor: borderColor || COLORS.border,
    borderWidth: borderWidth || 1,
  };
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[containerStyle, style, styles.container]}
    >
      {leftIcon}
      <Text
        style={[{ color: textColor || COLORS.textSecondary }, styles.label]}
      >
        {label}
      </Text>
      {rightIcon}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 8,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    gap: 8,
  },
  label: {
    fontSize: 12,
    fontWeight: "700",
  },
});

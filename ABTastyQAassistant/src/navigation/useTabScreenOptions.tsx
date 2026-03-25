import { MaterialTopTabNavigationOptions } from "@react-navigation/material-top-tabs";
import { COLORS } from "../constants";

export function useTabScreenOptions(
  options?: MaterialTopTabNavigationOptions
): MaterialTopTabNavigationOptions {
  return {
    tabBarStyle: {
      backgroundColor: COLORS.modalBackground,
    },
    tabBarScrollEnabled: true,
    tabBarGap: 8,
    tabBarActiveTintColor: COLORS.secondary,
    tabBarInactiveTintColor: COLORS.textPrimary,
    tabBarIndicatorStyle: {
      backgroundColor: COLORS.secondary,
      height: 4,
    },
    tabBarLabelStyle: {
      fontSize: 14,
      fontWeight: "600",
      textTransform: "none",
    },
    tabBarItemStyle: {
      width: "auto",
    },
    ...options,
  };
}

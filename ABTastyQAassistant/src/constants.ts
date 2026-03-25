/**
 * Constants for the QA Assistant
 */


export const DEFAULT_CONFIG = {
  position: "bottom-right" as const,
  floatingButton: true,
};

export const COLORS = {
  primary: "#3B82F6",
  secondary: "#3100BF",
  success: "#C7F4EE",
  successDark: "#00806C",
  warning: "#FFECBD",
  warningDark: "#A16C0C",
  danger: "#FED1CD",
  dangerDark: "#B02F25",
  background: "#FCFCFD",
  backgroundSecondary: "#F3F3F7",
  backgroundSuccessLight: "#F0FFFD",
  backgroundWarningLight: "#FFFAF0",
  backgroundDangerLight: "#FFF0F0",
  backgroundDark: "#1F2937",
  border: "#D8D8E2",
  textPrimary: "#5E5E6E", 
  textSecondary: "#2A2A3C",
  textSuccess: "#00332B",
  textWarning: "#4D3700",
  textDanger: "#310502",
  textGray: "#AFAFBC",
  text: "#2A2A3C",
  textLight: "#6B7280",
  separator: "#D8D8E2",
  modalBackground: "#E2DCF4",
  greyLight: "#EDEDF2",

  blueLight: "#DBE5FF",
  
};

export const SIZE = {
  iconSmall: 24,
  iconMedium: 32,
  iconLarge: 40,
  floatingButton: 56,
};

export const CAMPAIGN_TYPE_LABELS = {
  ab: "A/B Test",
  toggle: "Feature Toggle",
  feature: "Feature Flag",
};

export const BUCKETING_API_URL =
  "https://cdn.flagship.io/{{envId}}/bucketing.json";

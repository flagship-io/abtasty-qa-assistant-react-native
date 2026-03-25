import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { COLORS } from "../constants";
import { CollapsibleCampaigns } from "../components/campaign";
import { CampaignDisplayStatus, WebSDKCampaignStatus } from "../types.local";
import { SummaryBar } from "../components/layout";
import { useSDKSync } from "../hooks/useSDKIntegration";
import { useAppContext } from "../hooks";

export function CampaignsPage() {
  useSDKSync();

  const { appDataState } = useAppContext();

  const acceptedCampaigns = appDataState.displayedAcceptedCampaigns || [];
  const rejectedCampaigns = appDataState.displayedRejectedCampaigns || [];
  const totalCampaigns = acceptedCampaigns.length + rejectedCampaigns.length;

  return (
    <View style={styles.container}>
      {/* Campaign Summary Bar */}
      <SummaryBar totalCampaigns={totalCampaigns} />

      <ScrollView style={styles.scrollView}>
        {/* Accepted Section */}
        <CollapsibleCampaigns
          campaigns={acceptedCampaigns}
          badgeDisplayStatus={CampaignDisplayStatus.SHOWN}
          badgeStatus={WebSDKCampaignStatus.ACCEPTED}
          defaultExpanded={true}
        />

        {/* Rejected Section */}
        <CollapsibleCampaigns
          campaigns={rejectedCampaigns}
          badgeDisplayStatus={CampaignDisplayStatus.HIDDEN}
          badgeStatus={WebSDKCampaignStatus.REJECTED}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollView: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  section: {
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 12,
    borderBottomColor: COLORS.separator,
    borderBottomWidth: 1,
  },
  sectionHeaderIcon: {
    fontSize: 12,
    color: "#6B7280",
    width: 16,
  },
  acceptedBadge: {
    backgroundColor: "#A7F3D0",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  acceptedBadgeText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#065F46",
  },
  rejectedBadge: {
    backgroundColor: "#FECACA",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  rejectedBadgeText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#991B1B",
  },
  sectionCount: {
    fontSize: 14,
    color: "#6B7280",
  },
  campaignItemContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
  },
  campaignRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  campaignInfo: {
    flex: 1,
    gap: 4,
  },
  campaignName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },
  campaignType: {
    fontSize: 14,
    color: "#6B7280",
  },
  campaignActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  statusBadgeAccepted: {
    backgroundColor: "#A7F3D0",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusBadgeTextAccepted: {
    fontSize: 13,
    fontWeight: "600",
    color: "#065F46",
  },
  statusBadgeRejected: {
    backgroundColor: "#FECACA",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusBadgeTextRejected: {
    fontSize: 13,
    fontWeight: "600",
    color: "#991B1B",
  },
  chevron: {
    fontSize: 24,
    color: "#9CA3AF",
    fontWeight: "300",
  },
  centerContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
    backgroundColor: "#FFFFFF",
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
  },
});

import React, { useMemo, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { COLORS } from "../../constants";
import {
  CampaignDisplayStatus,
  FsCampaign,
  WebSDKCampaignStatus,
} from "../../types.local";
import { CampaignItem } from "./CampaignItem";
import { Badge } from "../common";
import { ChevronDownIcon } from "../../assets/icons/ChevronDownIcon";
import { ChevronUpIcon } from "../../assets/icons/ChevronUpIcon";

type Props = {
  campaigns: FsCampaign[];
  badgeDisplayStatus: CampaignDisplayStatus;
  badgeStatus: WebSDKCampaignStatus;
  defaultExpanded?: boolean;
};

export function CollapsibleCampaigns({
  campaigns,
  badgeDisplayStatus,
  badgeStatus,
  defaultExpanded,
}: Props) {
  const [expanded, setExpanded] = useState(defaultExpanded ?? false);

  const ExpandIcon = expanded ? ChevronUpIcon : ChevronDownIcon;

  const hiddenLabel = useMemo(
    () => ({
      targetingLabel: "Rejected",
      allocationLabel: "Rejected",
    }),
    [],
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.headerContainer}
        onPress={() => setExpanded(!expanded)}
      >
        <ExpandIcon style={styles.sectionHeaderIcon} />

        <Badge
          displayStatus={badgeDisplayStatus}
          status={badgeStatus}
          hidden={hiddenLabel}
        />

        <Text style={styles.campaignCountText}>
          {campaigns.length} campaign
          {campaigns.length !== 1 ? "s" : ""}
        </Text>
      </TouchableOpacity>

      {expanded && (
        <View>
          {campaigns.map((campaign) => (
            <CampaignItem key={campaign.id} campaign={campaign} />
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  headerContainer: {
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
  campaignCountText: {
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

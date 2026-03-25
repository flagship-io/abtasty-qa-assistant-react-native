import React, { useMemo } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { CampaignType, FsCampaign, RootStackParamList } from "../../types.local";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
import { Badge } from "../common";
import { ChevronRightIcon } from "../../assets/icons/ChevronRightIcon";
interface Props {
  campaign: FsCampaign;
}

function useCampaignTypeName(type: CampaignType) {
  switch (type) {
    case CampaignType.ab:
      return "A/B Test";
    case CampaignType.toggle:
      return "Feature toggle";
    case CampaignType.perso:
      return "Personalization";
    case CampaignType.deployment:
      return "Rollout";
    default:
      return "Campaign";
  }
}

export const CampaignItem: React.FC<Props> = ({ campaign }) => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const campaignTypeName = useCampaignTypeName(campaign.type);
  const hiddenLabel = useMemo(
    () => ({
      targetingLabel: "Rejected",
      allocationLabel: "Rejected",
    }),
    [],
  );
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() =>
        navigation.navigate("CampaignDetails", {
          campaignId: campaign.id,
        })
      }
    >
      <View style={styles.campaignRow}>
        <View style={styles.campaignInfo}>
          <Text style={styles.campaignName} numberOfLines={1}>
            {campaign.name}
          </Text>
          <Text style={styles.campaignType}>{campaignTypeName}</Text>
        </View>
        <View style={styles.campaignActions}>
          <Badge
            displayStatus={campaign.displayStatus}
            status={campaign.status}
            hasTargetingMatched={campaign.hasTargetingMatched}
            hidden={hiddenLabel}
          />
          <ChevronRightIcon />
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
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

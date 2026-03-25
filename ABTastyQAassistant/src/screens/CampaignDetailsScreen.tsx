import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { COLORS } from "../constants";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import {
  useActiveVariationId,
  useCampaign,
  useVariation,
} from "../hooks";
import { useRoute } from "@react-navigation/native";
import { CampaignType, FsCampaign, RootStackParamList } from "../types.local";
import { CampaignMetaDataRow } from "../components/campaign";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { useTabScreenOptions } from "../navigation/useTabScreenOptions";
import { VariationScreen, VariationScreenProps } from "./VariationsScreen";
import { TargetingScreen, TargetingScreenProps } from "./TargetingScreen";
import { AllocationScreen, AllocationScreenProps } from "./AllocationScreen";
import { CurrentVariation } from "../components/variation";
import {
  useSDKSync,
} from "../hooks/useSDKIntegration";

type TabParamList = {
  Variations: VariationScreenProps;
  Targeting: TargetingScreenProps;
  Allocation: AllocationScreenProps;
};

const Tab = createMaterialTopTabNavigator<TabParamList>();

interface CampaignDetailsContentProps {
  campaign: FsCampaign;
}

function CampaignDetailsContent({ campaign }: CampaignDetailsContentProps) {
  useSDKSync();

  const activeVariationId = useActiveVariationId(campaign.id);
  const currentVariation = useVariation(campaign.id, activeVariationId || "");

  const screenOptions = useTabScreenOptions({
    tabBarStyle: {
      backgroundColor: COLORS.background,
      borderBottomColor: COLORS.border,
      borderBottomWidth: 1,
    },
  });

  const isPersonalCampaign = campaign.type === CampaignType.perso;
  const isFeatureToggleCampaign = campaign.type === CampaignType.toggle;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{campaign.name}</Text>
        <Text style={styles.subtitle}>Campaign ID: {campaign.id}</Text>
        <CampaignMetaDataRow campaign={campaign} />
      </View>
      <CurrentVariation
        variation={currentVariation}
        shouldCombineGrpName={isPersonalCampaign}
        displayStatus={campaign.displayStatus}
        campaignStatus={campaign.status}
      />
      <View style={styles.tabContainer}>
        <Tab.Navigator screenOptions={screenOptions}>
          <Tab.Screen
            name="Variations"
            component={VariationScreen}
            initialParams={{
              campaignId: campaign.id,
            }}
          />
          <Tab.Screen
            name="Targeting"
            component={TargetingScreen}
            initialParams={{
              campaignId: campaign.id,
            }}
          />
          {!isFeatureToggleCampaign && (
            <Tab.Screen
              name="Allocation"
              component={AllocationScreen}
              initialParams={{
                campaignId: campaign.id,
              }}
            />
          )}
        </Tab.Navigator>
      </View>
    </View>
  );
}

export function CampaignDetailsScreen() {
  const route =
    useRoute<
      NativeStackScreenProps<RootStackParamList, "CampaignDetails">["route"]
    >();
  const campaignId = route.params?.campaignId;
  const campaign = useCampaign(campaignId);

  if (!campaign) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Campaign not found</Text>
      </View>
    );
  }

  return <CampaignDetailsContent campaign={campaign} />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  tabContainer: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: COLORS.textSecondary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 16,
  },
  metaRow: {
    marginBottom: 8,
  },
  errorText: {
    fontSize: 16,
    color: "#EF4444",
    textAlign: "center",
    marginTop: 20,
  },
});

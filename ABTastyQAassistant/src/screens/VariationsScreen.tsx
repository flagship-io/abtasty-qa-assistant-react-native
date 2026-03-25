import React from "react";
import { ScrollView, StyleSheet } from "react-native";
import { CampaignType, FsCampaign } from "../types.local";
import { useRoute } from "@react-navigation/native";
import { COLORS } from "../constants";
import { CollapsibleVariation } from "../components/variation";
import {
  useActiveVariationId,
  useVariation,
  useCampaign,
  useCampaignVariations,
  useCanShowVariationAction,
} from "../hooks";

export type VariationScreenProps = {
  campaignId: string;
};

export function VariationScreen() {
  const route = useRoute();
  const { campaignId } = route.params as VariationScreenProps;

  const campaign = useCampaign(campaignId) as FsCampaign;
  const variations = useCampaignVariations(campaignId);
  const activeVariationId = useActiveVariationId(campaignId);

  const currentVariation = useVariation(
    campaignId,
    activeVariationId || ""
  );

  const isPersonalCampaign = campaign.type === CampaignType.perso;

  const canShowVariationAction = useCanShowVariationAction(
    campaign.status,
    campaign.displayStatus
  );

  return (
    <ScrollView style={localStyles.container}>
      {variations.map((variation) => (
        <CollapsibleVariation
          campaignData={{
            campaignId: campaign.id,
            campaignType: campaign.type,
            campaignName: campaign.name,
          }}
          key={variation.id}
          variation={variation}
          shouldCombineGrpName={isPersonalCampaign}
          defaultExpanded={variation.id === currentVariation?.id}
          isCurrent={variation.id === currentVariation?.id}
          shouldShowVariationAction={canShowVariationAction}
        />
      ))}
    </ScrollView>
  );
}

const localStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
});

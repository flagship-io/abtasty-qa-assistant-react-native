import React, { useCallback, useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import { CampaignType, FsVariation } from "../../types.local";
import { ChevronDownIcon } from "../../assets/icons/ChevronDownIcon";
import { ChevronUpIcon } from "../../assets/icons/ChevronUpIcon";
import { VariationAction } from "./VariationAction";
import { COLORS } from "../../constants";
import { FlagValue } from "../common";
import { useForcedVariationActions } from "../../hooks";

type Props = {
  variation: FsVariation;
  styles?: ViewStyle;
  defaultExpanded?: boolean;
  shouldCombineGrpName?: boolean;
  isCurrent?: boolean;
  shouldShowVariationAction?: boolean;
  campaignData: {
    campaignId: string;
    campaignType: CampaignType;
    campaignName: string;
  };
};

export function CollapsibleVariation({
  variation,
  styles,
  defaultExpanded,
  shouldCombineGrpName,
  isCurrent,
  shouldShowVariationAction,
  campaignData,
}: Props) {
  const [expanded, setExpanded] = useState(defaultExpanded ?? false);

  useEffect(()=>{
    setExpanded(defaultExpanded ?? false);
  }, [defaultExpanded])

  const { applyVariation } = useForcedVariationActions();
  const ExpandIcon = expanded ? ChevronUpIcon : ChevronDownIcon;

  const handleVariationChange = useCallback(() => {
    applyVariation({
      [campaignData.campaignId]: {
        campaignId: campaignData.campaignId,
        campaignName: campaignData.campaignName,
        campaignType: campaignData.campaignType,
        variationGroupName: variation.variationGroupName,
        variationGroupId: variation.variationGroupId as string,
        variation: variation,
      },
    });
  }, [applyVariation, campaignData, variation]);

  return (
    <View style={[localStyles.container, styles]}>
      <TouchableOpacity
        style={localStyles.headerContainer}
        onPress={() => setExpanded(!expanded)}
      >
        <View style={localStyles.expendedSectionHeaderIcon}>
          <ExpandIcon style={localStyles.sectionHeaderIcon} />

          <Text style={localStyles.variationName}>
            {shouldCombineGrpName
              ? `${variation.variationGroupName} - ${variation.name}`
              : variation.name}
          </Text>
        </View>
        {shouldShowVariationAction && (
          <VariationAction
            isCurrent={!!isCurrent}
            onView={handleVariationChange}
            variationId={variation.id}
          />
        )}
      </TouchableOpacity>
      {expanded && <FlagValue modifications={variation.modifications.value} />}
    </View>
  );
}

const localStyles = StyleSheet.create({
  container: {
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  expendedSectionHeaderIcon: {
    flexDirection: "row",
    alignItems: "center",
  },
  sectionHeaderIcon: {
    marginRight: 10,
  },
  variationName: {},
  currentVersion: {
    fontWeight: "bold",
    backgroundColor: COLORS.success,
    color: COLORS.textSuccess,
    padding: 12,
    borderRadius: 20,
  },
});

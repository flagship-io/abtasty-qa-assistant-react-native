import React, { useMemo } from "react";
import { Text, StyleSheet } from "react-native";
import { Button } from "../common";
import { COLORS } from "../../constants";
import { useAllocatedVariations } from "../../hooks";

type Props = {
  isCurrent?: boolean;
  onView?: () => void;
  variationId: string;
};

export function VariationAction({ isCurrent, onView, variationId }: Props) {
  const allocatedVariation = useAllocatedVariations();
  const isAllocated = useMemo(() => {
    return Object.values(allocatedVariation || {}).some(
      (v) => v.variationId === variationId
    );
  }, [allocatedVariation, variationId]);

  if (isCurrent) {
    return <Text style={localStyles.currentVersion}>Your version</Text>;
  }

  const label = isAllocated ? "Reset" : "View";

  return <Button label={label} onPress={onView} />;
}

const localStyles = StyleSheet.create({
  currentVersion: {
    fontWeight: "bold",
    backgroundColor: COLORS.success,
    color: COLORS.textSuccess,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
  },
});

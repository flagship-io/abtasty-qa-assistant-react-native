import React, { useState, useMemo, useCallback } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { ChevronUpIcon } from "../../assets/icons/ChevronUpIcon";
import { ChevronDownIcon } from "../../assets/icons/ChevronDownIcon";
import { COLORS } from "../../constants";
import { HumanizeDuration } from "./HumanizeDuration";
import { formatEventContent } from "../../utils";

type EventCollapseProps = {
  hit: Record<string, unknown>;
};



export function CollapseEvent({ hit }: EventCollapseProps) {
  const [expanded, setExpanded] = useState(false);

  const toggleExpanded = useCallback(() => setExpanded(prev => !prev), []);

  const { eventName, timestamp, displayContent } = useMemo(() => {
    const { t, timestamp: ts, ...rest } = hit;
    return {
      eventName: String(t || "ACTIVATE"),
      timestamp: Number(ts),
      displayContent: formatEventContent(rest),
    };
  }, [hit]);

  const ExpandIcon = expanded ? ChevronUpIcon : ChevronDownIcon;

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.headerContainer}
        onPress={toggleExpanded}
        activeOpacity={0.7}
      >
        <Text style={styles.eventName}>{eventName}</Text>

        <View style={styles.headerRightContainer}>
          <HumanizeDuration timestamp={timestamp} />
          <ExpandIcon style={styles.sectionHeaderIcon} />
        </View>
      </TouchableOpacity>
      {expanded && (
        <View style={styles.contentContainer}>
          <Text style={styles.contentText}>{displayContent}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.separator,
    paddingHorizontal: 20,
    paddingVertical: 14,
    justifyContent: "center",
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerRightContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  sectionHeaderIcon: {
    fontSize: 12,
    width: 16,
  },
  eventName: {
    backgroundColor: COLORS.blueLight,
    padding: 5,
    borderRadius: 20,
    color: COLORS.textSecondary,
    fontWeight: "700",
    paddingHorizontal: 12,
  },
  contentContainer: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: "#F3F3F7",
    marginTop: 15,
  },
  contentText: {
    fontFamily: "monospace",
    fontSize: 12,
    lineHeight: 18,
    color: "#374151",
  },
});

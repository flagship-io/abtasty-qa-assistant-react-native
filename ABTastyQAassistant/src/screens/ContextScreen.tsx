import React, { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useAppContext } from "../hooks";
import { formatEventContent } from "../utils";
import { COLORS } from "../constants";

export function ContextPage() {
  const { appDataState } = useAppContext();
  
  const displayContent = useMemo(() => {
    return formatEventContent(appDataState.visitorData || {});
  }, [appDataState.visitorData]);

  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        <Text style={styles.contentText}>{displayContent}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: 15,
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

import React from "react";
import { StyleSheet, View } from "react-native";
import { EventSummaryBar } from "../components/layout";
import { EmptyList } from "../components/events/EmptyList";
import { COLORS } from "../constants";
import { EventList } from "../components/events/EventList";
import { useHitContext } from "../hooks/useHitContext";

export function EventsPage() {
  const { filteredHits, clearHits, hits } = useHitContext();
  const isEmpty = hits.length === 0;
  return (
    <View style={styles.centerContent}>
      <EventSummaryBar totalEvents={hits.length} clearHits={clearHits} />
      {isEmpty ? <EmptyList /> : <EventList hits={filteredHits} />}
    </View>
  );
}

const styles = StyleSheet.create({
  centerContent: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
});

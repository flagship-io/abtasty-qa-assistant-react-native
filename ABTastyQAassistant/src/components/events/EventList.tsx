import React from "react";
import { FlatList, StyleSheet } from "react-native";
import { CollapseEvent } from "./EventCollapse";

type Props = {
  hits: Record<string, unknown>[];
};

export function EventList({ hits }: Props) {
  return (
    <FlatList
      style={styles.listContainer}
      data={hits}
      keyExtractor={(_, index) => index.toString()}
      renderItem={({ item }) => <CollapseEvent hit={{...item}} />}
    />
  );
}

const styles = StyleSheet.create({
  listContainer: {
    flex: 1,
  },
});

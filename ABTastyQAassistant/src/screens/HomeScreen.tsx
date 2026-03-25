import React, { useCallback, useRef, useState } from "react";
import { View, StyleSheet } from "react-native";
import { CampaignsPage } from "./CampaignsScreen";
import { ContextPage } from "./ContextScreen";
import { EventsPage } from "./EventsScreen";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { SearchBar } from "../components/common";
import { useTabScreenOptions } from "../navigation/useTabScreenOptions";
import { useAppContext } from "../hooks";
import { searchCampaignsActionCreator } from "../reducers/actionsCreator";
import { useHitContext } from "../hooks/useHitContext";

type TabParamList = {
  Campaigns: undefined;
  Events: undefined;
  Context: undefined;
};

const Tab = createMaterialTopTabNavigator<TabParamList>();



export function HomeScreen() {
  const screenOptions = useTabScreenOptions();
  const debouncedRef = useRef<NodeJS.Timeout | null>(null);
  const { dispatchAppData } = useAppContext();
  const { searchEvents } = useHitContext();
  const [activeTab, setActiveTab] = useState<keyof TabParamList>("Campaigns");
  const [searchText, setSearchText] = useState("");

  const handleSearchTextChange = useCallback(
    (text: string) => {
      setSearchText(text);
      
      if (debouncedRef.current) {
        clearTimeout(debouncedRef.current);
      }
      debouncedRef.current = setTimeout(() => {
        // Search based on the active tab
        switch (activeTab) {
          case "Campaigns":
            dispatchAppData(searchCampaignsActionCreator(text));
            break;
          case "Events":
            searchEvents(text);
            break;
        }
      }, 300);
    },
    [dispatchAppData, searchEvents, activeTab],
  );

  return (
    <View style={styles.container}>
      <SearchBar onChangeText={handleSearchTextChange} value={searchText} />
      <View style={styles.tabContainer}>
        <Tab.Navigator 
          screenOptions={screenOptions}
          screenListeners={{
            state: (e) => {
              const state = e.data.state;
              if (state) {
                const routeName = state.routes[state.index].name as keyof TabParamList;
                setActiveTab(routeName);
                setSearchText("");
                dispatchAppData(searchCampaignsActionCreator(""));
                searchEvents("");
              }
            },
          }}
        >
          <Tab.Screen name="Campaigns" component={CampaignsPage} />
          <Tab.Screen name="Events" component={EventsPage} />
          <Tab.Screen name="Context" component={ContextPage} />
        </Tab.Navigator>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabContainer: {
    flex: 1,
  },
});

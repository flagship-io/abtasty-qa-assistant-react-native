import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Switch,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import {
  EventCategory,
  FlagshipProvider,
  HitType,
  useFlagship,
  useFsFlag,
} from "@flagship.io/react-native-sdk";
import { QAAssistant } from "@abtasty/qa-assistant-react-native";
import { SafeAreaView } from "react-native-safe-area-context";

/**
 * Example App Component
 */
function ExampleApp({
  qaEnabled,
  setQaEnabled,
}: {
  qaEnabled: boolean;
  setQaEnabled: (enabled: boolean) => void;
}) {
  const fs = useFlagship();
  const [isChecked, setIsChecked] = useState(false);

  // 7 different flags
  const flag1 = useFsFlag("my_flag_1");
  const flag2A = useFsFlag("my_flag_2_a");
  const flag2B = useFsFlag("my_flag_2_b");
  const flag3 = useFsFlag("my_flag_3");
  const flag4 = useFsFlag("my_flag_4");
  const flag5 = useFsFlag("my_flag_5");
  const flag6 = useFsFlag("my_flag_6");

  const flags = [
    {
      name: "my_flag_1",
      campaignName: flag1.metadata?.campaignName || "N/A",
      value: flag1.getValue("default"),
    },
    {
      name: "my_flag_2_a",
      campaignName: flag2A.metadata?.campaignName || "N/A",
      value: flag2A.getValue(-1),
    },
    {
      name: "my_flag_2_b",
      campaignName: flag2B.metadata?.campaignName || "N/A",
      value: flag2B.getValue("default").toString(),
    },
    {
      name: "my_flag_3",
      campaignName: flag3.metadata?.campaignName || "N/A",
      value: flag3.getValue([]).toString(),
    },
    {
      name: "my_flag_4",
      campaignName:flag4.metadata?.campaignName || "N/A",
      value: JSON.stringify(flag4.getValue({})),
    },
    {
      name: "my_flag_5",
      campaignName: flag5.metadata?.campaignName || "N/A",
      value: flag5.getValue("default").toString(),
    },
    {
      name: "my_flag_6",
      campaignName:  "N/A",
      value: "false",
    },
  ];

  const handleSendEvents = () => {
    // Send different types of events
    fs.sendHits([
      {
        type: HitType.EVENT,
        category: EventCategory.ACTION_TRACKING,
        action: "button_clicked",
        label: "flags_demo_button",
      },
      {
        type: HitType.PAGE,
        documentLocation: "flags-demo-screen",
      },
      {
        type: HitType.SCREEN,
        documentLocation: "flags-demo-screen",
      },
    ]);
  };

  const handleCheckboxChange = (newValue: boolean) => {
    setIsChecked(newValue);

    // Update user context
    fs.updateContext({
      otherKey3: newValue ? "any" : "other",
    });
  };

  const handleRefetchCampaigns = async () => {
    try {
      await fs.fetchFlags();
      console.log("Campaigns refetched successfully");
    } catch (error) {
      console.error("Error refetching campaigns:", error);
    }
  };

  const toggleQaAssistant = () => {
    setQaEnabled(!qaEnabled);
  };

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
      <StatusBar style="dark" />

      {/* Compact Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.headerTitle}>Flagship Demo</Text>
          <Text style={styles.headerSubtitle}>{flags.length} flags active</Text>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={handleRefetchCampaigns}
            activeOpacity={0.7}
          >
            <Text style={styles.iconButtonText}>🔄</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.iconButton,
              qaEnabled ? styles.qaActive : styles.qaInactive,
            ]}
            onPress={toggleQaAssistant}
            activeOpacity={0.7}
          >
            <Text style={styles.iconButtonText}>
              {qaEnabled ? "🔧" : "🔇"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Send Events Button */}
        <TouchableOpacity 
          style={styles.sendButton} 
          onPress={handleSendEvents}
          activeOpacity={0.8}
        >
          <Text style={styles.sendButtonText}>Send Events</Text>
        </TouchableOpacity>

        {/* Premium Mode Switch */}
        <View style={styles.switchContainer}>
          <Text style={styles.switchLabel}>Premium Mode</Text>
          <Switch
            value={isChecked}
            onValueChange={handleCheckboxChange}
            trackColor={{ false: "#D1D5DB", true: "#0066CC" }}
            thumbColor={"#FFFFFF"}
            ios_backgroundColor="#D1D5DB"
          />
        </View>

        {/* Flags Table */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Active Flags</Text>
          <View style={styles.table}>
            {/* Table Header */}
            <View style={styles.tableHeader}>
              <View style={styles.tableHeaderCellLeft}>
                <Text style={styles.tableHeaderText}>Flag & Campaign</Text>
              </View>
              <View style={styles.tableHeaderCellRight}>
                <Text style={styles.tableHeaderText}>Value</Text>
              </View>
            </View>
            
            {/* Table Rows */}
            {flags.map((flag, index) => (
              <View key={flag.name} style={styles.tableRow}>
                <View style={styles.tableCellLeft}>
                  <Text style={styles.flagName}>{flag.name}</Text>
                  <Text style={styles.campaignName}>{flag.campaignName}</Text>
                </View>
                <View style={styles.tableCellRight}>
                  <Text style={styles.flagValue}>{flag.value}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

/**
 * Configuration Component
 */
function ConfigScreen({
  onConfigure,
}: {
  onConfigure: (envId: string, apiKey: string) => void;
}) {
  const [envId, setEnvId] = useState(process.env.EXPO_PUBLIC_FS_ENV_ID || "");
  const [apiKey, setApiKey] = useState(
    process.env.EXPO_PUBLIC_FS_API_KEY || "",
  );

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right', 'bottom']}>
      <StatusBar style="dark" />
      <View style={styles.configContent}>
        <View style={styles.configHeader}>
          <Text style={styles.configIcon}>🚀</Text>
          <Text style={styles.configTitle}>Welcome to Flagship</Text>
          <Text style={styles.configSubtitle}>
            Enter your credentials to get started
          </Text>
        </View>

        <View style={styles.configForm}>
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Environment ID</Text>
            <TextInput
              style={styles.input}
              placeholder="env_xxxxxxxxxx"
              placeholderTextColor="#C7C7CC"
              value={envId}
              onChangeText={setEnvId}
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>API Key</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your API key"
              placeholderTextColor="#C7C7CC"
              value={apiKey}
              onChangeText={setApiKey}
              autoCapitalize="none"
              autoCorrect={false}
              secureTextEntry
            />
          </View>

          <TouchableOpacity
            style={[
              styles.configButton,
              (!envId || !apiKey) && styles.configButtonDisabled,
            ]}
            onPress={() => onConfigure(envId, apiKey)}
            disabled={!envId || !apiKey}
            activeOpacity={0.8}
          >
            <Text style={styles.configButtonText}>Get Started</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.configFooter}>
          <Text style={styles.skipText}>Don&apos;t have credentials?</Text>
          <TouchableOpacity 
            onPress={() => onConfigure("demo-env", "demo-key")}
            activeOpacity={0.7}
          >
            <Text style={styles.skipLink}>Try Demo Mode →</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

/**
 * Root App with Flagship Provider and QA Assistant
 */
export default function App() {
  const [configured, setConfigured] = useState(false);
  const [credentials, setCredentials] = useState({
    envId: process.env.EXPO_PUBLIC_FS_ENV_ID || "",
    apiKey: process.env.EXPO_PUBLIC_FS_API_KEY || "",
  });
  const [qaEnabled, setQaEnabled] = useState(true);

  const handleConfigure = (envId: string, apiKey: string) => {
    setCredentials({ envId, apiKey });
    setConfigured(true);
  };

  if (!configured) {
    return <ConfigScreen onConfigure={handleConfigure} />;
  }

  return (
    <FlagshipProvider
      envId={credentials.envId}
      apiKey={credentials.apiKey}
      isQAModeEnabled={qaEnabled}
      visitorData={{
        id: "test_visitor_126",
        hasConsented: true,
        context: {
          context_key_1: "value1",
          platform: "expo",
        },
      }}
    >
      <ExampleAppWrapper qaEnabled={qaEnabled} setQaEnabled={setQaEnabled} />
    </FlagshipProvider>
  );
}

function ExampleAppWrapper({
  qaEnabled,
  setQaEnabled,
}: {
  qaEnabled: boolean;
  setQaEnabled: (enabled: boolean) => void;
}) {
  return (
    <>
      <ExampleApp qaEnabled={qaEnabled} setQaEnabled={setQaEnabled} />
      {qaEnabled && (
        <QAAssistant
          config={{
            position: "bottom-right",
          }}
        />
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F7",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 16,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E8E8E8",
  },
  headerLeft: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1D1D1F",
    marginBottom: 2,
  },
  headerSubtitle: {
    fontSize: 13,
    color: "#86868B",
    fontWeight: "400",
  },
  headerRight: {
    flexDirection: "row",
    gap: 8,
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#F5F5F7",
    alignItems: "center",
    justifyContent: "center",
  },
  qaActive: {
    backgroundColor: "#D1FAE5",
  },
  qaInactive: {
    backgroundColor: "#FEE2E2",
  },
  iconButtonText: {
    fontSize: 20,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  sendButton: {
    backgroundColor: "#0066CC",
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 16,
    shadowColor: "#0066CC",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  sendButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  switchContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  switchLabel: {
    fontSize: 16,
    fontWeight: "500",
    color: "#1D1D1F",
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1D1D1F",
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  table: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#0066CC",
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  tableHeaderCellLeft: {
    flex: 1.5,
  },
  tableHeaderCellRight: {
    flex: 1,
    alignItems: "flex-end",
  },
  tableHeaderText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F5F5F7",
  },
  tableCellLeft: {
    flex: 1.5,
    justifyContent: "center",
  },
  tableCellRight: {
    flex: 1,
    alignItems: "flex-end",
    justifyContent: "center",
  },
  flagName: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1D1D1F",
    marginBottom: 4,
  },
  campaignName: {
    fontSize: 13,
    color: "#86868B",
  },
  flagValue: {
    fontSize: 14,
    fontWeight: "500",
    color: "#0066CC",
  },
  // Config screen styles
  configContent: {
    flex: 1,
    paddingTop: 40,
    paddingHorizontal: 24,
  },
  configHeader: {
    alignItems: "center",
    marginBottom: 48,
  },
  configIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  configTitle: {
    fontSize: 32,
    fontWeight: "700",
    color: "#1D1D1F",
    textAlign: "center",
    marginBottom: 8,
  },
  configSubtitle: {
    fontSize: 15,
    color: "#86868B",
    textAlign: "center",
  },
  configForm: {
    marginBottom: 32,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#1D1D1F",
    marginBottom: 8,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  input: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E8E8E8",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: "#1D1D1F",
  },
  configButton: {
    backgroundColor: "#0066CC",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 24,
    shadowColor: "#0066CC",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  configButtonDisabled: {
    backgroundColor: "#C7C7CC",
    shadowOpacity: 0,
  },
  configButtonText: {
    fontSize: 17,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  configFooter: {
    alignItems: "center",
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: "#E8E8E8",
  },
  skipText: {
    fontSize: 14,
    color: "#86868B",
    textAlign: "center",
    marginBottom: 8,
  },
  skipLink: {
    fontSize: 15,
    fontWeight: "600",
    color: "#0066CC",
    textAlign: "center",
  },
});

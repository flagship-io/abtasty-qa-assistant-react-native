import React from "react";
import { View, Modal, StyleSheet, Animated } from "react-native";
import { COLORS } from "../../constants";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  NavigationContainer,
  NavigationIndependentTree,
} from "@react-navigation/native";
import { createQANavigator } from "../../navigation/QANavigator";
import { HomeScreen } from "../../screens/HomeScreen";
import { CampaignDetailsScreen } from "../../screens/CampaignDetailsScreen";
import { Header } from "./Header";
import { useSwipeToDismiss } from "../../hooks/useSwipeToDismiss";

const QAStack = createQANavigator();

interface QAAssistantModalProps {
  visible: boolean;
  onClose: () => void;
}

export const QAAssistantModal: React.FC<QAAssistantModalProps> = ({
  visible,
  onClose,
}) => {
  const { translateY, panHandlers } = useSwipeToDismiss(onClose);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <Animated.View
        style={[styles.animatedContainer, { transform: [{ translateY }] }]}
        {...panHandlers}
      >
        <SafeAreaView
          style={styles.container}
          edges={["bottom", "left", "right"]}
        >
          <View style={styles.handleContainer}>
            <View style={styles.handle} />
          </View>

          <NavigationIndependentTree>
            <NavigationContainer
              documentTitle={{
                enabled: false,
              }}
            >
              <QAStack.Navigator
                screenOptions={{
                  headerTitle: ({ canGoBack }: { canGoBack: boolean }) => <Header onClose={onClose} canGoBack={canGoBack} />,
                }}
              >
                <QAStack.Screen 
                  name="Home" 
                  component={HomeScreen}
                />
                <QAStack.Screen
                  name="CampaignDetails"
                  component={CampaignDetailsScreen}
                />
              </QAStack.Navigator>
            </NavigationContainer>
          </NavigationIndependentTree>
        </SafeAreaView>
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  animatedContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.modalBackground,
    paddingTop: 8,
  },
  handleContainer: {
    alignItems: "center",
    paddingVertical: 8,
    backgroundColor: COLORS.modalBackground,
  },
  handle: {
    width: 36,
    height: 5,
    borderRadius: 3,
    backgroundColor: "#9CA3AF",
  },
});

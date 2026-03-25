import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { FloatingButton } from "./components/layout";
import { QAAssistantModal } from "./components/layout/QAAssistantModal";
import { QAConfig } from "./types";
import {
  type ABTastyQA,
} from "@flagship.io/react-native-sdk";
import { AppProvider } from "./providers/AppProvider";

type QAAssistantContentProps = {
  config: Partial<QAConfig>;
  ABTastQA: ABTastyQA;
};

export function QAAssistantContent({
  config,
  ABTastQA,
}: QAAssistantContentProps) {
  const [isVisible, setIsVisible] = useState(false);
  return (
    <AppProvider ABTastQA={ABTastQA}>
      <View style={styles.container} pointerEvents="box-none">
        {config.floatingButton && (
          <FloatingButton
            onPress={() => setIsVisible(true)}
            position={config.position}
          />
        )}

        <QAAssistantModal
          visible={isVisible}
          onClose={() => setIsVisible(false)}
        />
      </View>
    </AppProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});

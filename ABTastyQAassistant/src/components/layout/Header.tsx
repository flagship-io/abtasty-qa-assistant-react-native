import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { COLORS } from "../../constants";
import { QAAIcon, CloseIcon, ArrowLeftIcon } from "../../assets/icons";
import { useNavigation } from "@react-navigation/native";

interface HeaderProps {
  onClose: () => void;
  canGoBack?: boolean;
}

export function Header({ onClose, canGoBack }: HeaderProps) {
  const navigation = useNavigation();
  return (
    <> 
      {/* Header */}
      <View style={styles.header}>
        {canGoBack && (
          <TouchableOpacity 
            onPress={() => navigation.goBack()} 
            style={styles.backButton}
          >
            <ArrowLeftIcon width={24} height={24} color={COLORS.secondary} />
          </TouchableOpacity>
        )}
        <View style={styles.headerContent}>
          <QAAIcon width={40} height={40} />
          <Text style={styles.title}>QA Assistant</Text>
        </View>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <CloseIcon width={24} height={24} color="#111827" />
        </TouchableOpacity>
      </View>

  
    </>
  );
}

const styles = StyleSheet.create({


  header: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20, 
    paddingVertical: 16,
    backgroundColor: COLORS.modalBackground,
    position: "relative",
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: COLORS.textSecondary,
  },
  closeButton: {
    position: "absolute",
    right: 20,
    top: 0,
    width: 36,
    height: 36,
    justifyContent: "center",
    alignItems: "center",
  },
  backButton: {
    position: "absolute",
    left: 20,
    width: 36,
    height: 36,
    justifyContent: "center",
    alignItems: "center",
  },
});

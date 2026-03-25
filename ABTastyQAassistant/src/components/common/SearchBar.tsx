import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { COLORS } from "../../constants";
import { CloseIcon, SearchIcon } from "../../assets/icons";

type Props = {
  onChangeText?: (text: string) => void;
  value?: string;
};

export function SearchBar({ onChangeText, value }: Props) {
  const [searchQuery, setSearchQuery] = useState(value ?? "");

  useEffect(() => {
    if (value !== undefined) {
      setSearchQuery(value);
    }
  }, [value]);

  const handleTextChange = (text: string) => {
    setSearchQuery(text);
    if (onChangeText) {
      onChangeText(text);
    }
  };
  
  const handleClearSearch = () => {
    if (searchQuery === "") {
      return;
    }
    setSearchQuery("");
    if (onChangeText) {
      onChangeText("");
    }
  };
  return (
    <View style={styles.searchContainer}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search..."
        value={searchQuery}
        onChangeText={handleTextChange}
        placeholderTextColor={COLORS.textLight}
        autoCapitalize="none"
        autoCorrect={false}
        clearButtonMode="never"
        returnKeyType="done"
      />
      <TouchableOpacity style={styles.searchIcon} onPress={handleClearSearch}>
        {searchQuery ? <CloseIcon /> : <SearchIcon />}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  searchContainer: {
    paddingHorizontal: 40,
    paddingBottom: 16,
  },
  searchInput: {
    backgroundColor: COLORS.background,
    borderRadius: 4,
    paddingLeft: 8,
    paddingVertical: 8,
    paddingRight: 38,
    fontSize: 16,
    color: COLORS.textPrimary,
  },
  searchIcon: {
    position: "absolute",
    right: 45,
    top: 6,
    fontSize: 18,
  },
});

import React, { useCallback, useState } from "react";
import { View, TextInput, StyleSheet, TouchableOpacity } from "react-native";
import { IconSymbol } from "../ui/IconSymbol";
import _ from "lodash";

const SearchInput = (props: {
  onChangeText: (text: string) => void;
  placeholder: string;
}) => {
  const { onChangeText, placeholder } = props;
  const [text, setText] = useState("");

  const debouncedOnChangeText = useCallback(
    _.debounce((text) => onChangeText(text), 300), // 300ms là thời gian debounce
    [onChangeText]
  );

  const handleTextChange = (text: string) => {
    setText(text);
    debouncedOnChangeText(text);
  };

  const clearText = () => {
    setText("");
    onChangeText("");
  };

  return (
    <View style={styles.searchSection}>
      <IconSymbol
        name="search1"
        provider="AntDesign"
        size={20}
        color="#00A9FF"
        style={styles.searchIcon}
      />
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        value={text}
        onChangeText={handleTextChange}
        placeholderTextColor="#A9A9A9"
      />
      {text ? (
        <TouchableOpacity onPress={clearText} style={styles.clearButton}>
          <IconSymbol
            name="closecircle"
            provider="AntDesign"
            size={20}
            color="#00A9FF"
          />
        </TouchableOpacity>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  searchSection: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 30,
    paddingLeft: 10,
    paddingRight: 10,
    marginBottom: 20,
  },
  searchIcon: {
    padding: 7,
  },

  input: {
    flex: 1,
    paddingLeft: 10,
    height: 60,
    paddingRight: 10,
    fontSize: 17,
    color: "#0F0F0F",
  },

  clearButton: {
    padding: 7,
  },
});

export default SearchInput;

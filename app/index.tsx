import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  View,
  FlatList,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import axios from "axios";
import SearchInput from "../components/input/SearchInput";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { router } from "expo-router";

interface WordData {
  word: string;
  score?: number;
}

interface SearchHistoryItem extends WordData {
  timestamp: number;
}

const DictionaryApp = () => {
  const [results, setResults] = useState<{ word: string }[]>([]);
  const [searchHistory, setSearchHistory] = useState<SearchHistoryItem[]>([]);

  const popularWords = [
    { word: "hello" },
    { word: "world" },
    { word: "react" },
    { word: "javascript" },
    { word: "dictionary" },
    { word: "app" },
  ];

  const saveSearchHistory = async (word: string) => {
    try {
      const history = await AsyncStorage.getItem("searchHistory");
      const currentHistory = history ? JSON.parse(history) : [];
      const newHistoryItem: SearchHistoryItem = {
        word,
        timestamp: Date.now(),
      };
      //Avoid duplicates
      const existingItem = currentHistory.find(
        (item: { word: string }) => item.word === word
      );
      if (!existingItem) {
        const updatedHistory = [newHistoryItem, ...currentHistory];
        await AsyncStorage.setItem(
          "searchHistory",
          JSON.stringify(updatedHistory)
        );
        setSearchHistory(updatedHistory);
      }
    } catch (error) {
      console.error("Error saving search history:", error);
    }
  };

  const loadSearchHistory = async () => {
    try {
      const historyString = await AsyncStorage.getItem("searchHistory");
      let history: SearchHistoryItem[] = historyString
        ? JSON.parse(historyString)
        : [];

      // Sort by timestamp in descending order (most recent first)
      history.sort((a, b) => b.timestamp - a.timestamp);

      // Return only the first 5 items
      return history.slice(0, 5);
    } catch (error) {
      console.error("Error loading search history:", error);
      return [];
    }
  };

  useEffect(() => {
    const loadHistory = async () => {
      const history = await loadSearchHistory();
      setSearchHistory(history);
    };
    loadHistory();
  }, []);

  const fetchWords = async (prefix: string) => {
    console.log(prefix);
    try {
      const response = await axios.get<WordData[]>(
        `https://api.datamuse.com/words?sp=${prefix}*`
      );
      const sortedResults = response.data.sort((a, b) => {
        const aIsCompound = a.word.includes("-") || a.word.includes(" ");
        const bIsCompound = b.word.includes("-") || b.word.includes(" ");

        // Prioritize single words
        if (!aIsCompound && bIsCompound) return -1;
        if (aIsCompound && !bIsCompound) return 1;

        // If both are single words or both are compound words, sort alphabetically
        return a.word.localeCompare(b.word);
      });
      setResults(sortedResults);
    } catch (error) {
      console.error(error);
    }
  };

  const isResultsEmpty = !results || results.length === 0;
  const isSearchHistoryEmpty = !searchHistory || searchHistory.length === 0;

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <SearchInput
          placeholder="Nhập từ để tra cứu"
          onChangeText={(text) => {
            text ? fetchWords(text) : setResults([]);
          }}
        />

        {!isResultsEmpty && (
          <FlatList
            data={results}
            style={{ marginTop: 10, width: "100%" }}
            keyExtractor={(item) => item.word}
            renderItem={({ item, index }) => (
              <TouchableOpacity
                onPress={() => {
                  saveSearchHistory(item.word);
                  setResults([]);
                  router.push(`/WordDetail/${item.word}`);
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "flex-start",
                    width: "100%",
                  }}
                >
                  <IconSymbol
                    name="search1"
                    provider="AntDesign"
                    size={20}
                    color="gray"
                    style={{ marginRight: 10 }}
                  />
                  <Text style={styles.item}>{item.word}</Text>
                </View>
              </TouchableOpacity>
            )}
          />
        )}

        {!isSearchHistoryEmpty && isResultsEmpty && (
          <View style={{ marginTop: 20, width: "100%" }}>
            <View style={styles.titlePopularWord}>
              <IconSymbol
                name="history"
                provider="MaterialIcons"
                size={20}
                color={"#00A9FF"}
              />
              <Text style={{ fontSize: 15, color: "#00A9FF" }}>
                LỊCH SỬ TÌM KIẾM
              </Text>
            </View>
            <View>
              <FlatList
                data={searchHistory}
                keyExtractor={(item) => item.word + item.timestamp}
                style={{
                  margin: 10,
                  borderRadius: 20,
                  boxSizing: "border-box",
                }}
                renderItem={({ item, index }) => (
                  <TouchableOpacity
                    onPress={() => {
                      setResults([]);
                      saveSearchHistory(item.word);
                      router.push(`/WordDetail/${item.word}`);
                    }}
                  >
                    {index < searchHistory.length - 1 ? (
                      <Text style={styles.itemWord}>{item.word}</Text>
                    ) : (
                      <Text style={styles.itemWordLastChild}>{item.word}</Text>
                    )}
                  </TouchableOpacity>
                )}
              />
            </View>
          </View>
        )}

        {isResultsEmpty && (
          <View style={{ marginTop: 20, width: "100%" }}>
            <View style={styles.titlePopularWord}>
              <IconSymbol
                name="barschart"
                provider="AntDesign"
                size={20}
                color={"#00A9FF"}
              />
              <Text style={{ fontSize: 15, color: "#00A9FF" }}>
                TỪ TRA CỨU PHỔ BIẾN
              </Text>
            </View>
            <View>
              <FlatList
                data={popularWords}
                style={{
                  margin: 10,
                  borderRadius: 20,
                  boxSizing: "border-box",
                }}
                keyExtractor={(item) => item.word}
                renderItem={({ item, index }) => (
                  <TouchableOpacity
                    onPress={() => {
                      setResults([]);
                      saveSearchHistory(item.word);
                      router.push(`/WordDetail/${item.word}`);
                    }}
                  >
                    {index < popularWords.length - 1 ? (
                      <Text style={styles.itemWord}>{item.word}</Text>
                    ) : (
                      <Text style={styles.itemWordLastChild}>{item.word}</Text>
                    )}
                  </TouchableOpacity>
                )}
              />
            </View>
          </View>
        )}
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "flex-start",
  },

  item: {
    width: "100%",
    backgroundColor: "white",
    padding: 10,
    fontSize: 18,
    height: 44,
    margin: 0,
  },

  titlePopularWord: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    gap: 10,
    padding: 0,
    margin: 0,
    marginBottom: 10,
  },

  itemWord: {
    width: "100%",
    padding: 10,
    paddingLeft: 20,
    fontSize: 18,
    height: 44,
    backgroundColor: "#eef8fe",
    borderBottomColor: "#c3d4db",
    borderBottomWidth: 1,
  },
  itemWordLastChild: {
    width: "100%",
    padding: 10,
    paddingLeft: 20,
    fontSize: 18,
    height: 44,
    backgroundColor: "#eef8fe",
  },
});

export default DictionaryApp;

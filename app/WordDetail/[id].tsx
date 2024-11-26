import { Link, router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import axios from "axios";
import ButtonPlaySound from "@/components/button/ButtonPlaySound";
import { Image } from "expo-image";
import { IconSymbol } from "@/components/ui/IconSymbol";

interface WordDetail {
  definitions?: {
    synonyms: string[];
    antonyms: string[];
    partOfSpeech: string;
    definitions: {
      example: string;
      definition: string;
    }[];
  }[];
  pronunciation?: string;
  audio?: string;
  translation?: string;
}

type PartOfSpeechKey = "noun" | "verb" | "adjective" | "adverb" | "default";

interface PartOfSpeechEntry {
  color: string;
  text: string;
}

const WordDetail = () => {
  const { id } = useLocalSearchParams();
  const [wordDetails, setWordDetails] = useState<WordDetail | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const partOfSpeechColorMap: { [key in PartOfSpeechKey]: PartOfSpeechEntry } =
    {
      noun: { color: "red", text: "Danh từ" },
      verb: { color: "blue", text: "Động từ" },
      adjective: { color: "green", text: "Tính từ" },
      adverb: { color: "purple", text: "Trạng từ" },
      default: { color: "black", text: "" },
    };

  useEffect(() => {
    const fetchDetails = async () => {
      if (id) {
        const word = Array.isArray(id) ? id[0] : id;
        try {
          setLoading(true); // Set loading to true before fetching

          // await new Promise((resolve) => setTimeout(resolve, 1000));

          const dictionaryResponse = await axios.get(
            `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`
          );
          const translationResponse = await axios.get(
            `https://api.mymemory.translated.net/get?q=${word}&langpair=en|vi`
          );

          setWordDetails({
            definitions: dictionaryResponse.data[0].meanings,
            pronunciation: dictionaryResponse.data[0].phonetics[0]?.text,
            audio: dictionaryResponse.data[0].phonetics[0]?.audio,
            translation: translationResponse.data.responseData.translatedText,
          });
        } catch (error: any) {
          setError(error.message);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchDetails();
  }, [id]);

  return (
    <View style={{ width: "100%" }}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.iconHeader}
          onPress={() => router.back()}
        >
          <IconSymbol
            name="back"
            provider="AntDesign"
            size={25}
            color="black"
          />
        </TouchableOpacity>
        <Link href={"/"} style={styles.textHeader}>
          <Text>{id}</Text>
        </Link>
      </View>

      {loading && (
        <View style={styles.loadingContainer}>
          <Image
            source={require("../../assets/images/searchWord.gif")}
            contentFit="cover"
            transition={1000}
            style={styles.imageLoading}
          />
          <Text style={styles.textLoading}>Vui lòng chờ một chút ...</Text>
        </View>
      )}

      {error && (
        <View style={styles.errorContainer}>
          <Image
            source={require("../../assets/images/404.png")}
            contentFit="cover"
            transition={1000}
            style={styles.imageError}
          />
          <Text style={styles.textErrorPrimary}>No Result Found</Text>
          <Text style={styles.textErrorSecondary}>
            Sorry, that word isn't in our dictionary yet
          </Text>
        </View>
      )}

      {wordDetails && (
        <View style={styles.details}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text
              style={{
                fontSize: 50,
                fontWeight: "bold",
                marginRight: 20,
                color: "#1e293b",
              }}
            >
              {id}
            </Text>
            {wordDetails.audio && (
              <ButtonPlaySound soundURl={wordDetails.audio} />
            )}
          </View>
          <Text style={{ fontSize: 22, color: "#64748b" }}>
            {wordDetails.pronunciation}
          </Text>

          <Text
            style={{
              fontSize: 30,
              marginTop: 10,
              marginBottom: 20,
              fontWeight: "bold",
              color: "#1e293b",
            }}
          >
            {wordDetails.translation}
          </Text>

          <ScrollView>
            {wordDetails?.definitions &&
              wordDetails.definitions.map((meaning, index) => {
                const partOfSpeechData =
                  partOfSpeechColorMap[
                    meaning.partOfSpeech.toLowerCase() as PartOfSpeechKey
                  ] || partOfSpeechColorMap.default;
                return (
                  <View
                    key={index}
                    style={{
                      flexDirection: "row",
                      alignItems: "flex-start",
                      marginBottom: 5,
                      marginTop: 10,
                    }}
                  >
                    <Text
                      style={{
                        color: partOfSpeechData.color,
                        fontWeight: "bold",
                        marginRight: 5,
                        flex: 1,
                        fontSize: 17,
                      }}
                    >
                      {partOfSpeechData.text}
                    </Text>
                    <View style={{ flex: 5, margin: 0, padding: 0 }}>
                      <Text style={{ fontSize: 17 }}>
                        {meaning.definitions[0].definition}
                      </Text>
                      {meaning.definitions[0].example && (
                        <View
                          style={{
                            width: "100%",
                            paddingTop: 10,
                            flexDirection: "row",
                            justifyContent: "flex-start",
                            alignItems: "flex-start",
                          }}
                        >
                          <Text
                            style={{
                              width: "auto",
                              fontSize: 17,
                              fontWeight: "600",
                            }}
                          >
                            Ví dụ:
                          </Text>
                          <Text
                            style={{
                              width: "auto",
                              fontSize: 17,
                              fontStyle: "italic",
                              paddingLeft: 10,
                              textAlign: "justify",
                              flex: 1,
                            }}
                          >
                            {meaning.definitions[0].example}
                          </Text>
                        </View>
                      )}

                      {meaning.synonyms && meaning.synonyms.length > 0 && (
                        <View
                          style={{
                            marginTop: 10,
                            flexDirection: "row",
                            justifyContent: "flex-start",
                            alignItems: "center",
                            flexWrap: "wrap",
                          }}
                        >
                          <Text
                            style={{
                              margin: 0,
                              padding: 0,
                              fontSize: 17,
                              fontWeight: "600",
                            }}
                          >
                            Đồng nghĩa:
                          </Text>
                          {meaning.synonyms
                            .slice(0, 15)
                            .map((synonym, index) => (
                              <TouchableOpacity
                                key={synonym + "-" + index}
                                onPress={() => {
                                  router.push(`/WordDetail/${synonym}`);
                                }}
                                style={{
                                  margin: 0,
                                  padding: 0,
                                }}
                              >
                                <Text
                                  style={{
                                    fontSize: 17,
                                    fontStyle: "italic",
                                    color: "#00A9FF",
                                  }}
                                >
                                  {" "}
                                  {synonym}
                                  {index <
                                  meaning.synonyms.slice(0, 15).length - 1
                                    ? ","
                                    : "."}
                                </Text>
                              </TouchableOpacity>
                            ))}
                        </View>
                      )}

                      {meaning.antonyms && meaning.antonyms.length > 0 && (
                        <View
                          style={{
                            marginTop: 10,
                            flexDirection: "row",
                            justifyContent: "flex-start",
                            alignItems: "center",
                            flexWrap: "wrap",
                          }}
                        >
                          <Text
                            style={{
                              margin: 0,
                              padding: 0,
                              fontSize: 17,
                              fontWeight: "600",
                            }}
                          >
                            Trái nghĩa:
                          </Text>
                          {meaning.antonyms
                            .slice(0, 15)
                            .map((antonym, index) => (
                              <TouchableOpacity
                                key={antonym + "-" + index}
                                onPress={() => {
                                  router.push(`/WordDetail/${antonym}`);
                                }}
                                style={{
                                  margin: 0,
                                  padding: 0,
                                }}
                              >
                                <Text
                                  style={{
                                    fontSize: 17,
                                    fontStyle: "italic",
                                    color: "#00A9FF",
                                  }}
                                >
                                  {" "}
                                  {antonym}
                                  {index <
                                  meaning.antonyms.slice(0, 15).length - 1
                                    ? ","
                                    : "."}{" "}
                                </Text>
                              </TouchableOpacity>
                            ))}
                        </View>
                      )}
                    </View>
                  </View>
                );
              })}
          </ScrollView>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },

  iconHeader: {
    position: "absolute",
    left: 20,
    top: "50%",
    transform: [{ translateY: -12.5 }],
    zIndex: 1,
  },

  textHeader: {
    marginBottom: 20,
    paddingTop: 20,
    width: "100%",
    textAlign: "center",
    fontSize: 25,
    fontWeight: "bold",
  },

  loadingContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  textLoading: {
    marginTop: 20,
    fontSize: 20,
    width: "80%",
    textAlign: "center",
    color: "#475569",
  },

  imageLoading: {
    marginTop: 100,
    width: "80%",
    aspectRatio: "16/9",
    alignSelf: "center",
    borderRadius: 10,
  },

  details: {
    paddingLeft: 20,
    paddingRight: 20,
    paddingBottom: 20,
  },
  detailsText: {
    width: "auto",
    fontSize: 16,
    margin: 0,
    padding: 0,
    marginBottom: 5,
  },

  errorContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },

  imageError: {
    width: "80%",
    aspectRatio: "1",
    alignSelf: "center",
    objectFit: "cover",
  },

  textErrorPrimary: {
    fontSize: 25,
    fontWeight: "bold",
    color: "#94a3b8",
  },

  textErrorSecondary: {
    fontSize: 16,
    color: "#94a3b8",
    marginTop: 10,
  },
});

export default WordDetail;

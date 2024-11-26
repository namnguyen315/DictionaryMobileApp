import React, { useState } from "react";
import { Text, StyleSheet, Pressable } from "react-native";
import { Audio } from "expo-av";
import { IconSymbol } from "../ui/IconSymbol";

export default function ButtonPlaySound(props: { soundURl: string }) {
  const { soundURl } = props;
  const [sound, setSound] = useState<Audio.Sound | null>(null);

  const playSound = async () => {
    const { sound } = await Audio.Sound.createAsync(
      { uri: soundURl },
      { shouldPlay: true }
    );
    setSound(sound);
  };

  React.useEffect(() => {
    return sound
      ? () => {
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  return (
    <Pressable style={styles.button} onPress={() => playSound()}>
      <IconSymbol
        name="volume-2"
        provider="SimpleLineIcons"
        size={30}
        color="#64748b"
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 40,
    height: 40,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 50,
    margin: 0,
  },
});

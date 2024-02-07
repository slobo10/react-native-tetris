import { StatusBar } from "expo-status-bar";
import { FC } from "react";
import { Text, View } from "react-native";
import styles from "./constants/styles";
import Game from "./screens/Game";

const App: FC = () => {
  return (
    <View style={styles.appContainer}>
      <Game />
      <StatusBar style="auto" />
    </View>
  );
};

export default App;

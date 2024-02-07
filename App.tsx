import { StatusBar } from "expo-status-bar";
import { FC } from "react";
import { Text, View } from "react-native";
import styles from "./constants/styles";

const App: FC = () => {
  return (
    <View style={styles.appContainer}>
      <Text>Open up App.js to start working on your app!</Text>
      <StatusBar style="auto" />
    </View>
  );
};

export default App;

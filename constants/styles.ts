import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  appContainer: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  gameSvg: {
    backgroundColor: "lightgrey",
    borderStyle: "solid",
    borderWidth: 5,
    borderColor: "black",
  },
});

const colors: string[] = [
  "none",
  "red",
  "orange",
  "yellow",
  "green",
  "blue",
  "cyan",
  "purple",
];

export default styles;
export { colors };

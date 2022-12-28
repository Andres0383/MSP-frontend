import { StyleSheet, Text, TouchableOpacity } from "react-native";

export default function DiscoverBtn({ navigation }) {
  const handleDiscover = () => {};

  return (
    <TouchableOpacity
      onPress={() => handleDiscover()}
      style={styles.button}
      activeOpacity={0.8}
    >
      <Text style={styles.textButton}>Discove</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 8,
    width: "40%",
    height: "90%",
    marginTop: 10,
    backgroundColor: "#E74C3C",
    borderRadius: 10,
  },
  textButton: {
    color: "#ffffff",
    height: 30,
    fontWeight: "600",
    fontSize: 16,
    fontFamily: "Poppins-Bold",
  },
});

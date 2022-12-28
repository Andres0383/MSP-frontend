import {
  Image,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  View,
  Modal,
  TextInput,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import { useState } from "react";

export default function EventScreen({ navigation }) {
  const [searchMessage, setSearchMessage] = useState("");

  const handleChat = () => {
    console.log("le chat !");
  };

  return (
    <ImageBackground
      style={styles.imgBackground}
      source={require("../../assets/background.jpg")}
    >
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <Text style={styles.headerText}>My Messages</Text>
        </View>

        <View style={styles.subHeaderContainer}>
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.inputs}
              placeholder="🔍 Search activity by sport or level"
              placeholderTextColor="#ccd1e8"
              onChangeText={(value) => {
                setSearchMessage(value);
              }}
              value={searchMessage}
            />
          </View>
        </View>

        <View style={styles.generalMessagesContainer}>
          <View style={styles.messageContainer}>
            <View style={styles.userInfoContainer}>
              <View style={styles.image}></View>
              <Text style={styles.textsmallname}>Name</Text>
            </View>

            <View style={styles.messageContentContainer}>
              <Text style={styles.textsmall}>
                SALUT JOHN AU FAIT POUR CE SOIR SUPER SI ON PEUT....
              </Text>
            </View>
          </View>

          <View style={styles.messageContainer}>
            <View style={styles.userInfoContainer}>
              <View style={styles.image}></View>
              <Text style={styles.textsmallname}>Name</Text>
            </View>

            <TouchableOpacity onPress={() => handleChat()}>
              <View style={styles.messageContentContainer}>
                <Text style={styles.textsmall}>
                  SALUT JOHN AU FAIT POUR CE SOIR SUPER SI ON PEUT....
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  imgBackground: {
    height: "100%",
    width: "100%",
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    marginTop: 45,
  },
  //   HEADER ---------
  headerContainer: {
    width: "100%",
    height: "10%",
    paddingLeft: 10,
  },
  headerText: {
    fontSize: 45,
    fontWeight: "700",
    color: "white",
    fontFamily: "Poppins-Bold",
    textShadowColor: "black",
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 20,
  },
  //   SEARCH BAR ---------
  subHeaderContainer: {
    width: "100%",
    height: "8%",
  },
  searchContainer: {
    width: "97%",
    height: "100%",
    justifyContent: "center",
    paddingLeft: 10,
  },
  inputs: {
    width: "80%",
    height: "10%",
    borderColor: "grey",
    borderWidth: 2,
    borderRadius: 10,
    fontSize: 16,
    height: "80%",
    backgroundColor: "white",
    paddingLeft: 10,
  },
  // DISPLAY ALL MESSAGES --------
  generalMessagesContainer: {
    width: "96%",
    marginVertical: 10,
    borderWidth: 2,
    borderColor: "#E74C3C",
    borderRadius: 20,
    height: "78%",
    justifyContent: "flex-start",
  },
  messageContainer: {
    margin: 8,
    height: "20%",
    borderBottomWidth: 1,
    borderBottomColor: "#E74C3C",
  },
  userInfoContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
    height: "30%",
  },
  messageContentContainer: {
    backgroundColor: "white",
    marginTop: 4,
  },
  image: {
    width: "10%",
    height: "100%",
    borderRadius: 50,
    marginRight: 8,
    backgroundColor: "orange",
  },
  //   TEXT
  text: {
    fontSize: 40,
  },
  textsmall: {
    fontSize: 20,
  },
  textsmallname: {
    backgroundColor: "white",
    fontSize: 20,
  },
});

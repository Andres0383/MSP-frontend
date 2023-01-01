import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ImageBackground,
  Alert,
  ScrollView,
} from "react-native";
import { useState } from "react";
import { MultipleSelectList } from "react-native-dropdown-select-list";
import { SelectList } from "react-native-dropdown-select-list";

import { useSelector } from "react-redux";

export default function QuizzScreen({ navigation }) {
  const user = useSelector((state) => state.user.value);

  const [sportPractice, setSportPractice] = useState([]);
  const [level, setLevel] = useState("");
  const [mixed, setMixed] = useState("");

  const [changeColorMixed, setChangeColorMixed] = useState(false);
  const [changeColorOnly, setChangeColorOnly] = useState(false);

  // FUNCTION FOR MIXED SEX
  const handleMixed = (mix) => {
    if (mix === "mixed") {
      setMixed("mixed");
      setChangeColorMixed(true);
      setChangeColorOnly(false);
    } else if (mix === "only") {
      setMixed("only");
      setChangeColorOnly(true);
      setChangeColorMixed(false);
    }
  };

  // FUNCTION FOR GO HOMEPAGE
  const handleGo = () => {
    const body = {
      token: user.token,
      sport: sportPractice,
      level: level,

      mixedSex: mixed,
    };
    fetch("https://msp-backend-gold.vercel.app/users/edit", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.result) {
          navigation.navigate("Settings");
        } else {
          Alert.alert("Error :", data.error, { cancelable: true });
        }
      });
  };

  const handleCancel = () => {
    navigation.navigate("Settings");
  };
  const data = [
    { key: "1", value: "Running" },
    { key: "2", value: "Hiking" },
    { key: "2", value: "Snorkeling" },
    { key: "2", value: "Tennis" },
    { key: "3", value: "Cycling" },
    { key: "4", value: "Basketball" },
    { key: "5", value: "Football" },
  ];

  const data2 = ["Amateur", "Medium", "Semi-Pro", "Pro"];

  return (
    <ImageBackground
      style={styles.imgBackground}
      source={require("../../assets/background.jpg")}
    >
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <Text style={styles.headerText}>My Sport Pal</Text>
        </View>

        <View style={styles.subHeaderContainer}>
          <Text style={styles.subHeaderText}>Change your preference !</Text>
        </View>

        <ScrollView style={{ width: "95%" }}>
          <View style={styles.quizzContainer}>
            {/* SPORTS SELECTION */}
            <View style={styles.sectionContainer}>
              <Text style={styles.questionText}>
                What sport do you practice ?
              </Text>
              <View style={styles.multipleListContainer}>
                <MultipleSelectList
                  setSelected={(val) => setSportPractice(val)}
                  data={data}
                  save="value"
                  search={false}
                  placeholder="Select sports you practice"
                  label="Sports selected"
                  labelStyles={{ color: "#E74C3C" }}
                  badgeStyles={{ backgroundColor: "#E74C3C" }}
                  badgeTextStyles={{ color: "white", fontSize: 14 }}
                  boxStyles={{ backgroundColor: "white" }}
                  inputStyles={{ color: "#E74C3C" }}
                  dropdownStyles={{ backgroundColor: "white", height: 200 }}
                  dropdownTextStyles={{ fontSize: 16 }}
                  maxHeight={250}
                />
              </View>
            </View>

            {/* LEVEL SELECTION */}
            <View style={styles.sectionContainer}>
              <Text style={styles.levelText}>What is your level ?</Text>
              <SelectList
                placeholder="Select your level"
                data={data2}
                setSelected={setLevel}
                search={false}
                boxStyles={{ backgroundColor: "white" }}
                inputStyles={{ color: "#E74C3C" }}
                dropdownStyles={{ backgroundColor: "white" }}
                dropdownTextStyles={{ fontSize: 16 }}
                maxHeight={150}
              />
            </View>

            {/* MIXED SEX CHOICE */}
            <View style={styles.sectionContainer}>
              <Text style={styles.mixedText}>
                Sport's Pal from your sex only or mixed ?
              </Text>
              <View style={styles.mixedContainer}>
                <TouchableOpacity
                  onPress={() => handleMixed("mixed")}
                  style={{
                    backgroundColor: changeColorMixed ? "#E74C3C" : "grey",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "40%",
                    height: "90%",
                    borderRadius: 10,
                    marginLeft: 20,
                    marginTop: 10,
                  }}
                >
                  <Text style={styles.textButton}>MIXED</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => handleMixed("only")}
                  style={{
                    backgroundColor: changeColorOnly ? "#E74C3C" : "grey",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "40%",
                    height: "90%",
                    borderRadius: 10,
                    marginLeft: 20,
                    marginTop: 10,
                  }}
                >
                  <Text style={styles.textButton}>ONLY</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.goContainer}>
                <TouchableOpacity
                  onPress={() => handleCancel()}
                  style={styles.cancelButton}
                >
                  <Text style={styles.textButton}>CANCEL </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleGo()}
                  style={styles.goButton}
                >
                  <Text style={styles.textButton}>OK </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
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
    flexShrink: 1,
    alignItems: "center",
    marginTop: 45,
  },
  headerContainer: {
    alignItems: "center",
    width: "100%",

    paddingLeft: 10,
  },
  subHeaderContainer: {
    width: "100%",
    alignItems: "center",
    paddingLeft: 10,
    paddingTop: 10,
  },

  quizzContainer: {
    marginTop: 50,
    alignItems: "center",
  },
  sectionContainer: {
    marginVertical: 5,
    alignItems: "center",
  },
  multipleListContainer: {
    width: "98%",
    marginTop: 10,
  },

  mixedContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "90%",
    height: "12%",
  },
  goContainer: {
    flexDirection: "row",

    height: "12%",
    marginTop: 110,
    marginBottom: 125,
  },

  //   BUTTONS
  button: {
    alignItems: "center",
    justifyContent: "center",
    width: "30%",
    height: "37%",
    backgroundColor: "#E74C3C",
    borderRadius: 10,
  },
  goButton: {
    alignItems: "center",
    justifyContent: "center",
    width: "30%",
    height: "100%",
    backgroundColor: "#E74C3C",
    borderRadius: 10,
    marginTop: 25,
    marginLeft: 20,
  },
  cancelButton: {
    alignItems: "center",
    justifyContent: "center",
    width: "30%",
    height: "100%",
    backgroundColor: "#E74C3C",
    borderRadius: 10,
    marginTop: 25,
    marginLeft: 12,
  },
  textButton: {
    color: "#ffffff",
    fontWeight: "600",
    fontSize: 16,
    fontFamily: "Poppins-Bold",
  },
  //   TEXT
  headerText: {
    fontSize: 45,
    fontWeight: "700",
    color: "#E74C3C",
    fontFamily: "Poppins-Bold",
    textShadowColor: "black",
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 20,
  },
  subHeaderText: {
    fontFamily: "Poppins-Medium",
    fontSize: 25,
    color: "black",
    backgroundColor: "white",
  },
  questionText: {
    fontFamily: "Poppins-Medium",
    fontSize: 20,
    color: "black",
    backgroundColor: "white",
    marginTop: 10,
  },
  levelText: {
    fontFamily: "Poppins-Medium",
    fontSize: 20,
    color: "black",
    backgroundColor: "white",
    marginBottom: 10,
  },
  mixedText: {
    fontFamily: "Poppins-Medium",
    fontSize: 20,
    color: "black",
    backgroundColor: "white",
  },
  textEnd: {
    fontFamily: "Poppins-Light",
    fontSize: 18,
    color: "black",
    backgroundColor: "white",
    marginHorizontal: 20,
  },
});

import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ImageBackground,
  Alert,
} from "react-native";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faPerson, faPersonDress } from "@fortawesome/free-solid-svg-icons";
import { MultipleSelectList } from "react-native-dropdown-select-list";
import { SelectList } from "react-native-dropdown-select-list";
import DatePicker from "@react-native-community/datetimepicker";
import { useSelector } from "react-redux";

export default function QuizzScreen({ navigation }) {
  const user = useSelector((state) => state.user.value);

  const [isMale, setIsMale] = useState("");
  const [dateBirth, setDateBirth] = useState(new Date());
  const [sportPractice, setSportPractice] = useState([]);
  const [level, setLevel] = useState("");
  const [mixed, setMixed] = useState("");
  const [changeColorSex, setChangeColorSex] = useState(false);
  const [changeColorMixed, setChangeColorMixed] = useState(false);

  // FUNCTION FOR BUTTON SEX
  const handleSex = (sex) => {
    if (sex === "male") {
      setIsMale("male");
      setChangeColorSex(true);
    } else if (sex === "female") {
      setIsMale("female");
      setChangeColorSex(false);
    }
  };

  // FUNCTION FOR DATE SELECTION
  const dateBirthSelected = (event, value) => {
    setDateBirth(value);
  };

  // FUNCTION FOR MIXED SEX
  const handleMixed = (mix) => {
    if (mix === "mixed") {
      setMixed("mixed");
      setChangeColorMixed(true);
    } else if (mix === "only") {
      setMixed("only");
      setChangeColorMixed(false);
    }
  };

  // FUNCTION FOR GO HOMEPAGE
  const handleGo = () => {
    const body = {
      token: user.token,
      sport: sportPractice,
      level: level,
      dateOfBirth: dateBirth,
      sex: isMale,
      mixedSex: mixed,
    };
    fetch("https://msp-backend.vercel.app/users/update", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.result) {
          navigation.navigate("TabNavigator");
        } else {
          Alert.alert("Error :", data.error, {cancelable: true})
        }
      });
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
          <Text style={styles.subHeaderText}>Welcome {user.firstname} !</Text>
        </View>

        {/* CHOICE OF SEX */}
        <View style={styles.sexContainer}>
          <TouchableOpacity
            onPress={() => handleSex("male")}
            style={{
              backgroundColor: changeColorSex ? "#E74C3C" : "grey",
              alignItems: "center",
              justifyContent: "center",
              padding: 10,
              marginTop: 10,
              borderRadius: 100,
            }}
          >
            <FontAwesomeIcon
              style={styles.textButton}
              icon={faPerson}
              size={26}
            />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => handleSex("female")}
            style={{
              backgroundColor: !changeColorSex ? "#E74C3C" : "grey",
              alignItems: "center",
              justifyContent: "center",
              padding: 10,
              marginTop: 10,
              borderRadius: 100,
            }}
          >
            <FontAwesomeIcon
              style={styles.textButton}
              icon={faPersonDress}
              size={26}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.quizzContainer}>
          {/* DATE OF BIRTH SELECTION */}
          <View>
            <Text style={styles.questionText}>
              What is your date of birth ?
            </Text>
            <View style={styles.calendarContainer}>
              <DatePicker
                style={styles.calendar}
                mode="date"
                value={dateBirth}
                maximumDate={new Date(2010, 1, 1)}
                minimumDate={new Date(1950, 1, 1)}
                textColor="#E74C3C"
                accentColor="#E74C3C"
                onChange={dateBirthSelected}
              />
            </View>
          </View>

          {/* SPORTS SELECTION */}
          <View style={styles.sectionContainer}>
            <Text style={styles.questionText}>
              What sport do you practice ?
            </Text>
            <MultipleSelectList
              setSelected={(val) => setSportPractice(val)}
              data={data}
              save="value"
              search={false}
              placeholder="Select sports you practice"
              label="Sports selected"
              labelStyles={{ color: "#E74C3C" }}
              badgeStyles={{ backgroundColor: "#E74C3C" }}
              badgeTextStyles={{ color: "white", fontSize: 16 }}
              boxStyles={{ backgroundColor: "white" }}
              inputStyles={{ color: "#E74C3C" }}
              dropdownStyles={{ backgroundColor: "white" }}
              dropdownTextStyles={{ fontSize: 16 }}
              maxHeight={200}
            />
          </View>

          {/* LEVEL SELECTION */}
          <View style={styles.sectionContainer}>
            <Text style={styles.questionText}>What is your level ?</Text>
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
            <Text style={styles.questionText}>
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
                  height: "40%",
                  borderRadius: 10,
                }}
              >
                <Text style={styles.textButton}>MIXED</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => handleMixed("only")}
                style={{
                  backgroundColor: !changeColorMixed ? "#E74C3C" : "grey",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "40%",
                  height: "40%",
                  borderRadius: 10,
                }}
              >
                <Text style={styles.textButton}>ONLY</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.goContainer}>
              <TouchableOpacity
                onPress={() => handleGo()}
                style={styles.goButton}
              >
                <Text style={styles.textButton}>GO ! </Text>
              </TouchableOpacity>
            </View>
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
    flexShrink: 1,
    alignItems: "center",
    marginTop: 45,
  },
  headerContainer: {
    alignItems: "center",
    width: "100%",
    alignItems: "flex-start",
    paddingLeft: 10,
  },
  subHeaderContainer: {
    alignItems: "center",
    width: "100%",
    alignItems: "flex-start",
    paddingLeft: 10,
    paddingTop: 10,
  },
  sexContainer: {
    flexDirection: "row",
    width: "80%",
    justifyContent: "space-around",
  },
  quizzContainer: {
    marginTop: 20,
  },
  sectionContainer: {
    marginVertical: 5,
  },
  calendarContainer: {
    width: "100%",
    alignItems: "center",
  },
  mixedContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "90%",
  },
  goContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    height: "30%",
  },
  calendar: {
    backgroundColor: "#E74C3C",
    opacity: 0.9,
    width: "40%",
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
    height: "40%",
    backgroundColor: "#E74C3C",
    borderRadius: 10,
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
    color: "white",
    fontFamily: "Poppins-Bold",
    textShadowColor: "black",
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 20,
  },
  subHeaderText: {
    fontFamily: "Poppins-Medium",
    fontSize: 25,
    color: "#E74C3C",
    backgroundColor: "white",
  },
  questionText: {
    fontFamily: "Poppins-Medium",
    fontSize: 20,
    color: "black",
    backgroundColor: "white",
    marginTop: 15,
  },
  textEnd: {
    fontFamily: "Poppins-Light",
    fontSize: 18,
    color: "black",
    backgroundColor: "white",
    marginHorizontal: 20,
  },
});

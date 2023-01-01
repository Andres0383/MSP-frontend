import {
  KeyboardAvoidingView,
  Keyboard,
  StyleSheet,
  Text,
  View,
  Modal,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  ScrollView,
  Alert,
} from "react-native";
import { SelectList } from "react-native-dropdown-select-list";
import DatePicker from "@react-native-community/datetimepicker";
import { AutocompleteDropdown } from "react-native-autocomplete-dropdown";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { useState } from "react";
import { useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faArrowLeftLong } from "@fortawesome/free-solid-svg-icons";

export default function EventScreen({ navigation }) {
  const data2 = [
    "Running",
    "Hiking",
    "Snorkeling",
    "Tennis",
    "Cycling",
    "Basketball",
    "Football",
  ];

  const user = useSelector((state) => state.user.value);

  // AUTO COMPLETE ADDRESS USESTATE
  const [dataSet, setDataSet] = useState([]);
  const [citiesData, setCitiesData] = useState([]);
  // OTHER USE STATE
  const [sport, setSport] = useState("");
  const [dateEvent, setDateEvent] = useState(new Date());
  const [hourEvent, setHourEvent] = useState(new Date());
  const [eventDescription, setEventDescription] = useState("");

  const [dateIsVisible, setDateIsVisible] = useState(false);
  const [timeIsVisible, setTimeIsVisible] = useState(false);

  // PRECEDENT BUTTON
  const handlePrevious = () => {
    navigation.navigate("HomeNavigator");
  };

  // FUNCTION POUR SELECTIONNER LA DATE
  const dateEventSelected = (event, value) => {
    setDateEvent(value);
  };

  // FUNCTION POUR SELECTIONNER L'HEURE
  const hourEventSelected = (event, value) => {
    setHourEvent(value);
  };

  // FUNCTION POUR SELECTIONNER L'ADDRESSE
  const searchCity = (query) => {
    if (query === "") {
      return;
    }
    fetch(`https://api-adresse.data.gouv.fr/search/?q=${query}`)
      .then((response) => response.json())
      .then(({ features }) => {
        const suggestions = features.map((data, i) => {
          return {
            id: i,
            title: data.properties.label,
            context: data.properties.context,
            latitude: data.geometry.coordinates[1],
            longitude: data.geometry.coordinates[0],
          };
        });
        setDataSet(suggestions);
      });
  };

  // FUNCTION POUR TOUT ENVOYER EN DATABASE -- CREATION NEW EVENT
  const handleConfirm = () => {
    const body = {
      token: user.token,
      sport: sport,
      date: dateEvent,
      hour: hourEvent,
      description: eventDescription,
      latitude: citiesData[0].latitude,
      longitude: citiesData[0].longitude,
      address: citiesData[0].title,
    };
    fetch("https://msp-backend-gold.vercel.app/events/newevent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.result) {
          Alert.alert("Confirmation :", "Your event has been created !", {
            cancelable: true,
          });
          navigation.navigate("HomeNavigator");
        } else {
          Alert.alert("Confirmation :", data.error, { cancelable: true });
        }
      });
  };

  // L'ELEMENT QUI SE RAJOUTE SI L'ADDRESSE EST VALIDE ET SELECTIONNEE
  const cities = citiesData.map((data, i) => {
    return (
      <View key={i} style={styles.resultContainer}>
        <MaterialCommunityIcons
          name="map-marker-check"
          size={30}
          color="#51e181"
        />
        <View>
          <Text style={{ ...styles.resultText, ...styles.resultTitle }}>
            {data.title}
          </Text>
        </View>
      </View>
    );
  });

  // PAGE >>>>>>>>>>>>
  return (
    <ImageBackground
      style={styles.imgBackground}
      source={require("../../assets/background.jpg")}
    >
      <KeyboardAvoidingView
        style={{ flex: 1, justifyContent: "flex-end" }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={styles.headerContainer}>
          <TouchableOpacity onPress={() => handlePrevious()}>
            <FontAwesomeIcon
              icon={faArrowLeftLong}
              size={36}
              style={{ color: "#E74C3C" }}
            />
          </TouchableOpacity>
          <Text style={styles.headerText}>My Event</Text>
        </View>
        {/* WHICH SPORT ? */}
        <View style={styles.sectionContainer}>
          <Text style={styles.questionText}>Which sport ?</Text>
          <SelectList
            placeholder="Select your Sport"
            data={data2}
            setSelected={setSport}
            search={false}
            boxStyles={{ backgroundColor: "white" }}
            inputStyles={{ color: "#E74C3C" }}
            dropdownStyles={{ backgroundColor: "white" }}
            dropdownTextStyles={{ fontSize: 16 }}
            maxHeight={150}
          />
        </View>

        {/* DATE SELECTION */}
        <View style={styles.sectionContainer}>
          <Text style={styles.questionText}>Select a date</Text>
          {dateIsVisible && (
            <DatePicker
              style={styles.calendar}
              mode="date"
              value={dateEvent}
              minimumDate={new Date()}
              textColor="#E74C3C"
              accentColor="#E74C3C"
              onChange={dateEventSelected}
              format="hh:mm"
            />
          )}
        </View>

        {/* HOUR SELECTION */}
        <View style={styles.sectionContainer}>
          <Text style={styles.questionText}>Select an hour</Text>
          {timeIsVisible && (
            <DatePicker
              style={styles.hour}
              mode="time"
              value={hourEvent}
              onChange={hourEventSelected}
              textColor="#E74C3C"
              accentColor="#E74C3C"
              minuteInterval={10}
            />
          )}
        </View>

        {/* EVENT DESCRIPTION */}
        <View style={styles.descriptionContainer}>
          <Text style={styles.questionText}>
            Enter a short description of your event
          </Text>
          <TextInput
            onSubmit={Keyboard.dismiss}
            style={styles.descriptionInput}
            placeholder="Enter a short description"
            placeholderTextColor="#ccd1e8"
            onChangeText={(value) => {
              setEventDescription(value);
            }}
          />
        </View>

        {/* ADDRESS SELECTION */}

        <View style={styles.addressContainer}>
          <Text style={styles.questionText}>Where ?</Text>
          <AutocompleteDropdown
            onChangeText={(value) => searchCity(value)}
            onSelectItem={(item) =>
              item && setCitiesData([...citiesData, item])
            }
            dataSet={dataSet}
            textInputProps={{ placeholder: "🔍 Enter an address" }}
            inputContainerStyle={styles.inputContainer}
            containerStyle={styles.dropdownContainer}
            suggestionsListContainerStyle={styles.suggestionListContainer}
            closeOnSubmit
          />
          <ScrollView style={styles.scrollContainer}>{cities}</ScrollView>
        </View>

        {/* BUTTON CANCEL AND CONFIRM */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.textButton}>CANCEL</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={() => handleConfirm()}
          >
            <Text style={styles.textButton}>CONFIRM</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
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
    alignItems: "flex-start",
    justifyContent: "flex-start",
    marginTop: 45,
  },
  // CONTAINERS
  headerContainer: {
    width: "100%",
    height: "10%",
    paddingLeft: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  sectionContainer: {
    width: "100%",
    marginBottom: 4,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 10,
    paddingHorizontal: 20,
  },
  // ADDRESS
  addressContainer: {
    width: "100%",
    flexDirection: "column",
    alignItems: "flex-start",
    paddingHorizontal: 15,
    zIndex: 1,
  },
  scrollContainer: {
    width: "100%",
  },
  dropdownContainer: {
    width: "100%",
    marginBottom: 20,
  },
  inputContainer: {
    borderWidth: 1,
    width: "100%",
    borderColor: "#E74C3C",
    backgroundColor: "#ffffff",
  },
  suggestionListContainer: {
    borderRadius: 3,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
  },
  resultContainer: {
    backgroundColor: "#ffffff",
    width: "100%",
    borderRadius: 6,
    padding: 15,
    marginBottom: 20,
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    borderColor: "#E74C3C",
    borderWidth: 1,
  },
  resultTitle: {
    fontWeight: "bold",
  },
  //
  descriptionContainer: {
    width: "100%",
    height: "25%",
    flexDirection: "column",
    paddingHorizontal: 20,
    alignItems: "flex-start",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    height: "15%",
  },
  calendar: {
    backgroundColor: "white",
    opacity: 0.9,
  },
  hour: {
    backgroundColor: "white",
    opacity: 0.9,
  },
  descriptionInput: {
    width: 320,
    height: "50%",
    borderColor: "#E74C3C",
    borderWidth: 1,
    borderRadius: 10,
    fontSize: 16,
    backgroundColor: "white",
    paddingLeft: 10,
  },
  button: {
    alignItems: "center",
    justifyContent: "center",
    width: "30%",
    height: "40%",
    backgroundColor: "#E74C3C",
    borderRadius: 10,
  },
  //   TEXT
  headerText: {
    fontSize: 45,
    marginLeft: 40,
    fontWeight: "700",
    color: "white",
    fontFamily: "Poppins-Bold",
    textShadowColor: "black",
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 20,
  },
  questionText: {
    fontFamily: "Poppins-Medium",
    fontSize: 20,
    color: "black",
    backgroundColor: "white",
    marginTop: 15,
  },
  textButton: {
    color: "#ffffff",
    fontWeight: "600",
    fontSize: 16,
    fontFamily: "Poppins-Bold",
  },
});

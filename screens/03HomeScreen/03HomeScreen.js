import {
  Image,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  ScrollView,
} from "react-native";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { userGeoLocation } from "../../reducers/user";
import * as Location from "expo-location";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faEnvelope, faStar } from "@fortawesome/free-solid-svg-icons";
import { eventGeoLocation } from "../../reducers/location";
import { transferEvent } from "../../reducers/event";
import { transferUser } from "../../reducers/goprofile";
import { useFocusEffect } from "@react-navigation/native";

export default function HomeScreen({ navigation }) {
  const [hasPermission, setHasPermission] = useState(false);
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.value);

  const [currentPosition, setCurrentPosition] = useState(null);
  const [searchFilter, setSearchFilter] = useState("");
  const [eventData, setEventData] = useState([]);

  // USE EFFECT FOR THE GEO LOCALISATION AUTHORISATION
  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status === "granted") {
        Location.watchPositionAsync({ distanceInterval: 10 }, (location) => {
          const position = {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: 0.03,
            longitudeDelta: 0.007,
          };
          setCurrentPosition(position);
          dispatch(
            userGeoLocation({
              latitude: position.latitude,
              longitude: position.longitude,
              latitudeDelta: 0.03,
              longitudeDelta: 0.007,
            })
          );
        });
      }
    })();
  }, []);

  // GET ALL EVENTS FROM DATABASE FOR THE FEED
  useFocusEffect(
    useCallback(() => {
      fetch("https://msp-backend-gold.vercel.app/events/all")
        .then((response) => response.json())
        .then((data) => {
          const realData = data.events.map((event) => {
            const eventInformation = {
              latitude: event.latitude,
              longitude: event.longitude,
              eventId: event._id,
              userId: event.user,
              sport: event.sport,
              date: event.date.slice(5, 10),
              hour: event.hour.slice(11, 16),
              description: event.description,
              address: event.address,
            };
            dispatch(eventGeoLocation(eventInformation));
            return eventInformation;
          });
          setEventData(realData);
          setHasPermission(true);
        });
    }, [])
  );

  if (!hasPermission) {
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    );
  }

  // CREATE EACH COMPONENT OF THE LIST WITH PROPS FROM THE DATABASE + GO TO THE PROFILE OF THE USER
  const eachEventList2 = eventData.map((data, i) => {
    const transferEventData = {
      eventId: data.eventId,
      level: data.userId[0].level,
      username: data.userId[0].firstname,
      sport: data.sport,
      date: data.date,
      hour: data.hour,
      description: data.description,
      latitude: data.latitude,
      longitude: data.longitude,
      address: data.address,
    };
    const transferUserData = {
      token: data.userId[0].token,
      username: data.userId[0].firstname,
      dateOfBirth: data.userId[0].dateOfBirth,
      level: data.userId[0].level,
      sport: data.userId[0].sport,
      description: data.userId[0].description,
      events: data.userId[0].events,
      participate: data.userId[0].participate,
    };
    const handleEvent = () => {
      dispatch(transferEvent(transferEventData));
      navigation.navigate("Event");
    };
    const handleGoProfile = () => {
      if (data.userId[0].token !== user.token) {
        dispatch(transferUser(transferUserData));
        navigation.navigate("UserScreen");
      } else {
        navigation.navigate("Profile");
      }
    };
    return (
      <View key={i} style={styles.cardEventContainer}>
        <View style={styles.eventUserInfo}>
          <TouchableOpacity onPress={() => handleGoProfile()}>
            <Text style={styles.eventListInfo}>{data.userId[0].firstname}</Text>
            <Text style={styles.eventListInfo}>{data.userId[0].level}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.eventInfoContainer}>
          <View style={styles.sportAndLogoContainer}>
            <Text style={styles.eventListInfo}>{data.sport}</Text>
          </View>

          <View style={styles.dateHourContainer}>
            <Text style={styles.eventListInfo}>{data.date}</Text>
            <Text style={styles.eventListInfo}>{data.hour}</Text>
          </View>

          <View style={styles.eventDescriptionContainer}>
            <Text>{data.description}</Text>
          </View>

          <View style={styles.eventGoBtnContainer}>
            <TouchableOpacity
              style={styles.eventGoBtn}
              onPress={() => handleEvent()}
            >
              <Text style={styles.eventGoBtnText}>GO</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  });

  // PAGE >>>>>>>>>>>>>>>
  return (
    <ImageBackground
      style={styles.imgBackground}
      source={require("../../assets/background.jpg")}
    >
      <View style={styles.container}>
        {/* HEADER ------ */}
        <View style={styles.headerContainer}>
          <TouchableOpacity onPress={() => navigation.navigate("Profile")}>
            <View style={styles.userInfoContainer}>
              <View style={styles.image}></View>
              <View style={styles.userInfo}>
                <Text style={styles.textsmallname}>{user.firstname}</Text>
                <Text style={styles.textsmallname}>Nice</Text>
              </View>
            </View>
          </TouchableOpacity>

          <View style={styles.messageContainer}>
            <TouchableOpacity
              onPress={() => navigation.navigate("MessageScreen")}
            >
              <FontAwesomeIcon icon={faEnvelope} size={35} />
            </TouchableOpacity>
          </View>
        </View>
        {/* TODAY IN NICE */}
        <View style={styles.todayContainer}>
          <Text style={styles.todayText}>Today in Nice :</Text>
        </View>
        {/* SEARCH BAR  */}
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.inputs}
            placeholder="🔍 Search activity by sport or level"
            placeholderTextColor="#ccd1e8"
            onChangeText={(value) => {
              setSearchFilter(value);
            }}
            value={searchFilter}
          />
        </View>
        {/* LIST OF EVENTS */}
        <ScrollView style={{ width: "95%", backgroundColor: "white" }}>
          <View style={styles.listEventContainer}>{eachEventList2}</View>
        </ScrollView>

        {/* PROPOSE ACTIVITY */}
        <View style={styles.proposeContainer}>
          <TouchableOpacity
            style={styles.proposeBtn}
            onPress={() => navigation.navigate("MyEvent")}
          >
            <Text style={styles.proposeText}>PROPOSE AN ACTIVITY</Text>
          </TouchableOpacity>
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
  },
  // HEADER ------------
  headerContainer: {
    width: "100%",
    height: "10%",
    marginTop: 45,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  userInfoContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
    height: "80%",
  },
  image: {
    width: "35%",
    height: "100%",
    borderRadius: 50,
    marginRight: 8,
    backgroundColor: "orange",
  },
  userInfo: {
    flexDirection: "column",
  },
  textsmallname: {
    backgroundColor: "white",
    fontSize: 20,
    marginBottom: 4,
    fontFamily: "Poppins-Regular",
    color: "#E74C3C",
  },
  messageContainer: {
    backgroundColor: "white",
    height: "70%",
    width: "18%",
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  // TODAY -------
  todayContainer: {
    height: "4%",
    marginVertical: 10,
  },
  todayText: {
    fontFamily: "Poppins-Medium",
    fontSize: 23,
    backgroundColor: "white",
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 20,
  },
  // SEARCH -------
  searchContainer: {
    width: "90%",
    height: "7%",
    justifyContent: "center",
  },
  inputs: {
    width: "100%",
    height: "10%",
    borderColor: "grey",
    borderWidth: 2,
    borderRadius: 10,
    fontSize: 16,
    height: "80%",
    backgroundColor: "white",
    paddingLeft: 10,
  },
  // LIST OF EVENTS -------
  listEventContainer: {
    width: "97%",
    padding: 5,
    height: "57%",
    borderRadius: 20,
  },
  cardEventContainer: {
    width: "97%",
    flexDirection: "row",
    height: 170,
    borderBottomWidth: 1,
    borderBottomColor: "#E74C3C",
    marginTop: 5,
  },
  eventUserInfo: {
    width: "22%",
    alignItems: "center",
    paddingTop: 30,
  },
  eventInfoContainer: {
    margin: 10,
    width: "78%",
  },
  sportAndLogoContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  dateHourContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 5,
  },
  eventDescriptionContainer: {
    height: "40%",
    marginVertical: 10,
  },
  eventGoBtnContainer: {
    justifyContent: "flex-end",
    flexDirection: "row",
  },
  eventGoBtn: {
    backgroundColor: "#E74C3C",
    borderRadius: 20,
    width: "30%",
    alignItems: "center",
  },
  eventListInfo: {
    fontSize: 15,
    fontFamily: "Poppins-Medium",
  },
  eventGoBtnText: {
    color: "#ffffff",
    fontWeight: "600",
    fontSize: 20,
    fontFamily: "Poppins-Medium",
  },
  // PROPOSE ACTIVITY
  proposeContainer: {
    width: "80%",
    height: "10%",
    alignItems: "center",
    justifyContent: "center",
  },
  proposeBtn: {
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: "70%",
    backgroundColor: "#E74C3C",
    borderRadius: 20,
  },
  proposeText: {
    color: "#ffffff",
    fontWeight: "600",
    fontSize: 25,
    fontFamily: "Poppins-Light",
  },
  // BUTTON

  //   TEXT
  text: {
    fontSize: 40,
  },
  textsmall: {
    fontSize: 20,
  },
});

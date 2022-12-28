import {
  Image,
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  View,
  Modal,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faEnvelope, faStar } from "@fortawesome/free-solid-svg-icons";
import MapView, { Marker } from "react-native-maps";

export default function MapScreen({ navigation }) {
  const location = useSelector((state) => state.location.value);
  const user = useSelector((state) => state.user.value);

  // MAP ON EACH EVENT FROM REDUCER LOCATION AND RETURN A MARKER
  const eachEvent = location.map((ev, i) => {
    return (
      <Marker
        key={i}
        coordinate={{ latitude: ev.latitude, longitude: ev.longitude }}
        title={ev.userId[0].firstname}
        description={ev.sport}
      />
    );
  });

  return (
    <ImageBackground
      style={styles.imgBackground}
      source={require("../../assets/background.jpg")}
    >
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <View style={styles.userInfoContainer}>
            <View style={styles.image}></View>
            <View style={styles.userInfo}>
              <Text style={styles.textsmallname}>{user.firstname}</Text>
              <Text style={styles.textsmallname}>City</Text>
            </View>
          </View>

          <View style={styles.messageContainer}>
            <TouchableOpacity
              onPress={() => navigation.navigate("MessageScreen")}
            >
              <FontAwesomeIcon icon={faEnvelope} size={35} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.mapContainer}>
          <MapView style={styles.map} region={user.location}>
            {user.location && (
              <Marker
                coordinate={user.location}
                title={user.firstname}
                description="Your position"
                pinColor="blue"
              />
            )}
            {eachEvent}
          </MapView>
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
  mapContainer: {
    width: "100%",
    height: "90%",
  },
  map: {
    flex: 1,
    borderRadius: 10,
  },
  //   TEXT
  text: {
    fontSize: 40,
  },
});

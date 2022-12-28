import {
  Image,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ImageBackground,
  Alert,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faStar, faLocationDot } from "@fortawesome/free-solid-svg-icons";

export default function EventScreen({ navigation }) {
  const [hasPermission, setHasPermission] = useState(false);
  const [eventPosition, setEventPosition] = useState(null);

  const [isMyEvent, setIsMyEvent] = useState(false);
  const [isParticipate, setIsParticipate] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  const event = useSelector((state) => state.event.value);
  const user = useSelector((state) => state.user.value);

  // USE EFFECT FOR GETTING THE COORDINATE (FOR THE MARKER) OF THE EVENT
  useEffect(() => {
    const position = {
      latitude: event.latitude,
      longitude: event.longitude,
      latitudeDelta: 0.03,
      longitudeDelta: 0.007,
    };
    setEventPosition(position);
    setHasPermission(true);
  }, []);

  if (!hasPermission) {
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    );
  }

  //  PARTICIPATE TO A EVENT CONFIRM
  const handleParticipate = () => {
    const body = {
      token: user.token,
      eventsId: event.eventId,
    };
    fetch("https://msp-backend-gold.vercel.app/events/participate", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.result) {
          Alert.alert(
            "Confirmation :",
            "Your inscription has been confirmed:)",
            { cancelable: true }
          );
          navigation.navigate("HomeNavigator");
        }
      });
  };
  // delete an event
  const handleDelete = () => {
    const body = {
      token: user.token,
      eventsId: event.eventId,
    };
    fetch("https://msp-backend-gold.vercel.app/events/", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.result) {
          Alert.alert("Confirmation :", "Your event has been deleted", {
            cancelable: true,
          });
          navigation.navigate("HomeNavigator");
        }
      });
  };

  //unsuscribe an event
  const handleUnsuscribe = () => {
    const body = {
      token: user.token,
      eventsId: event.eventId,
    };
    fetch("https://msp-backend-gold.vercel.app/events/participate", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.result) {
          Alert.alert("Confirmation :", "You are successfully unsubscribed", {
            cancelable: true,
          });
          navigation.navigate("HomeNavigator");
        }
      });
  };

  // FUNCTION TO ADD FAVORITE
  const handleFavorites = () => {
    const body = {
      token: user.token,
      eventsId: event.eventId,
    };
    fetch("https://msp-backend-gold.vercel.app/events/favorites", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.result) {
          Alert.alert(
            "Confirmation :",
            "This event has been added to your favorites !",
            { cancelable: true }
          );
          setIsFavorite(true);
        }
      });
  };

  // FUNCTION DELETE TO FAVORITE
  const handleDeleteFavorites = () => {
    const body = {
      token: user.token,
      eventsId: event.eventId,
    };
    fetch("https://msp-backend-gold.vercel.app/events/favorites", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.result) {
          Alert.alert(
            "Confirmation :",
            "This event has been deleted from your favorites !",
            { cancelable: true }
          );
          setIsFavorite(false);
        }
      });
  };

  // IS MY EVENT ? PARTICIPATE ? FAVORITE ?
  fetch(`https://msp-backend-gold.vercel.app/users/${user.token}`)
    .then((response) => response.json())
    .then((data) => {
      for (let i = 0; i < data.userInfo.events.length; i++) {
        if (data.userInfo.events[i]._id === event.eventId) {
          setIsMyEvent(true);
        }
      }
      for (let i = 0; i < data.userInfo.participate.length; i++) {
        if (data.userInfo.participate[i]._id === event.eventId) {
          setIsParticipate(true);
        }
      }
      for (let i = 0; i < data.userInfo.favorites.length; i++) {
        if (data.userInfo.favorites[i]._id === event.eventId) {
          setIsFavorite(true);
        }
      }
    });

  // BTN UNSUSCRIBE
  const unsuscribe = (
    <TouchableOpacity
      style={styles.confirmBtn}
      onPress={() => handleUnsuscribe()}
    >
      <Text style={styles.textButton}>UNSUSCRIBE</Text>
    </TouchableOpacity>
  );

  // BTN DELETE
  const deleteEvent = (
    <TouchableOpacity style={styles.confirmBtn} onPress={() => handleDelete()}>
      <Text style={styles.textButton}>DELETE</Text>
    </TouchableOpacity>
  );

  // BTN STAR AND FAVORITE
  const buttonStar = (
    <TouchableOpacity
      style={styles.confirmBtn}
      onPress={() => handleFavorites()}
    >
      <FontAwesomeIcon style={styles.textButton} icon={faStar} size={26} />
    </TouchableOpacity>
  );

  const buttonStarFav = (
    <TouchableOpacity
      style={styles.favoriteBtn}
      onPress={() => handleDeleteFavorites()}
    >
      <FontAwesomeIcon style={styles.textFavorite} icon={faStar} size={26} />
    </TouchableOpacity>
  );

  // BTN CONFIRM
  const buttonConfirm = (
    <TouchableOpacity
      style={styles.confirmBtn}
      onPress={() => handleParticipate()}
    >
      <Text style={styles.textButton}>CONFIRM</Text>
    </TouchableOpacity>
  );

  // PAGE >>>>>>>>>>>
  return (
    <ImageBackground
      style={styles.imgBackground}
      source={require("../../assets/background.jpg")}
    >
      <View style={styles.container}>
        {/* HEADER */}
        <View style={styles.headerContainer}>
          <View style={styles.userInfoContainer}>
            <View style={styles.image}></View>
            <View style={styles.userInfo}>
              <Text style={styles.textsmallname}>{event.username}</Text>
              <Text style={styles.textsmallname}>{event.level}</Text>
            </View>
          </View>

          <View style={styles.reviewsContainer}>
            <View style={styles.starsContainer}>
              <FontAwesomeIcon icon={faStar} size={18} />
              <FontAwesomeIcon icon={faStar} size={18} />
              <FontAwesomeIcon icon={faStar} size={18} />
            </View>
            <Text>See all reviews</Text>
          </View>
        </View>
        {/* MAP */}
        <View style={styles.mapContainer}>
          <MapView style={styles.map} region={eventPosition}>
            <Marker
              coordinate={eventPosition}
              title={event.username}
              description={event.sport}
              pinColor="orange"
            />
          </MapView>
        </View>
        {/* EVENT INFO (SPORT, DATE) */}
        <View style={styles.informationContainer}>
          <Text style={styles.infoText}>{event.sport}</Text>
          <Text style={styles.infoText}>
            {event.date} - {event.hour}
          </Text>
        </View>
        {/* ADDRESS */}
        <View style={styles.addressContainer}>
          <FontAwesomeIcon icon={faLocationDot} size={22} />
          <Text style={styles.addressText}>{event.address}</Text>
        </View>
        {/* DESCRIPTION */}
        <View style={styles.descriptionContainer}>
          <Text style={styles.descriptionText}>{event.description}</Text>
        </View>
        {/* BTN STAR AND CONFIRM */}
        <View style={styles.buttonContainer}>
          {isMyEvent ? deleteEvent : false}
          {isParticipate ? unsuscribe : false}
          {!isMyEvent && !isParticipate && !isFavorite ? buttonStar : false}
          {isFavorite ? buttonStarFav : false}
          {!isMyEvent && !isParticipate ? buttonConfirm : false}
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
  // HEADER
  headerContainer: {
    width: "100%",
    height: "12%",
    marginTop: 45,
    paddingLeft: 10,
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
    borderRadius: 100,
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
  reviewsContainer: {
    flexDirection: "row",
  },
  starsContainer: {
    flexDirection: "row",
  },
  // MAP
  mapContainer: {
    width: "97%",
    height: "30%",
    borderWidth: 2,
    borderColor: "#E74C3C",
    borderRadius: 10,
  },
  map: {
    flex: 1,
    borderRadius: 10,
  },
  //
  informationContainer: {
    width: "100%",
    height: "7%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 15,
  },
  //
  addressContainer: {
    flex: 1,
    width: "100%",
    height: "5%",
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 15,
    flexWrap: "wrap",
  },
  //
  descriptionContainer: {
    width: "100%",
    height: "22%",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 5,
    marginBottom: 10,
  },
  descriptionText: {
    width: 350,
    height: "95%",
    borderColor: "#E74C3C",
    borderWidth: 1,
    borderRadius: 10,
    fontSize: 16,
    backgroundColor: "white",
    paddingHorizontal: 10,
    fontFamily: "Poppins-Regular",
  },
  //
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    width: "100%",
    height: "8%",
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  confirmBtn: {
    alignItems: "center",
    justifyContent: "center",
    width: "30%",
    height: "85%",
    backgroundColor: "#E74C3C",
    borderRadius: 10,
    marginRight: 10,
  },
  favoriteBtn: {
    alignItems: "center",
    justifyContent: "center",
    width: "30%",
    height: "85%",
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#E74C3C",
    borderRadius: 10,
    marginRight: 10,
  },
  textFavorite: {
    color: "#E74C3C",
    fontWeight: "600",
    fontSize: 16,
    fontFamily: "Poppins-Regular",
  },
  textButton: {
    color: "#ffffff",
    fontWeight: "600",
    fontSize: 16,
    fontFamily: "Poppins-Regular",
  },
  //   TEXT
  infoText: {
    fontFamily: "Poppins-Medium",
    fontSize: 23,
    backgroundColor: "white",
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 20,
  },
  addressText: {
    fontFamily: "Poppins-Medium",
    fontSize: 17,
    backgroundColor: "white",
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 20,
    marginLeft: 8,
    textDecorationLine: "underline",
  },
  text: {
    fontSize: 40,
  },
  textsmall: {
    fontSize: 20,
  },
});

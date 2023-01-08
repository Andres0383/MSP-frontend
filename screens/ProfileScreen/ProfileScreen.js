import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  View,
  Modal,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  Alert,
  ScrollView,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect, useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faStar,
  faPenToSquare,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { useFocusEffect } from "@react-navigation/native";
import { transferEvent } from "../../reducers/event";

export default function ProfileScreen({ navigation }) {
  const user = useSelector((state) => state.user.value);
  const dispatch = useDispatch();

  const [hasPermission, setHasPermission] = useState(false);

  const [userEvents, setUserEvents] = useState([]);
  const [userParticipate, setUserParticipate] = useState([]);
  const [userSports, setUserSports] = useState([]);
  const [userFavorite, setUserFavorite] = useState([]);
  const [userDescription, setUserDescription] = useState("");
  const [userLevel, setUserLevel] = useState("");
  const [userDateBirth, setUserDateBirth] = useState(0);

  const [descriptionModal, setDescriptionModal] = useState(false);
  const [favoriteModal, setFavoriteModal] = useState(false);

  // GET USER INFO FROM DATABASE
  useFocusEffect(
    useCallback(() => {
      fetch(`https://msp-backend-gold.vercel.app/users/${user.token}`)
        .then((response) => response.json())
        .then((data) => {
          if (data.result) {
            setUserFavorite(data.userInfo.favorites);
            setUserSports(data.userInfo.sport);
            setUserDateBirth(data.userInfo.dateOfBirth);
            setUserDescription(data.userInfo.description);
            setUserLevel(data.userInfo.level);
            setUserEvents(data.userInfo.events);
            setUserParticipate(data.userInfo.participate);
          }
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

  // MAP TO GET AND DISPLAY ALL THE SPORT SELECTED IN THE DB
  const eachUserSport = userSports.map((sport, i) => {
    return (
      <Text key={i} style={styles.eachTextSport}>
        {sport}
      </Text>
    );
  });

  // MAP TO GET AND DISPLAY ALL THE USER FAVORITE
  const eachUserFavorite = userFavorite.map((favorite, i) => {
    const transferEventData = {
      eventId: favorite._id,
      level: favorite.user[0].level,
      username: favorite.user[0].firstname,
      sport: favorite.sport,
      date: favorite.date.slice(5, 10),
      hour: favorite.hour.slice(11, 16),
      description: favorite.description,
      latitude: favorite.latitude,
      longitude: favorite.longitude,
      address: favorite.address,
    };
    const handleGoEvent = () => {
      dispatch(transferEvent(transferEventData));
      navigation.navigate("Event");
      setFavoriteModal(!favoriteModal);
    };
    return (
      <View key={i} style={styles.eachFavContainer}>
        <TouchableOpacity key={i} onPress={() => handleGoEvent()}>
          <Text key={i} style={styles.eachFavoriteText}>
            {favorite.sport} with {favorite.user[0].firstname},{" "}
            {favorite.date.slice(5, 10)} at {favorite.hour.slice(11, 16)}
          </Text>
        </TouchableOpacity>
      </View>
    );
  });

  // GET THE USER's AGE FOR HEADER
  const getAge = (stringDate) => {
    const today = new Date();
    const birthDate = new Date(stringDate);
    const yearsDifference = today.getFullYear() - birthDate.getFullYear();
    if (
      today.getMonth() < birthDate.getMonth() ||
      (today.getMonth() === birthDate.getMonth() &&
        today.getDate() < birthDate.getDate())
    ) {
      return yearsDifference - 1;
    }
    return yearsDifference;
  };

  // MODAL TO MODIFY THE DESCRIPTION
  const showDescriptionModal = () => {
    setDescriptionModal(!descriptionModal);
  };

  // MODAL TO DISPLAY FAVORITES
  const showFavoriteModal = () => {
    setFavoriteModal(!favoriteModal);
  };

  // SEND THE USER DESCRIPTION TO DB
  const sendDescription = () => {
    const body = {
      token: user.token,
      description: userDescription,
    };
    fetch("https://msp-backend-gold.vercel.app/users/description", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.result) {
          Alert.alert(
            "Confirmation :",
            "Your description has been modified :)",
            { cancelable: true }
          );
        }
      });
    setDescriptionModal(!descriptionModal);
  };

  // .MAP TO GET AND DISPLAY ALL THE EVENTS CREATED BY THE USER
  const eachUserEvent = userEvents.map((event, i) => {
    return (
      <View key={i} style={styles.eachEventContainer}>
        <Text style={styles.eventText}>{event.date.slice(5, 10)}</Text>
        <Text style={styles.eventText}>{event.sport}</Text>
        <Text style={styles.eventText}>{event.hour.slice(11, 16)}</Text>
      </View>
    );
  });

  // .MAP TO GET AND DISPLAY ALL THE PARTICIPATION OF THE USER
  const eachUserParticipate = userParticipate.map((event, i) => {
    return (
      <View key={i} style={styles.eachEventContainer}>
        <Text style={styles.eventText}>{event.date.slice(5, 10)}</Text>
        <Text style={styles.eventText}>{event.sport}</Text>
        <Text style={styles.eventText}>{event.hour.slice(11, 16)}</Text>
      </View>
    );
  });

  // BACK UP IF NO EVENTS CREATED OR NO PARTICIPATION
  let noEvents = (
    <View style={styles.eachEventContainer}>
      <Text style={styles.eventText}>No events ongoing!</Text>
    </View>
  );

  let noParticipate = (
    <View style={styles.eachEventContainer}>
      <Text style={styles.eventText}>No participation ongoing!</Text>
    </View>
  );

  // PAGE >>>>>>>>>
  return (
    <ImageBackground
      style={styles.imgBackground}
      source={require("../../assets/background.jpg")}
    >
      <View style={styles.container}>
        {/* MODAL FOR USER DESCRIPTION */}
        <Modal visible={descriptionModal} animationType="fade" transparent>
          <KeyboardAvoidingView
            style={{ flex: 1, justifyContent: "flex-end" }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
          >
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <Text style={styles.textTitleSml}>
                  Enter here your new description :
                </Text>

                <TextInput
                  onChangeText={(value) => {
                    setUserDescription(value);
                  }}
                  value={userDescription}
                  placeholder="Enter a new description about yourself"
                  placeholderTextColor="#ccd1e8"
                  style={styles.descriptionInput}
                  multiline={true}
                />

                <View style={styles.modalBtnContainer}>
                  <TouchableOpacity
                    style={styles.modalBtn}
                    onPress={() => showDescriptionModal()}
                  >
                    <Text style={styles.modalTextBtn}>CANCEL</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.modalBtn}
                    onPress={() => sendDescription()}
                  >
                    <Text style={styles.modalTextBtn}>CONFIRM</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </KeyboardAvoidingView>
        </Modal>
        {/* MODAL TO DISPLAY FAVORITES */}
        <Modal visible={favoriteModal} animationType="fade" transparent>
          <View style={styles.centeredView}>
            <View style={styles.modalFavoriteView}>
              <View style={styles.xmarkContainer}>
                <TouchableOpacity onPress={() => showFavoriteModal()}>
                  <FontAwesomeIcon icon={faXmark} size={26} />
                </TouchableOpacity>
              </View>

              <Text style={styles.textTitleSml}>Your favorites :</Text>

              <View style={styles.favoritesListing}>{eachUserFavorite}</View>
            </View>
          </View>
        </Modal>
        {/* HEADER */}
        <View style={styles.headerContainer}>
          <View style={styles.userInfoContainer}>
            <View style={styles.image}></View>
            <View style={styles.userInfo}>
              <Text style={styles.textsmallname}>{user.firstname}</Text>
              <Text style={styles.textsmallinfo}>Nice</Text>
              <Text style={styles.textsmallinfo}>
                {getAge(userDateBirth)} years old
              </Text>
              <Text style={styles.textsmallinfo}>{userLevel}</Text>
            </View>
          </View>
        </View>
        {/* REVIEWS */}
        <View style={styles.reviewsContainer}>
          <View style={styles.starsContainer}>
            <FontAwesomeIcon icon={faStar} size={20} />
            <FontAwesomeIcon icon={faStar} size={20} />
            <FontAwesomeIcon icon={faStar} size={20} />
          </View>
          <Text>See all reviews</Text>
        </View>
        {/* DESCRIPTION */}
        <View style={styles.descriptionContainer}>
          <Text
            style={styles.descriptionText}
            onPress={() => showDescriptionModal()}
          >
            {userDescription}
          </Text>
        </View>
        {/* MY SPORTS */}
        <View style={styles.sportContainer}>
          <Text style={styles.textTitle}>Sports :</Text>
          <View style={styles.mySports}>{eachUserSport}</View>
        </View>
        {/* MY EVENTS */}
        <View style={styles.myEventContainer}>
          <Text style={styles.textTitle}>My events :</Text>
          <ScrollView style={{ width: "98%" }}>
            <View style={styles.listOfEvents}>
              {eachUserEvent.length === 0 ? noEvents : eachUserEvent}
            </View>
          </ScrollView>
        </View>
        {/* PARTICIPATE TO */}
        <View style={styles.eventContainer}>
          <Text style={styles.textTitle}>My participation :</Text>
          <ScrollView style={{ width: "98%" }}>
            <View style={styles.listOfEvents}>
              {eachUserParticipate.length === 0
                ? noParticipate
                : eachUserParticipate}
            </View>
          </ScrollView>
        </View>
        {/* FAVORITES */}
        <View style={styles.favsContainer}>
          <Text style={styles.textTitle}>My Favorites :</Text>
          <TouchableOpacity
            onPress={() => showFavoriteModal()}
            style={styles.favoriteBtn}
          >
            <FontAwesomeIcon
              style={styles.textFavorite}
              icon={faStar}
              size={26}
            />
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
  // DESCRIPTION MODAL
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    backgroundColor: "white",
    width: "80%",
    height: "50%",
    borderRadius: 20,
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  descriptionInput: {
    width: "90%",
    height: "40%",
    borderColor: "#E74C3C",
    borderWidth: 1,
    borderRadius: 10,
    fontSize: 16,
    backgroundColor: "white",
    paddingLeft: 10,
    marginTop: 10,
  },
  modalBtnContainer: {
    flexDirection: "row",
    height: "30%",
    marginTop: 7,
  },
  modalBtn: {
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 10,
    padding: 7,
    backgroundColor: "#E74C3C",
    borderRadius: 10,
    height: "70%",
  },
  modalTextBtn: {
    color: "#ffffff",
    fontWeight: "600",
    fontSize: 15,
    fontFamily: "Poppins-Medium",
  },
  // FAVORITE MODAL
  modalFavoriteView: {
    backgroundColor: "white",
    width: "80%",
    height: "50%",
    borderRadius: 20,
    padding: 10,
    alignItems: "center",
    justifyContent: "flex-start",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  xmarkContainer: {
    width: "100%",
    height: "7%",
    alignItems: "flex-end",
  },
  favoritesListing: {
    margin: 30,
    width: "100%",
    height: "10%",
    justifyContent: "center",
    alignItems: "center",
  },
  eachFavContainer: {
    borderBottomWidth: 1,
    borderBottomColor: "#E74C3C",
    height: "80%",
    marginTop: 20,
  },
  eachFavoriteText: {
    fontSize: 15,
    fontFamily: "Poppins-Medium",
  },
  // HEADER
  headerContainer: {
    width: "100%",
    height: "20%",
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
    width: "43%",
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
    fontFamily: "Poppins-SemiBold",
    color: "#E74C3C",
  },
  textsmallinfo: {
    backgroundColor: "white",
    fontSize: 15,
    marginBottom: 4,
    paddingLeft: 20,
    fontFamily: "Poppins-Regular",
    color: "#E74C3C",
  },
  // REVIEWS
  reviewsContainer: {
    width: "100%",
    height: "4%",
    paddingHorizontal: 40,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "lightgrey",
  },
  starsContainer: {
    flexDirection: "row",
    marginRight: 15,
  },
  // DESCRIPTION
  descriptionContainer: {
    width: "100%",
    height: "13%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  descriptionText: {
    width: 330,
    height: "90%",
    borderColor: "#E74C3C",
    borderWidth: 1,
    borderRadius: 10,
    fontSize: 16,
    backgroundColor: "white",
    paddingHorizontal: 10,
    fontFamily: "Poppins-Regular",
  },

  textButton: {
    color: "#ffffff",
    height: 30,
    fontWeight: "600",
    fontSize: 16,
    fontFamily: "Poppins-Bold",
  },
  // SPORT
  sportContainer: {
    width: "100%",
    height: "10%",
    flexDirection: "column",
    alignItems: "center",
  },
  mySports: {
    flexDirection: "row",
    width: "90%",
    justifyContent: "center",
    flexWrap: "wrap",
  },
  eachTextSport: {
    fontFamily: "Poppins-Medium",
    fontSize: 20,
    color: "#E74C3C",
    backgroundColor: "white",
    borderWidth: 2,
    borderColor: "#E74C3C",
    borderRadius: 15,
    paddingHorizontal: 8,
    marginHorizontal: 6,
  },
  // EVENT
  myEventContainer: {
    width: "100%",
    height: "18%",
    marginTop: "5%",
  },
  eventContainer: {
    width: "100%",
    height: "18%",
  },
  listOfEvents: {
    padding: 10,
    height: 100,
  },
  eachEventContainer: {
    backgroundColor: "#E74C3C",
    paddingVertical: 3,
    paddingHorizontal: 15,
    marginBottom: 3,
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 10,
  },
  // FAVS
  favsContainer: {
    width: "100%",
    height: "7%",
    flexDirection: "row",
    alignItems: "center",
  },
  favoriteBtn: {
    alignItems: "center",
    justifyContent: "center",
    width: "25%",
    height: "80%",
    backgroundColor: "#E74C3C",
    borderRadius: 10,
    marginRight: 10,
    marginLeft: 90,
  },
  textFavorite: {
    color: "white",
    fontWeight: "600",
    fontSize: 16,
    fontFamily: "Poppins-Regular",
  },
  //   TEXT
  textTitle: {
    fontFamily: "Poppins-Medium",
    fontSize: 26,
    backgroundColor: "white",
  },
  textTitleSml: {
    fontFamily: "Poppins-Medium",
    fontSize: 20,
    backgroundColor: "white",
  },
  eventText: {
    fontFamily: "Poppins-Regular",
    fontSize: 15,
    color: "white",
  },
});

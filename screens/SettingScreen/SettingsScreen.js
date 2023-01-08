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
} from "react-native";
import { logout } from "../../reducers/user";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons/";

export default function SettingScreen({ navigation }) {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.value);

  const [deleteAccountModal, setDeleteAccountModal] = useState(false);
  const [feedbackModal, setFeedbackModal] = useState(false);

  const [userComment, setUserComment] = useState("");
  const [personalNote, setPersonalNote] = useState(0);

  const showDeleteAccountModal = () => {
    setDeleteAccountModal(!deleteAccountModal);
  };

  const showFeedbackModal = () => {
    setFeedbackModal(!feedbackModal);
  };

  const handleCancel = () => {
    setDeleteAccountModal(false);
    setFeedbackModal(false);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigation.navigate("Login");
  };

  const handleEditPreference = () => {
    navigation.navigate("EditPreference");
  };

  const handleEditProfile = () => {
    navigation.navigate("EditProfile");
  };

  const handleDeleteAccount = () => {
    const body = {
      token: user.token,
    };
    console.log(handleDeleteAccount);
    fetch("https://msp-backend-gold.vercel.app/users/delete", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        if (data.result) {
          navigation.navigate("Login");
          Alert.alert("Confirmation :", "Your account has been deleted", {
            cancelable: true,
          });
        }
      });
  };

  const handleFeedback = () => {
    const body = {
      token: user.token,
      note: personalNote,
      comment: userComment,
    };
    fetch("https://msp-backend-gold.vercel.app/feedbacks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.result) {
          Alert.alert("Confirmation :", "Thanks for your help :)", {
            cancelable: true,
          });
        }
      });
    setFeedbackModal(!feedbackModal);
  };

  const personalStars = [];

  let style = { color: "black" };
  for (let i = 0; i < 5; i++) {
    style;
    if (i < personalNote) {
      style = { color: "#E74C3C" };
    }

    personalStars.push(
      <TouchableOpacity onPress={() => setPersonalNote(i + 1)}>
        <FontAwesomeIcon icon={faStar} key={i} size={25} style={style} />
      </TouchableOpacity>
    );
  }

  return (
    <ImageBackground
      style={styles.imgBackground}
      source={require("../../assets/background.jpg")}
    >
      <View style={styles.container}>
        {/*modal for delete account*/}
        <Modal visible={deleteAccountModal} animationType="fade" transparent>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.titleModal}>
                Are you sure you want to delete your account ?
              </Text>
              <View>
                <View style={styles.buttons}>
                  <TouchableOpacity
                    onPress={() => handleCancel()}
                    style={styles.cancelButton}
                  >
                    <Text style={styles.textButton}>CANCEL </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => handleDeleteAccount()}
                    style={styles.confirmButton}
                  >
                    <Text style={styles.textButton}>CONFIRM </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </Modal>

        {/*modal for feedback*/}
        <Modal visible={feedbackModal} animationType="fade" transparent>
          <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
          >
            <View style={styles.centeredView}>
              <View style={styles.modalFeedback}>
                <Text style={styles.titleFeedback}>
                  Give us your opinion : {personalNote}
                </Text>
                <View>
                  <View style={styles.starsContainer}>{personalStars}</View>

                  <TextInput
                    onChangeText={(value) => {
                      setUserComment(value);
                    }}
                    value={userComment}
                    placeholder="Help us improve ..."
                    placeholderTextColor="#ccd1e8"
                    multiline={true}
                    style={styles.commentInput}
                  />

                  <View style={styles.feedbackButtonsContainer}>
                    <TouchableOpacity
                      onPress={() => handleCancel()}
                      style={styles.feedbackButtons}
                    >
                      <Text style={styles.textButton}>CANCEL </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => handleFeedback()}
                      style={styles.feedbackButtons}
                    >
                      <Text style={styles.textButton}>OK </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          </KeyboardAvoidingView>
        </Modal>
        <View style={styles.buttonsContainer}>
          <TouchableOpacity
            style={styles.settingBtn}
            onPress={() => handleEditPreference()}
          >
            <Text style={styles.settingText}>EDIT YOUR PREFERENCE</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.settingBtn}
            onPress={() => handleEditProfile()}
          >
            <Text style={styles.settingText}>EDIT YOUR PROFILE</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.settingBtn}
            onPress={() => showFeedbackModal()}
          >
            <Text style={styles.settingText}>FEEDBACK</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.settingBtn}
            onPress={() => handleLogout()}
          >
            <Text style={styles.settingText}>LOGOUT</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.deleteBtn}>
          <Text
            style={styles.deleteText}
            onPress={() => showDeleteAccountModal()}
          >
            DELETE ACCOUNT
          </Text>
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
    justifyContent: "center",
    marginBottom: "10%",
  },
  buttonsContainer: {
    justifyContent: "space-between",
    marginTop: 100,
  },
  starsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  //   TEXT
  text: {
    fontSize: 40,
  },
  deleteBtn: {
    alignItems: "center",
    marginTop: 100,
    backgroundColor: "white",
  },
  deleteText: {
    color: "#E74C3C",
    fontWeight: "600",
    textDecorationLine: "underline #E74C3C",
    fontSize: 25,
    fontFamily: "Poppins-Light",
  },
  settingBtn: {
    alignItems: "center",
    justifyContent: "center",
    width: 350,
    height: "14%",
    backgroundColor: "#E74C3C",
    borderRadius: 20,
    marginTop: 50,
  },
  settingText: {
    color: "#ffffff",
    fontWeight: "600",
    fontSize: 25,
    fontFamily: "Poppins-Light",
  },
  confirmButton: {
    alignItems: "center",
    justifyContent: "center",
    width: "40%",
    height: "65%",
    backgroundColor: "#E74C3C",
    borderRadius: 10,
    marginTop: 25,
  },
  cancelButton: {
    alignItems: "center",
    justifyContent: "center",
    width: "40%",
    height: "65%",
    backgroundColor: "#E74C3C",
    borderRadius: 10,
    marginTop: 25,
  },
  textButton: {
    color: "#ffffff",
    fontWeight: "600",
    fontSize: 16,
    fontFamily: "Poppins-Bold",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    backgroundColor: "white",
    width: "80%",
    height: "25%",
    minHeight: "25%",
    maxHeight: "75%",
    borderRadius: 20,
    padding: 20,
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
  buttons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  titleModal: {
    fontFamily: "Poppins-Medium",
    fontSize: 20,
    color: "black",
    backgroundColor: "white",
  },
  titleFeedback: {
    fontFamily: "Poppins-Medium",
    fontSize: 20,
    color: "black",
    backgroundColor: "white",
  },
  modalFeedback: {
    backgroundColor: "white",
    minHeight: "50%",
    height: "50%",

    borderRadius: 20,
    padding: 20,
    alignItems: "center",

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  commentInput: {
    alignItems: "center",
    width: 300,
    height: "30%",
    borderColor: "#E74C3C",
    borderWidth: 1,
    borderRadius: 10,
    fontSize: 16,
    backgroundColor: "white",
    paddingLeft: 10,
    marginTop: 20,
  },
  feedbackButtons: {
    alignItems: "center",
    justifyContent: "center",
    width: "40%",
    height: 40,
    backgroundColor: "#E74C3C",
    borderRadius: 10,
  },

  feedbackButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
});

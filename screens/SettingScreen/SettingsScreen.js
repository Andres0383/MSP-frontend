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
  Alert,
} from "react-native";
import { logout } from "../../reducers/user";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";

export default function SettingScreen({ navigation }) {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.value);

  const [deleteAccountModal, setDeleteAccountModal] = useState(false);

  const showDeleteAccountModal = () => {
    setDeleteAccountModal(!deleteAccountModal);
  };

  const handleCancel = () => {
    setDeleteAccountModal(false);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigation.navigate("Login");
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

  const handleEditPreference = () => {
    navigation.navigate("EditPreference");
  };

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
            onPress={() => handleEditFeedback()}
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
});

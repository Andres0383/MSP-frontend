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

export default function SettingScreen({ navigation }) {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.value);

  const handleLogout = () => {
    dispatch(logout());
    navigation.navigate("Login");
  };

  const handleDeleteAccount = () => {
    const body = {
      token: user.token,
    };
    fetch("https://msp-backend-gold.vercel.app/users/delete", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.result) {
          Alert.alert("Confirmation :", "Your account has been deleted", {
            cancelable: true,
          });
          navigation.navigate("Login");
        }
      });
  };

  const handleEditProfile = () => {
    navigation.navigate("EditProfile");
  };

  return (
    <ImageBackground
      style={styles.imgBackground}
      source={require("../../assets/background.jpg")}
    >
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.editBtn}
          onPress={() => handleEditProfile()}
        >
          <Text style={styles.editText}>EDIT YOUR PROFILE</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.logoutBtn}
          onPress={() => handleLogout()}
        >
          <Text style={styles.logoutText}>LOGOUT</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.deleteBtn}
          onPress={() => handleDeleteAccount()}
        >
          <Text style={styles.deleteText}>DELETE ACCOUNT</Text>
        </TouchableOpacity>
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
  //   TEXT
  text: {
    fontSize: 40,
  },
  logoutBtn: {
    alignItems: "center",
    justifyContent: "center",
    width: "80%",
    height: "10%",
    backgroundColor: "#E74C3C",
    borderRadius: 20,
    marginTop: 50,
  },
  logoutText: {
    color: "#ffffff",
    fontWeight: "600",
    fontSize: 25,
    fontFamily: "Poppins-Light",
  },
  deleteBtn: {
    alignItems: "center",
    justifyContent: "center",
    width: "80%",
    height: "10%",
    backgroundColor: "#E74C3C",
    borderRadius: 20,
    marginTop: 50,
  },
  deleteText: {
    color: "#ffffff",
    fontWeight: "600",
    fontSize: 25,
    fontFamily: "Poppins-Light",
  },
  editBtn: {
    alignItems: "center",
    justifyContent: "center",
    width: "80%",
    height: "10%",
    backgroundColor: "#E74C3C",
    borderRadius: 20,
    marginTop: "30%",
  },
  editText: {
    color: "#ffffff",
    fontWeight: "600",
    fontSize: 25,
    fontFamily: "Poppins-Light",
  },
});

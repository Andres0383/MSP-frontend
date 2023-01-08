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
} from "react-native";
import { useState } from "react";
import { signIn, signUp } from "../../reducers/user";
import { useDispatch } from "react-redux";
import DiscoverBtn from "./DiscoverBtn";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons/faXmark";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons/";

export default function LoginScreen({ navigation }) {
  const dispatch = useDispatch();

  const [signInModal, setSignInModal] = useState(false);
  const [signUpModal, setSignUpModal] = useState(false);

  const [signUpFirstname, setSignUpFirstname] = useState("");
  const [signUpPassword, setSignUpPassword] = useState("");
  const [signUpMail, setSignUpMail] = useState("");

  const [signInMail, setSignInMail] = useState("");
  const [signInPassword, setSignInPassword] = useState("");

  const [signinEmailError, setsigninEmailError] = useState(false);
  const [signupEmailError, setsignupEmailError] = useState(false);

  const [wrongPassword, setWrongPassword] = useState("");
  const [userAlreadyExist, setUserAlreadyExist] = useState("");

  const [isSecure, setIsSecure] = useState(false);
  const [signinPasswordVisible, setSigninPasswordVisible] = useState(false);
  const [signupPasswordVisible, setSignupPasswordVisible] = useState(false);

  const handlePasswordSignin = () => {
    setSigninPasswordVisible(!signinPasswordVisible);
    setIsSecure(!isSecure);
  };

  const passwordSigninVisible = (
    <TouchableOpacity style={styles.eye} onPress={() => handlePasswordSignin()}>
      <FontAwesomeIcon icon={faEye} size={20} />
    </TouchableOpacity>
  );

  const passwordSigninInvisible = (
    <TouchableOpacity style={styles.eye} onPress={() => handlePasswordSignin()}>
      <FontAwesomeIcon icon={faEyeSlash} size={20} />
    </TouchableOpacity>
  );

  const handlePasswordSignup = () => {
    setSignupPasswordVisible(!signupPasswordVisible);
    setIsSecure(!isSecure);
  };

  const passwordSignupVisible = (
    <TouchableOpacity style={styles.eye} onPress={() => handlePasswordSignup()}>
      <FontAwesomeIcon icon={faEye} size={20} />
    </TouchableOpacity>
  );

  const passwordSignupInvisible = (
    <TouchableOpacity style={styles.eye} onPress={() => handlePasswordSignup()}>
      <FontAwesomeIcon icon={faEyeSlash} size={20} />
    </TouchableOpacity>
  );

  const showSigninModal = () => {
    setSignInModal(!signInModal);
  };

  const showSignupModal = () => {
    setSignUpModal(!signUpModal);
  };

  const EMAIL_REGEX = RegExp(
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  );

  const handleSignIn = () => {
    const body = { email: signInMail, password: signInPassword };
    if (EMAIL_REGEX.test(signInMail)) {
      fetch("https://msp-backend-gold.vercel.app/users/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.result) {
            dispatch(
              signIn({
                firstname: data.firstname,
                email: data.email,
                token: data.token,
              })
            );
            setSignInMail("");
            setSignInPassword("");
            setSignInModal(!signInModal);
            navigation.navigate("TabNavigator");
          } else {
            setWrongPassword(data.error);
          }
        });
    } else {
      setsigninEmailError(true);
    }
  };

  const handleSignUp = () => {
    if (EMAIL_REGEX.test(signUpMail)) {
      fetch("https://msp-backend-gold.vercel.app/users/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstname: signUpFirstname,
          email: signUpMail,
          password: signUpPassword,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.result) {
            dispatch(
              signUp({
                firstname: signUpFirstname,
                email: signUpMail,
                token: data.token,
              })
            );
            setSignUpFirstname("");
            setSignUpMail("");
            setSignUpPassword("");
            navigation.navigate("Quizz");
            setSignUpModal(!signUpModal);
          } else {
            setUserAlreadyExist(data.error);
          }
        });
    } else {
      setsignupEmailError(true);
    }
  };

  return (
    <View style={styles.container}>
      {/* MODAL FOR SIGN IN */}
      <Modal visible={signInModal} animationType="fade" transparent>
        <KeyboardAvoidingView
          style={{ flex: 1, justifyContent: "flex-end" }}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <View style={styles.xmarkContainer}>
                <TouchableOpacity onPress={() => showSigninModal()}>
                  <FontAwesomeIcon icon={faXmark} size={26} />
                </TouchableOpacity>
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Email</Text>
                <TextInput
                  autoCapitalize="none"
                  keyboardType="email-address"
                  textContentType="emailAddress"
                  autoComplete="email"
                  style={styles.inputs}
                  placeholderTextColor="#ccd1e8"
                  onChangeText={(value) => {
                    setSignInMail(value);
                  }}
                  value={signInMail}
                  placeholder="Enter your email"
                />
                <View style={styles.password}>
                  <Text style={styles.inputLabel}>Password</Text>
                  {signinPasswordVisible
                    ? passwordSigninInvisible
                    : passwordSigninVisible}
                </View>
                <TextInput
                  autoCapitalize="none"
                  secureTextEntry={!isSecure}
                  style={styles.inputs}
                  placeholderTextColor="#ccd1e8"
                  onChangeText={(value) => {
                    setSignInPassword(value);
                  }}
                  value={signInPassword}
                  placeholder="Enter your password"
                />

                <TouchableOpacity
                  onPress={() => handleSignIn()}
                  style={styles.button}
                  activeOpacity={0.8}
                >
                  <Text style={styles.textButton}>Sign in</Text>
                </TouchableOpacity>
                {signinEmailError && (
                  <Text style={styles.error}>
                    Invalid email or wrong password
                  </Text>
                )}
                <Text style={styles.error}> {wrongPassword}</Text>
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* MODAL FOR SIGN UP */}
      <Modal visible={signUpModal} animationType="fade" transparent>
        <KeyboardAvoidingView
          style={{ flex: 1, justifyContent: "flex-end" }}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <View style={styles.xmarkContainer}>
                <TouchableOpacity onPress={() => showSignupModal()}>
                  <FontAwesomeIcon icon={faXmark} size={26} />
                </TouchableOpacity>
              </View>
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>First name</Text>
                <TextInput
                  style={styles.inputs}
                  placeholderTextColor="#ccd1e8"
                  onChangeText={(value) => {
                    setSignUpFirstname(value);
                  }}
                  value={signUpFirstname}
                  placeholder="Enter your first name"
                />
                <Text style={styles.inputLabel}>Email</Text>
                <TextInput
                  autoCapitalize="none"
                  keyboardType="email-address"
                  textContentType="emailAddress"
                  autoComplete="email"
                  style={styles.inputs}
                  placeholderTextColor="#ccd1e8"
                  onChangeText={(value) => {
                    setSignUpMail(value);
                  }}
                  value={signUpMail}
                  placeholder="Enter your email"
                />
                <View style={styles.password}>
                  <Text style={styles.inputLabel}>Password</Text>
                  {signupPasswordVisible
                    ? passwordSignupInvisible
                    : passwordSignupVisible}
                </View>
                <TextInput
                  autoCapitalize="none"
                  secureTextEntry={!isSecure}
                  style={styles.inputs}
                  placeholderTextColor="#ccd1e8"
                  onChangeText={(value) => {
                    setSignUpPassword(value);
                  }}
                  value={signUpPassword}
                  placeholder="Enter your password"
                />
                <TouchableOpacity
                  onPress={() => handleSignUp()}
                  style={styles.button}
                  activeOpacity={0.8}
                >
                  <Text style={styles.textButton}>Sign Up</Text>
                </TouchableOpacity>
                {signupEmailError && (
                  <Text style={styles.error}>Invalid email address</Text>
                )}
                <Text style={styles.error}>{userAlreadyExist}</Text>
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* REST OF THE PAGE */}
      <View style={styles.headerContainer}>
        <View>
          <Image
            style={styles.image}
            source={require("../../assets/loginimage.jpg")}
          />
        </View>

        <View style={styles.titleContainer}>
          <Text style={styles.title}>Welcome to My Sport Pal !</Text>
          <Text style={styles.text}>
            Only few more steps before meeting your new sport's pal.
          </Text>
        </View>
      </View>

      <View style={styles.signInContainer}>
        <Text style={styles.subText}>Already have an account ?</Text>
        <TouchableOpacity
          onPress={() => showSigninModal()}
          style={styles.button}
          activeOpacity={0.8}
        >
          <Text style={styles.textButton}>Sign in</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.signUpContainer} blurRadius={signInModal ? 4 : 0}>
        <Text style={styles.subText}>First time on My Sport Pal ?</Text>
        <View style={styles.doubleBtnContainer}>
          <TouchableOpacity
            onPress={() => showSignupModal()}
            style={styles.signupButton}
            activeOpacity={0.8}
          >
            <Text style={styles.textButton}>Sign Up</Text>
          </TouchableOpacity>
          <DiscoverBtn />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
  },
  // MODALS STYLE
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    backgroundColor: "white",
    width: "80%",
    minHeight: "25%",
    maxHeight: "75%",
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
  inputContainer: {
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    width: "120%",
    flexShrink: 1,
  },
  inputs: {
    width: "80%",
    height: "10%",
    margin: 20,
    paddingLeft: 10,
    borderBottomColor: "#E74C3C",
    borderBottomWidth: 1,
    fontSize: 16,
  },
  inputLabel: {
    fontFamily: "Poppins-Light",
    fontSize: 15,
  },
  xmarkContainer: {
    width: "100%",
    height: "7%",
    alignItems: "flex-end",
  },
  // REST OF THE PAGE STYLE
  headerContainer: {
    width: "100%",
    height: "60%",
    position: "relative",
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 20,
    opacity: 0.9,
  },
  titleContainer: {
    alignItems: "center",
    justifyContent: "center",
    width: "80%",
    position: "absolute",
    bottom: 30,
    left: 30,
  },
  title: {
    fontSize: 38,
    fontWeight: "700",
    color: "white",
    textShadowColor: "black",
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
    fontFamily: "Poppins-Regular",
  },
  text: {
    fontSize: 20,
    color: "white",
    textShadowColor: "black",
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  subText: {
    fontSize: 20,
    fontFamily: "Poppins-Light",
  },
  signInContainer: {
    marginTop: 20,
    height: "10%",
    width: "100%",
    alignItems: "center",
  },
  button: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 8,

    width: "80%",
    marginTop: 10,
    backgroundColor: "#E74C3C",
    borderRadius: 10,
  },
  textButton: {
    color: "#ffffff",
    height: 30,
    fontWeight: "600",
    fontSize: 16,
    fontFamily: "Poppins-Bold",
  },
  signUpContainer: {
    marginTop: 20,
    top: 20,
    height: "10%",
    width: "100%",
    alignItems: "center",
  },
  signupButton: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 8,
    width: "40%",
    marginTop: 10,
    backgroundColor: "#E74C3C",
    borderRadius: 10,
  },
  doubleBtnContainer: {
    width: "100%",
    flexDirection: "row-reverse",
    justifyContent: "space-around",
  },
  error: {
    marginTop: 10,
    color: "#E74C3C",
  },
  password: {
    flexDirection: "row",
    marginLeft: 50,
  },
  eye: {
    marginLeft: 30,
  },
});

import { SafeAreaProvider } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
// FONTS AND ICONS
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import FontAwesome from "react-native-vector-icons/FontAwesome";
// SCREENS
import LoginScreen from "./screens/01LoginScreen/01LoginScreen";
import QuizzScreen from "./screens/02QuizzScreen/02QuizzScreen";
import HomeScreen from "./screens/03HomeScreen/03HomeScreen";
import ProfileScreen from "./screens/ProfileScreen/ProfileScreen";
import MapScreen from "./screens/MapScreen/MapScreen";
import EventScreen from "./screens/EventScreen/EventScreen";
import MyEventScreen from "./screens/MyEventScreen/MyEventScreen";
import MessageScreen from "./screens/MessagesScreen/MessagesScreen";
import SettingsScreen from "./screens/SettingScreen/SettingsScreen";
import UserScreen from "./screens/ProfileScreen/UserScreen";
import EditPreferenceScreen from "./screens/SettingScreen/EditPreferenceScreen";
import EditProfileScreen from "./screens/SettingScreen/EditProfileScreen";
import { useCallback } from "react";
import { Text } from "react-native";
// REDUCERS
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import user from "./reducers/user";
import location from "./reducers/location";
import event from "./reducers/event";
import goprofile from "./reducers/goprofile";

const store = configureStore({
  reducer: { user, location, event, goprofile },
});

SplashScreen.preventAutoHideAsync();
const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName = "";

          if (route.name === "Map") {
            iconName = "location-arrow";
          } else if (route.name === "Home") {
            iconName = "home";
          } else if (route.name === "Profile") {
            iconName = "user";
          } else if (route.name === "Settings") {
            iconName = "gear";
          }

          return <FontAwesome name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#E74C3C",
        tabBarInactiveTintColor: "#335561",
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={HomeNavigator} />
      <Tab.Screen name="Map" component={MapScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
};

const HomeNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeNavigator" component={HomeScreen} />
      <Stack.Screen name="MessageScreen" component={MessageScreen} />
      <Stack.Screen name="Event" component={EventScreen} />
      <Stack.Screen name="MyEvent" component={MyEventScreen} />
      <Stack.Screen name="UserScreen" component={UserScreen} />
      <Stack.Screen name="EditPreference" component={EditPreferenceScreen} />
      <Stack.Screen name="EditProfile" component={EditProfileScreen} />
    </Stack.Navigator>
  );
};

export default function App() {
  const [fontsLoaded] = useFonts({
    "Poppins-Bold": require("./assets/fonts/Poppins-Bold.ttf"),
    "Poppins-ExtraBold": require("./assets/fonts/Poppins-ExtraBold.ttf"),
    "Poppins-ExtraLight": require("./assets/fonts/Poppins-ExtraLight.ttf"),
    "Poppins-Light": require("./assets/fonts/Poppins-Light.ttf"),
    "Poppins-LightItalic": require("./assets/fonts/Poppins-LightItalic.ttf"),
    "Poppins-Medium": require("./assets/fonts/Poppins-Medium.ttf"),
    "Poppins-Regular": require("./assets/fonts/Poppins-Regular.ttf"),
    "Poppins-SemiBold": require("./assets/fonts/Poppins-SemiBold.ttf"),
    "Poppins-Thin": require("./assets/fonts/Poppins-Thin.ttf"),
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return <Text>Our fonts are not installed in your device... Bye bye !</Text>;
  }

  return (
    <Provider store={store}>
      <SafeAreaProvider onLayout={onLayoutRootView}>
        <NavigationContainer>
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Quizz" component={QuizzScreen} />
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Map" component={MapScreen} />
            <Stack.Screen name="Profile" component={ProfileScreen} />
            <Stack.Screen name="Settings" component={SettingsScreen} />
            <Stack.Screen name="TabNavigator" component={TabNavigator} />
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaProvider>
    </Provider>
  );
}

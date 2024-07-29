import React from "react";
import { BottomNavigation, Text } from "react-native-paper";
import ChatBotScreen from "../../app/(tabs)/ChatBotScreen";
import ProfileScreen from "../../app/(tabs)/ProfileScreen";
import StatsScreen from "../../app/(tabs)/StatsScreen";
import MuscleScreen from "../../app/(tabs)/MuscleScreen";
import GymbroScreen from "../../app/(tabs)/GymbroScreen";

const ProfileRoute = () => <ProfileScreen />;

const ChatRoute = () => <ChatBotScreen />;

const GymbroRoute = () => <GymbroScreen />;

const StatsRoute = () => <StatsScreen />;

const MuscleRoute = () => <MuscleScreen />;

const BottomNavigationBar = () => {
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    {
      key: "gymbro",
      title: "Gymbro",
      focusedIcon: "account-group",
      unfocusedIcon: "account-group-outline",
    },
    {
      key: "stats",
      title: "Stats",
      focusedIcon: "chart-box",
      unfocusedIcon: "chart-box-outline",
    },
    {
      key: "muscles",
      title: "Muscles",
      focusedIcon: "arm-flex",
      unfocusedIcon: "arm-flex-outline",
    },
    {
      key: "chat",
      title: "Chat",
      focusedIcon: "chat-processing",
      unfocusedIcon: "chat-processing-outline",
    },
    {
      key: "profile",
      title: "Perfil",
      focusedIcon: "account-box",
      unfocusedIcon: "account-box-outline",
    },
  ]);

  const renderScene = BottomNavigation.SceneMap({
    muscles: MuscleRoute,
    stats: StatsRoute,
    gymbro: GymbroRoute,
    chat: ChatRoute,
    profile: ProfileRoute,
  });

  return (
    <BottomNavigation
      navigationState={{ index, routes }}
      onIndexChange={setIndex}
      renderScene={renderScene}
      activeColor="white" // color de los iconos activos
      inactiveColor="white" // color de los iconos inactivos
      barStyle={{ backgroundColor: "black" }} // color de fondo
    />
  );
};

export default BottomNavigationBar;

import React from "react";
import { SafeAreaView, StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Home } from "./screens/Home";
import { Offline } from "./screens/Offline";
import type { RootStackParamList } from "./route-types";

const { Navigator, Screen } = createNativeStackNavigator<RootStackParamList>();

function App(): React.JSX.Element {
  return (
    <SafeAreaView style={styles.container}>
      <NavigationContainer>
        <Navigator
          initialRouteName="home"
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: "#FFF6F6" },
          }}>
          <Screen name="home" component={Home} />
          <Screen name="offline" component={Offline} />
        </Navigator>
      </NavigationContainer>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    backgroundColor: "#FFF6F6",
  },
});

export default App;

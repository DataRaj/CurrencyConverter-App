import React, { useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useNetInfo } from "@react-native-community/netinfo";
import { OfflineIcon } from "./offline-icon";
import type { OfflineScreenProps } from "../../route-types";

export function Offline({ navigation }: OfflineScreenProps): JSX.Element {
  const { isConnected } = useNetInfo();

  useEffect(() => {
    if (isConnected === true) {
      navigation.navigate("home");
    }
  }, [isConnected, navigation]);

  return (
    <View style={styles.container}>
      <OfflineIcon />
      <Text style={styles.offlineText}>Offline</Text>
      <Text>Network connection issue...</Text>
      <Text>Check your network connectivity</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },
  offlineText: {
    fontSize: 18,
  },
});

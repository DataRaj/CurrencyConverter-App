import type { NativeStackScreenProps } from "@react-navigation/native-stack";

export type RootStackParamList = {
  home: undefined;
  offline: undefined;
};

export type HomeScreenProps = NativeStackScreenProps<
  RootStackParamList,
  "home"
>;

export type OfflineScreenProps = NativeStackScreenProps<
  RootStackParamList,
  "offline"
>;

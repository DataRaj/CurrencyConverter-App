import { AppRegistry } from "react-native";
import { enablePromise } from "react-native-sqlite-storage";
import { name as appName } from "./app.json";
import App from "./src/App";

enablePromise(true);

AppRegistry.registerComponent(appName, () => App);

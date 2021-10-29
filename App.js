import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, Button } from "react-native";
import { database } from "./fire";
import "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import HomeScreen from "./screens/HomeScreen";
import CreateGameScreen from "./screens/CreateGameScreen";
import GameScreen from "./screens/GameScreen";
import GameScore from "./screens/GameScore";

import { store } from "./store";
import { Provider } from "react-redux";

const Stack = createStackNavigator();

const globalScreenOptions = {
  headerStyle: { backgroundColor: "#2C6BED" },
  headerTitleStyle: { color: "white" },
  headerTintColor: "white",
};

export default function App() {
  const [test_data, set_test_data] = useState();
  // useEffect(() => {
  //   console.log("use effect called");
  //   // console.log(database);
  //   const unsubscribe = async () => {
  //     console.log("call unsub");
  //     const db = await database.ref("/test_room").get();
  //     console.log("db ", db);
  //     test_json = db;
  //     set_test_data(test_json);
  //   };
  //   return unsubscribe;
  // }, []);

  const callTestData = async () => {
    const db = await database.ref("/test_room").get();
    console.log("db ", db);
    const test_json = JSON.stringify(db);
    set_test_data(test_json);
  };

  const onPressToggleWinner = async () => {
    const db = await database.ref("/test_room").get();

    let update = JSON.parse(JSON.stringify(db));

    if (update.winner === "P1") update.winner = "P2";
    else update.winner = "P1";

    await database.ref("/test_room").update(update);
    callTestData();
  };

  const setTile = async (tile) => {
    const db = await database.ref("/test_room").get();
    if (db.gamestate[title] && db.gamestate[title].trim() !== "") {
      // set the tile here and colour the tile
      let update = JSON.parse(JSON.stringify(db));
      update.gamestate[title] = "P2";
    }
  };

  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName='Paintsplat Project (ASE)' screenOptions={globalScreenOptions}>
          <Stack.Screen name="Paintsplat Project (ASE)" component={HomeScreen} />
          <Stack.Screen name="Create Game" component={CreateGameScreen} />
          <Stack.Screen name="Game" component={GameScreen}/>
          <Stack.Screen name="Game Scores" component={GameScore}/>
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});

import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  ScrollView,
} from "react-native";
import { TextInput } from "react-native-gesture-handler";
import { database } from "../fire";
import { useDispatch } from "react-redux";
import { setRoom } from "../slices/roomSlice";
import {
  setPlayer,
  setOpponent,
  setPlayerColor,
  setOpponentColor,
  setOpponentDisplayName,
  setPlayerDisplayName,
  setIsGameOver
} from "../slices/playerSlice";

const HomeScreen = ({ navigation }) => {
  // navigation.navigate('Game Scores', {redScore: "9", blueScore: "0", 
  //   redPlayer: 'p1', bluePlayer: 'p2', message: "You Won!"})
  const [roomCode, setRoomCode] = useState("");
  const [displayName, setDisplayName] = useState("");
  const dispatch = useDispatch();
  //dispatch(setIsGameOver({bool : false}))

  const setupJoinGameRoom = async () => {
    const gameState = await database.ref("/" + roomCode).get();
    //console.log(gameState);
    //console.log('isActive', gameState.val().isActive);

    if (!gameState || !gameState.val() || !gameState.val().isActive) {
      Alert.alert("Invalid Room Id!");
      return;
    }

    if (displayName && displayName.trim() !== "") {
      await database.ref("/" + roomCode + "/p2DisplayName").set(displayName);
    } else {
      setDisplayName("p2");
      await database.ref("/" + roomCode + "/p2DisplayName").set("p2");
    }

    const opponentName = gameState.val().p1DisplayName;

    dispatch(setOpponentDisplayName({ displayName: opponentName }));
    dispatch(setPlayerDisplayName({ displayName: displayName })); //TODO: pass playername state variable here
    dispatch(setRoom({ roomId: roomCode }));
    dispatch(setPlayer({ name: "p2" }));
    dispatch(setOpponent({ name: "p1" }));
    dispatch(setPlayerColor({ color: "blue" }));
    dispatch(setOpponentColor({ color: "red" }));
    navigation.navigate("Game");
  };

  const setupCreateRoom = () => {
    if (displayName && displayName.trim() !== "") {
      dispatch(setPlayerDisplayName({ displayName: displayName }));
    } else dispatch(setPlayerDisplayName({ displayName: "p1" }));

    navigation.navigate("Create Game");
  };

  console.log(roomCode);
  return (
    <SafeAreaView style={{ backgroundColor: "white", flex: 1 }}>
      <ScrollView>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>PaintSplat (ASE)</Text>
        </View>
        <View style={styles.imageContainer}>
          <Image
            source={{
              uri: "https://t4.ftcdn.net/jpg/02/31/80/07/360_F_231800782_XmCI68ogKBHYg1ObcbXgrYK00436gIn4.jpg",
            }}
            style={styles.image}
          />
        </View>
        <View style={styles.buttonsContainer}>
          <View>
            <TextInput
              style={[styles.textInput, { width: 250, marginTop: -40 }]}
              placeholder="Enter your player name:"
              value={displayName}
              onChangeText={(e) => setDisplayName(e)}
            ></TextInput>
          </View>

          <View style={styles.createOrJoinContainer}>
            <SafeAreaView>
              <TextInput
                style={styles.textInput}
                placeholder="Enter Room id"
                value={roomCode}
                onChangeText={(e) => setRoomCode(e)}
              ></TextInput>
              <TouchableOpacity
                style={[styles.button, { marginBottom: 0 }]}
                onPress={roomCode ? setupJoinGameRoom : null}
              >
                <Text style={{ fontSize: 20, color: "white" }}>
                  Join Game Room
                </Text>
              </TouchableOpacity>
            </SafeAreaView>

            <Text
              style={{
                textAlign: "center",
                marginVertical: 30,
                fontWeight: "bold",
                fontSize: 20,
              }}
            >
              OR
            </Text>

            <View>
              <TouchableOpacity onPress={setupCreateRoom} style={styles.button}>
                <Text style={{ fontSize: 20, color: "white" }}>
                  Create Game Room
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 30,
  },
  title: {
    fontSize: 35,
    fontWeight: "bold",
  },

  image: {
    width: 300,
    height: 300,
    resizeMode: "contain",
    marginTop: -40,
  },

  imageContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },

  buttonsContainer: {
    alignItems: "center",
  },
  button: {
    width: 250,
    marginBottom: 30,
    backgroundColor: "blue",
    padding: 15,
    borderRadius: 40,
    alignItems: "center",
  },

  createOrJoinContainer: {
    marginTop: 60,
  },

  textInput: {
    borderWidth: 1,
    borderColor: "black",
    height: 50,
    marginBottom: 10,
    borderRadius: 99,
    textAlign: "center",
    fontSize: 15,
  },
});

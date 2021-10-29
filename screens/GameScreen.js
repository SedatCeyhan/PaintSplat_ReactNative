import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  SafeAreaView,
  Alert,
} from "react-native";
import { selectRoom } from "../slices/roomSlice";
import { useSelector } from "react-redux";
import { database } from "../fire";
import { useDispatch } from "react-redux";
import { updateGameboard } from "../slices/gameStateSlice";
import {
  selectPlayerColor,
  selectPlayer,
  selectOpponent,
  selectPlayerDisplayName,
  selectOpponentDisplayName,
  selectIsGameOver,
  setIsGameOver,
} from "../slices/playerSlice";

import SplashComponent from "./SplashComponent";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;
import tw from "tailwind-react-native-classnames";

const GameScreen = ({ navigation }) => {
  //console.log(windowHeight, windowWidth);
  const [left, setLeft] = useState(
    Math.floor(Math.random() * (windowWidth - 320))
  );
  const [top, setTop] = useState(
    Math.floor(Math.random() * (windowHeight - 450))
  );
  const [time, setTime] = useState(Date.now());
  const [ownermap, setOwnerMap] = useState({});
  const [gamestatestr, setGamestatestr] = useState("");
  const roomNum = useSelector(selectRoom);
  const playerColor = useSelector(selectPlayerColor);
  const playerName = useSelector(selectPlayer);
  const opponentName = useSelector(selectOpponent);
  const playerDisplayName = useSelector(selectPlayerDisplayName);
  const opponentDisplayName = useSelector(selectOpponentDisplayName);

  let isGameOverBool = useSelector(selectIsGameOver);
  console.log(playerDisplayName, opponentDisplayName);
  const dispatch = useDispatch();
  let interval = null;
  const [redTiles, setRedTiles] = useState(0);
  const [blueTiles, setBlueTiles] = useState(0);
  let redPlayer = "";
  let bluePlayer = "";
  if (playerColor === "red") {
    redPlayer = playerDisplayName;
    bluePlayer = opponentDisplayName;
  } else {
    bluePlayer = playerDisplayName;
    redPlayer = opponentDisplayName;
  }

  // console.log(roomNum);

  useEffect(() => {
    interval = setInterval(() => {
      setTime(Date.now());
      boundaryCheck();
    }, 1000);
    // return () => {
    //   //   clearInterval(interval);
    // };
  }, []);

  const roomSnapshot = database.ref("/" + roomNum + "");

  // roomSnapshot.on("value", async (snapshot) => {
  roomSnapshot.on("value", (snapshot) => {
    const data = snapshot.val();

    if (data && data.gamestate) {
      const datastr = JSON.stringify(data.gamestate);
      if (datastr === gamestatestr) return;

      setGamestatestr(datastr);

      const gameStateObj = data;

      const cellOwnerMap = {};
      if (gameStateObj && gameStateObj.gamestate) {
        let redTiles_ = 0;
        let blueTiles_ = 0;

        for (const eachKey of Object.keys(gameStateObj.gamestate)) {
          //console.log(eachKey);

          if (gameStateObj.gamestate[eachKey] == "p1") {
            redTiles_ += 1;
            cellOwnerMap[eachKey] = "red";
          }
          if (gameStateObj.gamestate[eachKey] == "p2") {
            blueTiles_ += 1;
            cellOwnerMap[eachKey] = "blue";
          }
        }

        setRedTiles(redTiles_);
        setBlueTiles(blueTiles_);

        if (playerColor == "red") {
          if (redTiles_ > 8) {
            console.log("You Win!");
            // await database.ref("/" + roomNum + "/winner").set(playerName);
            stopGame("WIN", redTiles_, blueTiles_);
            roomSnapshot.off("value");
            return;
          } else if (blueTiles_ > 8) {
            console.log("You Lose!");
            // await database.ref("/" + roomNum + "/winner").set(opponentName);
            stopGame("LOSE", redTiles_, blueTiles_);
            roomSnapshot.off("value");
            return;
          }
        } else {
          if (redTiles_ > 8) {
            console.log("You Lose!");
            // await database.ref("/" + roomNum + "/winner").set(opponentName);
            stopGame("LOSE", redTiles_, blueTiles_);
            roomSnapshot.off("value");
            return;
          } else if (blueTiles > 8) {
            console.log("You Win!");
            // await database.ref("/" + roomNum + "/winner").set(playerName);
            stopGame("WIN", redTiles_, blueTiles_);
            roomSnapshot.off("value");
            return;
          }
        }
      }
      setOwnerMap(cellOwnerMap);
    }
  });

  const stopGame = (result, redTiles_, blueTiles_) => {
    if (interval) clearInterval(interval);
    // if(isGameOverBool)
    // {
    //   console.log(isGameOverBool)
    //   return;
    // }
    const title = "Game Over!";
    let message = "";
    if (result === "WIN") {
      message = "You won!";
    } else {
      message = "You lost!";
    }

    navigation.navigate("Game Scores", {
      redScore: redTiles_,
      blueScore: blueTiles_,
      redPlayer: redPlayer,
      bluePlayer: bluePlayer,
      message: message,
    });

    // Alert.alert(title, message, [
    //   {
    //     text: "Go back home!",
    //     onPress: () => navigation.navigate("Paintsplat Project (ASE)"),
    //   },
    //   // {
    //   //   text: "Cancel",
    //   //   onPress: () => console.log("Cancel Pressed"),
    //   //   style: "cancel"
    //   // }
    // ]);
  };

  const boundaryCheck = () => {
    setLeft(Math.floor(Math.random() * (windowWidth - 320)));
    setTop(Math.floor(Math.random() * (windowHeight - 450)));
    // const top_1 = Math.floor(Math.random() * 600);
    // const left_1 = Math.floor(Math.random() * 200)
    console.log(left, top);

    if (Math.abs(windowWidth - left) <= 0) {
      setLeft(left * -1);
    }
    if (Math.abs(windowHeight - top) <= 0) {
      setTop(top * -1);
    }
  };

  return (
    <SafeAreaView style={{ alignItems: "center", justifyContent: "center" }}>
      <View
        style={{
          borderWidth: 2,
          height: 200,
          width: 200,
          top: top,
          left: left,
          alignContent: "flex-start",
          alignItems: "flex-start",
          flexDirection: "row",
          flexWrap: "wrap",
        }}
      >
        <SplashComponent tile="00" color={ownermap["00"]} />
        <SplashComponent tile="01" color={ownermap["01"]} />
        <SplashComponent tile="02" color={ownermap["02"]} />
        <SplashComponent tile="03" color={ownermap["03"]} />
        <SplashComponent tile="10" color={ownermap["10"]} />
        <SplashComponent tile="11" color={ownermap["11"]} />
        <SplashComponent tile="12" color={ownermap["12"]} />
        <SplashComponent tile="13" color={ownermap["13"]} />
        <SplashComponent tile="20" color={ownermap["20"]} />
        <SplashComponent tile="21" color={ownermap["21"]} />
        <SplashComponent tile="22" color={ownermap["22"]} />
        <SplashComponent tile="23" color={ownermap["23"]} />
        <SplashComponent tile="30" color={ownermap["30"]} />
        <SplashComponent tile="31" color={ownermap["31"]} />
        <SplashComponent tile="32" color={ownermap["32"]} />
        <SplashComponent tile="33" color={ownermap["33"]} />
      </View>
      <View style={styles.bottomView}>
        <View style={{ alignItems: "center" }}>
          <Text style={[styles.playerName, { color: "#Ff0005" }]}>
            {redPlayer}
          </Text>
          <Text style={[styles.scoreText, { color: "#Ff0005" }]}>
            {redTiles}
          </Text>
        </View>
        <View style={{ alignItems: "center" }}>
          <Text style={[styles.playerName, { color: "#31e0dc" }]}>
            {bluePlayer}
          </Text>
          <Text style={[styles.scoreText, { color: "#31e0dc" }]}>
            {blueTiles}
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default GameScreen;

const styles = StyleSheet.create({
  gameBoard: {
    height: 200,
    width: 200,
    borderWidth: 2,
    // top:{top},
    // left: {left}
  },
  bottomView: {
    width: "87%",
    height: 80,
    backgroundColor: "#5e594c",
    paddingTop: 5,
    paddingBottom: 5,
    flexDirection: "row",
    justifyContent: "space-around",
    position: "absolute", //Here is the trick
    top: windowHeight - 200, //Here is the trick
    borderRadius: 99,
  },
  playerName: {
    fontSize: 23,
    marginBottom: 3,
    fontWeight: "bold",
  },
  scoreText: {
    fontSize: 30,
    fontWeight: "bold",
  },
});

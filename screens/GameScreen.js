import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, Dimensions, SafeAreaView } from "react-native";
import { selectRoom } from "../slices/roomSlice";
import { useSelector } from "react-redux";
import { database } from "../fire";
import { useDispatch } from "react-redux";
import { updateGameboard } from "../slices/gameStateSlice";
import { selectPlayerColor } from "../slices/playerSlice";

import SplashComponent from "./SplashComponent";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const GameScreen = () => {
  //console.log(windowHeight, windowWidth);
  const [left, setLeft] = useState(200);
  const [top, setTop] = useState(200);
  const [time, setTime] = useState(Date.now());
  const [ownermap, setOwnerMap] = useState({});
  const [gamestatestr, setGamestatestr] = useState("");
  const roomNum = useSelector(selectRoom);
  const playerColor = useSelector(selectPlayerColor);
  const dispatch = useDispatch();
  //console.log(roomNum);
  useEffect(() => {
    const interval = setInterval(() => {
      setTime(Date.now());
      boundaryCheck();
    }, 1000);
    // return () => {
    //   //   clearInterval(interval);
    // };
  }, []);

  const roomSnapshot = database.ref("/" + roomNum + "");

  roomSnapshot.on("value", (snapshot) => {
    const data = snapshot.val();

    if (data && data.gamestate) {
      const datastr = JSON.stringify(data.gamestate);
      if (datastr === gamestatestr) return;

      setGamestatestr(datastr);

      const gameStateObj = data;

      const cellOwnerMap = {};
      if (gameStateObj && gameStateObj.gamestate) {
        let redTiles = 0;
        let blueTiles = 0;
        for (const eachKey of Object.keys(gameStateObj.gamestate)) {
          //console.log(eachKey);

          if (gameStateObj.gamestate[eachKey] == "p1") {
            redTiles += 1;
            cellOwnerMap[eachKey] = "red";
          }
          if (gameStateObj.gamestate[eachKey] == "p2") {
            blueTiles += 1;
            cellOwnerMap[eachKey] = "blue";
          }
        }

        if (playerColor == "red") {
          if (redTiles > 8) {
            console.log("You Win!");
          } else if (blueTiles > 8) {
            console.log("You Lose!");
          }
        } else {
          if (redTiles > 8) {
            console.log("You Lose!");
          } else if (blueTiles > 8) {
            console.log("You Win!");
          }
        }
      }
      setOwnerMap(cellOwnerMap);
    }
  });

  const boundaryCheck = () => {
    setLeft(Math.floor(Math.random() * 200));
    setTop(Math.floor(Math.random() * 600));

    if (Math.abs(windowWidth - left) <= 0) {
      setLeft(left * -1);
    }
    if (Math.abs(windowHeight - top) <= 0) {
      setTop(top * -1);
    }
  };

  return (
    <SafeAreaView>
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
});

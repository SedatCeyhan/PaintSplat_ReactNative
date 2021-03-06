import React, { useState } from "react";
import { View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { database } from "../fire";
import { useSelector } from "react-redux";
import { selectRoom } from "../slices/roomSlice";
import {
  selectPlayer,
  selectOpponent,
  selectPlayerColor,
  selectOpponentColor,
} from "../slices/playerSlice";
import { selectGameboard } from "../slices/gameStateSlice";
import { useDispatch } from "react-redux";
import { updateGameboard } from "../slices/gameStateSlice";

const SplashComponent = ({ tile, color, owner }) => {
  const mycol = color || "white";
  //   const [cellColor, setCellColor] = useState("white");
  const roomNum = useSelector(selectRoom);
  const playerName = useSelector(selectPlayer);
  const playerColor = useSelector(selectPlayerColor);
  const opponentName = useSelector(selectOpponent);
  const opponentColor = useSelector(selectOpponentColor);
  //   const gameBoard = useSelector(selectGameboard);
  const dispatch = useDispatch();

  const setTile = async () => {
    console.log("clicked");

    if (mycol !== "white" && mycol === playerColor) return; //already my tile so skip

    // if (mycol !== "white" && mycol !== playerColor) return;

    database.ref("/" + roomNum + "/gamestate/" + tile).set(playerName);
  };

  return (
    <View
      style={{
        height: "25%",
        width: "25%",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <View
        style={{
          height: "70%",
          width: "70%",
          borderRadius: 999,
          backgroundColor: mycol,
        }}
      >
        <TouchableOpacity
          style={{
            height: "100%",
            width: "100%",
          }}
          onPress={setTile}
        ></TouchableOpacity>
      </View>
    </View>
  );
};

export default SplashComponent;

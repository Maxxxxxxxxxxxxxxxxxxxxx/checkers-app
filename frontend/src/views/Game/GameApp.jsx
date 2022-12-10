import "@/styles/Gameview/Gameview.css";
import Field from "./Field";
import PlayerBar from "./PlayerBar";
import * as exampleGamestate from "@/../public/example.json";
import { useEffect, useState } from "react";
import { useGameContext } from "@/providers/GameContextProvider";
import { Skeleton } from "@mui/material/index";

import * as board from "@/board.json";

let createBoardFields = (gamestate) =>
  board.fields.map((field, index) => {
    let color;
    let pWhite = gamestate.pawns_white.find(
      (pawn) => pawn.pos.x == field.x && pawn.pos.y == field.y
    );
    if (pWhite) color = `w`;

    let pBlack = gamestate.pawns_black.find(
      (pawn) => pawn.pos.x == field.x && pawn.pos.y == field.y
    );
    if (pBlack) color = `b`;

    let pawnIndex;

    if (pWhite && !pBlack) pawnIndex = pWhite.index;
    else if (!pWhite && pBlack) pawnIndex = pBlack.index;

    return (
      <Field
        x={field.x}
        y={field.y}
        index={pawnIndex} // TODO *****
        color={color}     // TODO *****
        key={index}
        style={{ color: "black" }}
      />
    );
  });

export default function GameApp({}) {
  let { gameState } = useGameContext();

  let [fields, setFields] = useState([]);
  let [localState, setLocalState] = useState();

  // useEffect(() => {
  //   console.log("a")
  // })

  useEffect(() => {
    if (gameState) {
      console.log(gameState);
      let fields = createBoardFields(gameState);
      setLocalState(gameState);
      setFields(fields);
    }
  }, [gameState]);

  return localState ? (
    <div className="game-view">
      <PlayerBar isEnemy={true} playerId={`#${localState.player_black_id}`} />
      <div className="board">{fields}</div>
      <PlayerBar isEnemy={false} playerId={`#${localState.player_white_id}`} />
    </div>
  ) : (
    <div className="game-view"></div>
  );
}

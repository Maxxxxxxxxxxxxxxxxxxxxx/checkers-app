import '@/styles/Gameview/Gameview.css';
import Field from "./Field";
import PlayerBar from './PlayerBar';
import * as exampleGamestate from '@/../public/example.json';
import { useEffect, useState } from 'react';
import { useGameContext } from "@/providers/GameContextProvider";
import { Skeleton } from '@mui/material/index';

import * as board from '@/board.json';

let createBoardFields = gamestate => board
  .fields
  .map((field, index) => {

  let pWhite = gamestate.pawns_white
    .find(pawn => pawn.pos.x == field.x && pawn.pos.y == field.y);
  if (pWhite) pWhite = `white`;

  let pBlack = gamestate.pawns_black
    .find(pawn => pawn.pos.x == field.x && pawn.pos.y == field.y);
  if (pBlack) pBlack = `black`;

  return <Field 
    x={field.x} 
    y={field.y} 
    pawn={pWhite ? pWhite : pBlack} 
    key={index}
    style={{color: "black"}} 
    />
  });

export default function GameApp({ }) {
  let { gameState } = useGameContext();
  let [fields, setFields] = useState([]);

  useEffect(() => {
    console.log("a")
  })

  useEffect(() => {
    if (gameState) {
      console.log(gameState)
      let fields = createBoardFields(gameState); 
      setFields(fields) 
    }
  }, [gameState])

  return (
      gameState ?
        <div className="game-view">
          <PlayerBar isEnemy={true} playerId={`#${gameState.player_black_id}`} />
          <div className="board">
            { fields }
          </div>
          <PlayerBar isEnemy={false} playerId={`#${gameState.player_white_id}`} />
        </div>
        :
        <div className="game-view">
          <PlayerBar isEnemy={true} playerId={`#error`} />
          <div className="board">
            { fields }
          </div>
          <PlayerBar isEnemy={false} playerId={`#error`} />
        </div>
      // <div className="game-view">
      //   <PlayerBar isEnemy={true} playerId={`#${gameState.player_black_id}`} />
      //   <div className="board">
      //     { fields }
      //   </div>
      //   <PlayerBar isEnemy={false} playerId={`#${gameState.player_white_id}`} />
      // </div>
  )
}
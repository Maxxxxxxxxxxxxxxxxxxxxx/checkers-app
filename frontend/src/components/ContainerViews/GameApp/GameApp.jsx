import '@/styles/Gameview/Gameview.css';
import Field from "./Field";
import PlayerBar from './PlayerBar';
import SideBar from '../../SideBar';
import GameContextProvider from './GameContextProvider';
import * as exampleGamestate from '@/../public/example.json';
import { useEffect, useState } from 'react';
import { useGameContext } from "./GameContextProvider";

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
    if (gameState) {
      let fields = createBoardFields(gameState); 
      setFields(fields) 
    }
  }, [gameState])

  return (
      <div className="game-view">
        <PlayerBar isEnemy={true} playerId={`#${gameState.player_black_id}`} />
        <div className="board">
          { fields }
        </div>
        <PlayerBar isEnemy={false} playerId={`#${gameState.player_white_id}`} />
      </div>
  )
}
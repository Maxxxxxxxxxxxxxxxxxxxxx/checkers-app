import '@/styles/Gameview/Gameview.css';
import Field from "./Field";
import PlayerBar from './PlayerBar';
import SideBar from '../../SideBar';
import * as exampleGamestate from '@/../public/example.json';
import { useEffect, useState } from 'react';

let board = 

let createBoardFields = gamestate => gamestate
  .board
  .fields
  .map(field => {

  let pWhite = gamestate
    .pawns_white
    .find(pawn => pawn.pos.x == field.x && pawn.pos.y == field.y);
  if (pWhite) pWhite = `white`;

  let pBlack = gamestate.
    pawns_black
    .find(pawn => pawn.pos.x == field.x && pawn.pos.y == field.y);
  if (pBlack) pBlack = `black`;

  return <Field 
    x={field.x} 
    y={field.y} 
    pawn={pWhite ? pWhite : pBlack} 
    style={{color: "black"}} 
    />
});

export default function GameApp({ }) {
  let [gameState, setGameState] = useState({});
  let [fields, setFields] = useState([]);

  // document.querySelectorAll('.draggable-entity').forEach(el => el.addEventListener('dragstart', drag));
  // document.querySelector('#div1').addEventListener('drop', drop);
  // document.querySelector('#div1').addEventListener('dragover', allowDrop);

  // function allowDrop(ev) {
  //   ev.preventDefault();
  // }
  
  // function drag(ev) {
  //   ev.dataTransfer.setData("text", ev.target.id);
  // }
  
  // function drop(ev) {
  //   ev.preventDefault();
  //   var data = ev.dataTransfer.getData("text");
  //   ev.target.appendChild(document.getElementById(data));
  // }

  useEffect(() => {
    let fields = createBoardFields(exampleGamestate);
    setFields(fields)
  }, [gameState])


  return (
    <div className="game-view">
      <PlayerBar isEnemy={true} playerId={"#5631"} />
      <div className="board">
        { fields }
      </div>
      <PlayerBar isEnemy={false} playerId={"#0348"} />
    </div>
  )
}
import { useState, useContext } from 'react';
import { useGameContext } from '@/providers/GameContextProvider';

export default function Field({ x, y, pawn }) {
  let { focusedField, clearFocus, setFocus, gameState } = useGameContext();

  console.log(`focused field: ${focusedField}`);

  let spritePath;
  if (pawn === 'white') spritePath = '/pawn_white.svg';
  else if (pawn === 'black') spritePath = '/pawn_black.svg';

  return (
    spritePath 
      ? 
      <div className={`square ${x} ${y} ${ focusedField == [x,y] ? "square-highlighted" : "" }`}>
        <img src={spritePath} alt="" className="sprite" onClick={() => setFocus(x,y)} />
      </div> 
      : 
      <div className={`square ${x} ${y} ${ focusedField == [x,y] ? "square-highlighted" : "" }`}
        onClick={() => console.log(x,y)}>
        {/* <img src={spritePath} alt="" className="sprite" onClick={() => setFocus(x,y)} /> */}
      </div> 

  )
}
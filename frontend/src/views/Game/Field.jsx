import { useState, useContext } from "react";
import { useGameContext } from "@/providers/GameContextProvider";

export default function Field({ x, y, color, index }) {
  let { focusedPawn, clearSelection, setFocus, setDest } = useGameContext();

  let spritePath;
  if (color === "w") spritePath = "/pawn_white.svg";
  else if (color === "b") spritePath = "/pawn_black.svg";

  // TODO: handle put to backend, 

  return spritePath ? (
    <div
      className={`square ${x} ${y}`}
    >
      <img
        src={spritePath}
        alt=""
        className="sprite"
        onClick={() => {
          console.log(`focused pawn: ${x} ${y} ${color}`);
          setFocus(color, index);
        }}
      />
    </div>
  ) : (
    <div
      className={`square ${x} ${y}`}
      onClick={() => {
        console.log(x, y);
        setDest(x, y);
        clearSelection();
      }}
    >
    </div>
  );
}

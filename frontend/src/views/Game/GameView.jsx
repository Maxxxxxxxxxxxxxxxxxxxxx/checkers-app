import "@/styles/Gameview/Gameview.css";
import Field from "./Field";
import { useGameContext } from "@/providers/GameContextProvider";
import { Skeleton } from "@mui/material";

import * as board from "@/game/board.json";

export default function GameView({}) {
  let { gamestate } = useGameContext();

  return (
      <div className="view">
        <div className="game">
          {gamestate ? (
            <div className="game__board">
              { board.fields.map(field => <Field key={Math.floor(Math.random() * 7890000)} x={ field.x } y={ field.y }/>) }
            </div>
          ) : (
            <Skeleton variant="rectangular" className="game__board--skeleton" />
          )}
        </div>
      </div>
  )
}

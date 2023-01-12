import "@/styles/Gameview/Gameview.css";
import Field from "./Field";
import { useGameContext } from "@/providers/Checkers/GameContextProvider";
import { Skeleton, Toolbar, IconButton, Typography } from "@mui/material";
import { Menu } from "@mui/icons-material/index";
import * as board from "@/game/board.json";
import { Fragment } from 'react';
import View from "../View";
import GameInfo from "./GameInfo";

export default function GameView({}) {
  let { gamestate } = useGameContext();

  // html2canvas(document.querySelector("#capture")).then(canvas => {
  //   document.body.appendChild(canvas)
  // });

  // useEffect(() => {
  //   let interval = setInterval(() => {
  //   }, 10000);
  // }, [])

  return (
    <Fragment>
      <View>
        <div className="game">
          <Toolbar variant="dense" className="toolbar">
            <span className="toolbar__leftside">
              <IconButton
                edge="start"
                color="inherit"
                aria-label="menu"
              >
                <Menu />
              </IconButton>
              <Typography
                className="toolbar__text"
                variant="p"
                color="inherit"
                component="div"
              >
                { gamestate.name }
              </Typography>
            </span>
          </Toolbar>
            <div className="game__container">
              {gamestate ? (
                <div className="game__board" id="capture">
                  {board.fields.map((field) => (
                    <Field
                      key={Math.floor(Math.random() * 7890000)}
                      x={field.x}
                      y={field.y}
                    />
                  ))}
                </div>
              ) : (
                <Skeleton variant="rectangular" className="game__board--skeleton" />
              )}
              <GameInfo></GameInfo>
            </div>
        </div>
      </View>
    </Fragment>
  );
}

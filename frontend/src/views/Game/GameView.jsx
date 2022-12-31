import "@/styles/Gameview/Gameview.css";
import Field from "./Field";
import { useGameContext } from "@/providers/Checkers/GameContextProvider";
import { Skeleton, Toolbar, IconButton, Typography } from "@mui/material";
import { Menu } from "@mui/icons-material/index";
import html2canvas from "html2canvas";
import * as board from "@/game/board.json";
import Sidebar from "../Sidebar";
import ChatTab from "../ChatTab/ChatTab";
import { Fragment, useEffect } from 'react';

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
      <Sidebar></Sidebar>
      <div className="view">
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
        </div>
      <ChatTab />
      </div>
    </Fragment>
  );
}

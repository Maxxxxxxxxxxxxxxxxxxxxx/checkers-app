import { Fragment } from "react";
import { Toolbar, IconButton, Typography } from "@mui/material/index";
import ChatTab from "../ChatTab/ChatTab";
import Sidebar from "../Sidebar";
import '@/styles/Newgame/Newgame.css';

export default function NewGameView() {
  return (
    <Fragment>
      <Sidebar></Sidebar>
      <div className="view">
        <div className="newgame">
          <Toolbar variant="dense" className="toolbar">
              <span className="toolbar__leftside">
                <IconButton
                  edge="start"
                  color="inherit"
                  aria-label="menu"
                >
                </IconButton>
                <Typography
                  className="toolbar__text"
                  variant="p"
                  color="inherit"
                  component="div"
                >
                  New game
                </Typography>
              </span>
          </Toolbar>
          <div className="form-window">
            <form className="form-window__form"></form>
          </div>
        </div>
        <ChatTab></ChatTab>
      </div>
    </Fragment>
  );
}

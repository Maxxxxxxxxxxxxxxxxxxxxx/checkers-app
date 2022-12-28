import { useState, useEffect, Fragment} from "react";
import { Typography, Toolbar, IconButton } from "@mui/material/index";
import { Menu } from "@mui/icons-material/index";
import { Link } from "react-router-dom";
import "@/styles/GamesList/GamesList.css";
import axios from "axios";
import GameWindow from "./GameWindow";
import Sidebar from "../Sidebar";

export default function GamesListView() {
  let [games, setGames] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:8080/games").then((res) => {
      setGames(res.data);
      console.log(res.data);
    });
  }, []);

  let children = games.map((gamestate) => {
    return (
      <GameWindow
        key={Math.floor(Math.random() * 7890000)}
        gamestate={gamestate}
      />
    );
  });

  return (
    <Fragment>
      <Sidebar></Sidebar>
      <div className="view">
        <div className="list-view">
          {/* <Typography variant="h4" component="h2" className="list-view__header">
            Games
            <Typography variant="h4" component="h2" sx={{ color: "gray" }}>
              {games ? `(${games.length})` : "(0)"}
            </Typography>
          </Typography> */}
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
                Games
              </Typography>
            </span>
          </Toolbar>
          <div className="list-view__games-list">{children}</div>
        </div>
      </div>
    </Fragment>
  );
}

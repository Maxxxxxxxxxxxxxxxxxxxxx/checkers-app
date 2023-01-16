import { useState, useEffect, Fragment} from "react";
import { Typography, Toolbar } from "@mui/material/index";
import { Menu } from "@mui/icons-material/index";
import "@/styles/GamesList/GamesList.css";
import axios from "axios";
import GameWindow from "./GameWindow";
import View from "../View";

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
      {/* <Sidebar></Sidebar> */}
      <View>
        <div className="list-view">
          <Toolbar variant="dense" className="toolbar">
            <span className="toolbar__leftside">
              <Menu />
              <Typography
                className="toolbar__text"
                variant="p"
                color="inherit"
                component="div"
              >
                Games
                <Typography variant="p" color="gray" component="div">
                  { games ? `(${games.length})` : "(0)" }
                </Typography>
              </Typography>
            </span>
          </Toolbar>
          <div className="list-view__games-list">
            { children }
          </div>
        </div>
      </View>
    </Fragment>
  );
}

import { useState, useEffect, Fragment } from "react";
import { Typography, Toolbar } from "@mui/material/index";
import { Menu } from "@mui/icons-material/index";
import "@/styles/GamesList/GamesList.css";
import axios from "axios";
import GameWindow from "./GameWindow";
import View from "../View";

export default function GamesListView() {
  let [games, setGames] = useState([]);

  const [searchPattern, setSearchPattern] = useState(/.*/);
  const setPattern = (string) =>
    string ? setSearchPattern(new RegExp(string)) : setSearchPattern(/.*/);

  useEffect(() => {
    axios.get("http://localhost:8081/games").then((res) => {
      setGames(res.data);
      console.log(res.data);
    });
  }, []);

  const handleDeleteGame = (id) =>
    axios.delete(`http://localhost:8081/games/game/${id}`).then((res) => {
      setGames(games.filter((game) => game.id != id));
    });

  let children = games.map((gamestate) => {
    if (searchPattern.test(gamestate.name))
      return (
        <GameWindow
          key={Math.floor(Math.random() * 7890000)}
          gamestate={gamestate}
          handleDelete={handleDeleteGame}
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
                  {games ? `(${games.length})` : "(0)"}
                </Typography>
              </Typography>
            </span>
            <span className="toolbar__rightside">
              <form onChange={(event) => setPattern(event.target.value)}>
                <input
                  className="toolbar__search"
                  type="text"
                  name="search"
                  placeholder="Search"
                />
              </form>
            </span>
          </Toolbar>
          <div className="list-view__games-list">{children}</div>
        </div>
      </View>
    </Fragment>
  );
}

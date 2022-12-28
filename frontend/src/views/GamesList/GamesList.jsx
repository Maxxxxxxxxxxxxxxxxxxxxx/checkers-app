import { useState, useEffect } from 'react';
import { Container, Typography } from '@mui/material/index';
import { Link } from 'react-router-dom';
import "@/styles/GamesList/GamesList.css";
import axios from 'axios';
import GameWindow from './GameWindow';

export default function GamesListView() {
  let [games, setGames] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:8080/games")
      .then(res => { setGames(res.data); console.log(res.data) })
  }, []);

  let children = games.map(gamestate => {
    return (
      <GameWindow gamestate={gamestate}/>
    )
  })

  return (
    <div className="view">
      <div className="list-view">
        <Typography variant="h4" component="h2" className="list-view__header">
          Games 
          <Typography variant="h4" component="h2" sx={{color: "gray"}}>
            { games ? `(${games.length})` : "(0)"}
          </Typography>
        </Typography>
        <div className="list-view__games-list">
          { children }
        </div>
      </div>
    </div>
  )
}
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import "@/styles/GamesList/GamesList.css";
import axios from 'axios';

export default function GamesListView() {
  let [games, setGames] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:8080/games")
      .then(res => { setGames(res.data); console.log(res.data) })
  }, []);

  return (
    <div className="view">
      <div className="container">
        <div className="container__header">
          <div className="container__header-text">
            Games
          </div>
          <div className="container__header-text container__header-text--gray">
            { games ? `(${games.length})` : undefined }
          </div>
        </div>
        <div className="games-list">
          {games.map(gamestate => {
            return (<div className="games-list__game">
              <span className="info">
                <div className="info__element">
                  Game { gamestate.id }
                </div>
                <div className="info__element">
                  Turn { gamestate.turn }
                </div>
              </span>
              <Link className="small-button small-button--black" to={`/game?gameId=${gamestate.id}`}>
                  Play as black
              </Link>
              <Link className="small-button small-button--white" to={`/game?gameId=${gamestate.id}`}>
                  Play as white
              </Link>
            </div>)
          })}
        </div>
      </div>
    </div>
  )
}
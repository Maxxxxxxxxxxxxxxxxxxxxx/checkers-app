import { useState, createContext, useContext, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";

const GameContext = createContext();
export const useGameContext = () => useContext(GameContext);

export default function GameContextProvider({ children }) {
  const [params] = useSearchParams();
  const [gamestate, setGamestate] = useState();

  const gameId = params.get("gameId");

  useEffect(() => {
    axios.get(`http://localhost:8080/games/${gameId}`)
      .then(res => {setGamestate(res.data); console.log(res.data)})
  }, []);

  return (
    <GameContext.Provider
      value={{ gamestate }}
    >
      {children}
    </GameContext.Provider>
  );
}

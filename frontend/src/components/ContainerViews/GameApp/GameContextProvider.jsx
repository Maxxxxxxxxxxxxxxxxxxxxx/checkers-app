import { useState, createContext, useContext, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';

const GameContext = createContext();
export const useGameContext = () => useContext(GameContext);

export default function GameContextProvider({ children }) {
  const [params] = useSearchParams();

  const gameId = params.get('gameId');

  const [focusedField, setFocusedField] = useState([]);
  const [destinationField, setDestinationField] = useState([]);
  const [gameState, setGameState] = useState({});

  useEffect(() => {
    axios.get(`http://127.0.0.1:8000/games/${gameId}`)
      .then(r => { console.log(r.data); setGameState(r.data) })
  }, []);

  const clearFocus = () => setFocusedField([]);
  const setFocus = (x,y) => setFocusedField([x,y]);

  return (
    <GameContext.Provider value={{ focusedField, clearFocus, setFocus, gameState }}>
      {children}
    </GameContext.Provider>
  )
}
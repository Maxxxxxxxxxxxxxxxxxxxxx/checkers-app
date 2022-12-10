import { useState, createContext, useContext, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";

const GameContext = createContext();
export const useGameContext = () => useContext(GameContext);

export default function GameContextProvider({ children }) {
  const [params] = useSearchParams();

  const gameId = params.get("gameId");

  const [focusedPawn, setFocusedPawn] = useState();
  const [destinationField, setDestinationField] = useState([]);
  const [gameState, setGameState] = useState();

  useEffect(() => {
    console.log(gameState);
    axios
      .get(`http://127.0.0.1:8000/games/${gameId}`)
      .then((r) => {
        setGameState(r.data);
      })
      .catch((err) => undefined);
  }, []);

  useEffect(() => {
    if (focusedPawn && destinationField.length === 2) {
      axios.put(
        `http://127.0.0.1:8000/games/game/${gameId}?move&${focusedPawn[2]}&<index>&<x>&<y>`
      );
    }
  }, [destinationField]);

  const clearSelection = () => {
    setFocusedPawn([]);
    setDestinationField([]);
  };
  const setFocus = (pawn) => setFocusedPawn(pawn);
  const setDest = (x, y) => setDestinationField([x, y]);

  return (
    <GameContext.Provider
      value={{ focusedPawn, clearSelection, setFocus, setDest, gameState }}
    >
      {children}
    </GameContext.Provider>
  );
}

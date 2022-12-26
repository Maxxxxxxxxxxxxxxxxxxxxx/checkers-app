import { useState, useReducer, createContext, useContext, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import GamestateReducer from "./GamestateReducer";
import * as Actions from './GamestateActions';
import axios from "axios";

const GameContext = createContext();
export const useGameContext = () => useContext(GameContext);

export default function GameContextProvider({ children }) {
  const [params] = useSearchParams();
  const [gamestate, dispatch] = useReducer(GamestateReducer, {pawns: []});
  const [moveParams, setMoveParams] = useState({});

  const gameId = params.get("gameId");

  const focusPawn = (pawn) => setMoveParams({...moveParams, pawn});
  const focusDest = (x, y) => setMoveParams({...moveParams, dest: [x, y]})
  const clearFocus = () => setMoveParams({});

  useEffect(() => {
    if (moveParams.pawn && moveParams.dest) {
      dispatch(Actions.move(moveParams.pawn, moveParams.dest[0], moveParams.dest[1]))
      clearFocus();
    }
  })

  useEffect(() => {
    axios.get(`http://localhost:8080/games/${gameId}`)
      .then(res => { dispatch(Actions.set(res.data)); console.log(res.data) })
  }, []);

  return (
    <GameContext.Provider
      value={{ gamestate, dispatch, focusPawn, focusDest }}
    >
      {children}
    </GameContext.Provider>
  );
}

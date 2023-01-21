import {
  useState,
  useReducer,
  createContext,
  useContext,
  useEffect,
} from "react";
import { useSearchParams } from "react-router-dom";
import GamestateReducer from "./GamestateReducer";
import * as Actions from "./GamestateActions";
import axios from "axios";
import { useMqtt } from "../Mqtt/MqttProvider";

const GameContext = createContext();
export const useGameContext = () => useContext(GameContext);

export default function GameContextProvider({ children }) {
  const [params] = useSearchParams();
  const [gamestate, dispatch] = useReducer(GamestateReducer, { pawns: [] });
  const { client, subscribe } = useMqtt();
  const mqttTopic = `game/${params.get("id")}`;
  
  useEffect(() => {
    if(client) {
      subscribe(mqttTopic);

      client.on("message", (topic, payload) => {
        if(topic === mqttTopic) { 
          let newGamestate = JSON.parse(payload)
          // console.log("Received game mqtt msg", newGamestate); 
          dispatch(Actions.set(newGamestate))
        }
      })
    }
  }, [client])

  const publishGamestate = (state) => {
    if(client) {
      // console.log("Published gamestate:", gamestate);
      client.publish(mqttTopic, JSON.stringify(state));
    }
  }

  // moveParams: { pawn: [PAWN OBJECT], dest: [x,y] }
  const [moveParams, setMoveParams] = useState({});

  const gameId = params.get("id");
  const playerColor = params.get("player");

  console.log("player:", playerColor);

  // sets "pawn" property in moveParams
  const focusPawn = (pawn) => setMoveParams({ ...moveParams, pawn });

  // sets "dest" property in moveParams
  const focusDest = (x, y) =>
    moveParams.pawn
      ? setMoveParams({ ...moveParams, dest: [x, y] })
      : undefined;
  
  // clears moveParams
  const clearParams = () => setMoveParams({});

  useEffect(() => {
    if (moveParams.pawn && moveParams.dest) {
      // dispatch the move to GamestateReducer

      dispatch(
        Actions.move(moveParams.pawn, moveParams.dest[0], moveParams.dest[1], playerColor, publishGamestate)
      );
      clearParams();
    }
  });

  // fetch current gamestate from api
  useEffect(() => {
    axios.get(`http://localhost:8080/games/game/${gameId}`).then((res) => {
      dispatch(Actions.set(res.data));
      console.log(res.data);
    });
  }, []);

  return (
    <GameContext.Provider value={{ gamestate, dispatch, focusPawn, focusDest }}>
      {children}
    </GameContext.Provider>
  );
}

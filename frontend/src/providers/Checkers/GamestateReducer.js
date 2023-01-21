import { MovePawn, MoveQueen } from "./gamelogics/EasyMode";
import axios from "axios";

// Easy mode reducer
const GamestateReducer = (state, action) => {
  switch (action.type) {
    case "MOVE":
      let move = !action.pawn.is_queen
        ? new MovePawn(
            state,
            action.pawn,
            action.x,
            action.y,
            action.playerColor
          )
        : new MoveQueen(
            state,
            action.pawn,
            action.x,
            action.y,
            action.playerColor
          );

      console.log("iskill: ", move.isKill());

      // update the pawn state, searches pawn by index and side
      let newPawnState = state.pawns.map((pawn) => {
        if (
          pawn.index === action.pawn.index &&
          pawn.side === action.pawn.side
        ) {
          const promoted = {
            ...pawn,
            is_queen: true,
            pos_x: action.x,
            pos_y: action.y,
          };

          // if pawn is black starting at bottom and ends up on top boundary
          if (action.pawn.side === "b" && 
              state.black_side == "top" && 
              action.y == 0
          )
            return promoted;
          // if pawn is black starting at top and ends up on bottom boundary
          if (
            action.pawn.side === "w" &&
            state.white_side == "bottom" &&
            action.y == 0
          )
            return promoted;
          // if pawn is white starting at top and ends up on bottom boundary
          if (action.pawn.side === "w" && 
              state.white_side == "top" && 
              action.y == 7
          )
            return promoted;
          // if pawn is white starting at bottom and ends up on top boundary
          if (
            action.pawn.side === "b" &&
            state.black_side == "bottom" &&
            action.y == 7
          )
            return promoted;
          // by default, return just pawn with updated position
          else {
            console.log("No promo");
            return {
              ...pawn,
              pos_x: action.x,
              pos_y: action.y,
            };
          }
        } else return pawn;
      });

      // pawn should get killed only when move is valid
      if (move.isKill() && move.validate()) {
        // move.isKill() returns dead pawn object
        let deadPawn = move.isKill();

        // update newPawnState with killed pawn's state changed
        newPawnState = newPawnState.map((pawn) => {
          return pawn.side === deadPawn.side && pawn.index === deadPawn.index
            ? { ...pawn, is_dead: true, pos_x: -1, pos_y: -1 }
            : pawn;
        });
      }

      console.log(JSON.stringify(MovePawn.Serialize(move)));

      // if move valid, put request to backend and return new state
      if (move.validate()) {
        let body = MovePawn.Serialize(move);
        // console.log("put body:", body);

        axios
          .put(`http://localhost:8080/games/game/${state.id}`, body)
          .then((res) => {
            console.log("PUT successful!", res.data);
            action.publish(res.data);
          });

        return {
          ...state,
          pawns: newPawnState,
        };
      } else return state;

    case "SET":
      console.log("Gamestate set", action.newState);
      return action.newState;

    case "END":
      console.log(`Game ended! Winner: ${action.winner}`);
      return action.state; // todo: return gamestate with "isEnd" set to true

    default:
      return state;
  }
};

export default GamestateReducer;

import { MovePawn, MoveQueen } from "./gamelogics/EasyMode";
import axios from "axios";

const checkEnd = (gamestate) => {
  if (gamestate.pawns.filter(p => p.side === "w").each(p => p.is_dead)) return true
  if (gamestate.pawns.filter(p => p.side === "b").each(p => p.is_dead)) return true
}

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

      const checkEligibleForPromotion = () => {
        // if pawn is black starting at bottom and ends up on top boundary
        if (
          action.pawn.side === "b" &&
          state.black_side == "bottom" &&
          action.y == 0
        )
          return true;
        // if pawn is black starting at top and ends up on bottom boundary
        if (
          action.pawn.side === "w" &&
          state.white_side == "top" &&
          action.y == 0
        )
          return true;
        // if pawn is white starting at top and ends up on bottom boundary
        if (
          action.pawn.side === "w" &&
          state.white_side == "top" &&
          action.y == 7
        )
          return true;
        // if pawn is white starting at bottom and ends up on top boundary
        if (
          action.pawn.side === "b" &&
          state.black_side == "bottom" &&
          action.y == 7
        )
          return true;
      };

      console.log("promo:", checkEligibleForPromotion());

      // update the pawn state, searches pawn by index and side
      let newPawnState = state.pawns.map((pawn) => {
        if (
          pawn.index === action.pawn.index &&
          pawn.side === action.pawn.side
        ) {
          // return just pawn with updated position
          return {
            ...pawn,
            pos_x: action.x,
            pos_y: action.y,
          };
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

      // console.log(JSON.stringify(MovePawn.Serialize(move)));

      // if move valid, put request to backend and return new state
      if (move.validate()) {
        let body = MovePawn.Serialize(move);

        // check if pawn ends up on boundary, and send promote request
        if (checkEligibleForPromotion()) {
          let { side, index } = action.pawn;
          // send the promote request
          axios
            .put(`http://localhost:8080/games/game/${state.id}/promote`, {
              side,
              index,
            })
            .then((res) => {
              console.log("Pawn promoted!", res.data);
              // after promote req succeeds, update the gamestate and broadcast over mqtt
              axios
                .put(`http://localhost:8080/games/game/${state.id}`, body)
                .then((res) => {
                  action.publish(res.data);
                });
            });

          return {
            ...state,
            pawns: newPawnState,
          };
        }

        axios
          .put(`http://localhost:8080/games/game/${state.id}`, body)
          .then((res) => {
            action.publish(res.data);
          });

        return {
          ...state,
          pawns: newPawnState,
        };
      } else return state;

    case "SET":
      return action.newState;

    case "END":
      return state;

    default:
      return state;
  }
};

export default GamestateReducer;

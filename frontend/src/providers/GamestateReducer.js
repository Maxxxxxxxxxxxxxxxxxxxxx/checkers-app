import { MovePawn } from "./gamelogics/EasyMode";

const GamestateReducer = (state, action) => {
  switch (action.type) {
    case "MOVE":
      let move = new MovePawn(state, action.pawn, action.x, action.y);
      console.log("iskill: ", move.isKill());

      // update the pawn state, searches pawn by index and side
      let newPawnState = state.pawns.map((pawn) => {
        if (
          pawn.index === action.pawn.index &&
          pawn.side === action.pawn.side
        ) {
          // console.log(pawn);
          return {
            ...pawn,
            pos_x: action.x,
            pos_y: action.y,
          };
        } else return pawn;
      });

      // pawn should get killed only when move is valid
      if (move.isKill() && move.validate()) {
        // move.isKill() returns pawn object
        let deadPawn = move.isKill();

        // update newPawnState with killed pawn's state changed
        newPawnState = newPawnState.map(pawn => {
          return pawn.side === deadPawn.side && 
                 pawn.index === deadPawn.index
            ? { ...pawn, is_dead: true, pos_x: -1, pos_y: -1}
            : pawn
        });
      }

      // return new state only if move is valid
      return move.validate()
        ? {
            ...state,
            pawns: newPawnState,
          }
        : state;

    case "SET":
      console.log("Gamestate set", action.newState);
      return action.newState;

    default:
      return state;
  }
};

export default GamestateReducer;

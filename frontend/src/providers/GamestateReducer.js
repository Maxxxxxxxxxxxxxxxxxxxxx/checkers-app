const GamestateReducer = (state, action) => {
  switch (action.type) {
    case 'MOVE':
      let newPawnState = state.pawns.map(pawn => {
        // find pawn to modify
        if (pawn.index === action.pawn.index && pawn.side === action.pawn.side) {
          console.log(pawn)
          return {
            ...pawn,
            pos_x: action.x,
            pos_y: action.y
          }
        } else return pawn
      });
      return {
        ...state,
        pawns: newPawnState
      }
    case 'SET':
      console.log("Gamestate set", action.newState)
      return action.newState

    default:
      return state
  }
}

export default GamestateReducer;
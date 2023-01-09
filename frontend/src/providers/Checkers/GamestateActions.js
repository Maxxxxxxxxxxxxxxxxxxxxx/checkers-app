export const move = (pawn, x, y, playerColor) => ({
  type: "MOVE",
  pawn: pawn,
  x: x,
  y: y,
  playerColor
});

export const set = (newState) => ({
  type: 'SET',
  newState,
});
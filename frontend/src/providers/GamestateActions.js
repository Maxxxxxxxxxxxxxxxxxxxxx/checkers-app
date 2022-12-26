export const move = (pawn, x, y) => ({
  type: "MOVE",
  pawn: pawn,
  x: x,
  y: y
});

export const set = (newState) => ({
  type: 'SET',
  newState,
});
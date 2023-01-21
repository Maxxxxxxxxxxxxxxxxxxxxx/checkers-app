export const move = (pawn, x, y, playerColor, publish) => ({
  type: "MOVE",
  pawn: pawn,
  x: x,
  y: y,
  playerColor,
  publish
});

export const set = (newState) => ({
  type: 'SET',
  newState,
});

export const end = (winner) => ({
  type: 'SET',
  winner,
});
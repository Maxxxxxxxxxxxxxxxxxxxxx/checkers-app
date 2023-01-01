export default function Field({ x, y, gamestate }) {
  let pawn = gamestate
    ? gamestate.pawns.find((pawn) => pawn.pos_x === x && pawn.pos_y === y)
    : undefined;

  return pawn ? (
    <div className={`preview__field preview__field--occupied`}>
      <img
        src={pawn.side === "b" ? "/pawn_black.svg" : "/pawn_white.svg"}
        alt=""
        className="preview__sprite"
      />
    </div>
  ) : (
    <div
      className={`preview__field preview__field--empty`}
    ></div>
  );
}

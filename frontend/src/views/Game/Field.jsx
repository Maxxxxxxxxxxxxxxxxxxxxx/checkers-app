import { useGameContext } from "@/providers/GameContextProvider";

export default function Field({ x, y }) {
  let { gamestate } = useGameContext();

  let pawn = gamestate 
    ? gamestate.pawns.find(pawn => pawn.pos_x === x && pawn.pos_y === y)
    : undefined;

  return pawn ? (
    <div
      className={`game__field game__field--occupied`}
    >
      <img
        src={pawn.side === 'b' ? '/pawn_black.svg' : '/pawn_white.svg'}
        alt=""
        className="sprite"
        onClick={() => {
          console.log(pawn);
          // setFocus(color, index);
        }}
      />
    </div>
  ) : (
    <div
      className={`game__field game__field--empty`}
      onClick={() => {
        console.log(x, y);
        // setDest(x, y);
        // clearSelection();
      }}
    >
    </div>
  );
}

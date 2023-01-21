import { useGameContext } from "@/providers/Checkers/GameContextProvider";

export default function Field({ x, y }) {
  let { gamestate, focusPawn, focusDest } = useGameContext();

  let pawn = gamestate
    ? gamestate.pawns.find((pawn) => pawn.pos_x === x && pawn.pos_y === y)
    : undefined;

  let getSvgUrl = () => {
    if(pawn.is_queen) return pawn.side == "b" 
      ? "/queen_black.svg" 
      : "/queen_white.svg"
    else {
      return pawn.side == "b" 
        ? "/pawn_black.svg" 
        : "/pawn_white.svg"
    }
  }

  return pawn ? (
    <div className={`game__field game__field--occupied`}>
      <img
        src={getSvgUrl()}
        alt=""
        className="sprite"
        onClick={() => {
          console.log(x,y)
          focusPawn(pawn)
        }}
      />
    </div>
  ) : (
    <div
      className={`game__field game__field--empty`}
      onClick={() => {
        console.log(x,y)
        focusDest(x,y);
      }}
    ></div>
  );
}

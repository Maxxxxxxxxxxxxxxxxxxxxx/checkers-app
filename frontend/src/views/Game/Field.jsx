import { useGameContext } from "@/providers/GameContextProvider";
import * as Actions from '@/providers/GamestateActions';

export default function Field({ x, y }) {
  let { gamestate, focusPawn, focusDest } = useGameContext();

  let pawn = gamestate
    ? gamestate.pawns.find((pawn) => pawn.pos_x === x && pawn.pos_y === y)
    : undefined;

  return pawn ? (
    <div className={`game__field game__field--occupied`}>
      <img
        src={pawn.side === "b" ? "/pawn_black.svg" : "/pawn_white.svg"}
        alt=""
        className="sprite"
        onClick={() => {
          // console.log(pawn);
          focusPawn(pawn);
          // dispatch({type: 'MOVE', pawn: pawn, x: 1, y: 4 })
          // dispatch(Actions.move(pawn, 1, 4))
          // setPawn({ x: pawn.pos_x, y: pawn.pos_y })
          // setFocus(color, index);
        }}
      />
    </div>
  ) : (
    <div
      className={`game__field game__field--empty`}
      onClick={() => {
        // console.log(x, y);
        focusDest(x,y);
        // setDestination({ x, y });
        // clearFocus();
      }}
    ></div>
  );
}

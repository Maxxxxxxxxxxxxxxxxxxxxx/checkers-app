import { Vector } from "vector2d";

export class MovePawn {
  constructor(gamestate, pawn, x, y) {
    this.gamestate = gamestate;
    this.pawn = pawn;
    this.x = x;
    this.y = y;
    this.vec = new Vector(x - pawn.pos_x, y - pawn.pos_y);
    this.absVec = new Vector(
      Math.abs(x - pawn.pos_x),
      Math.abs(y - pawn.pos_y)
    );
  }

  validate = () => {
    // if move is other than 1 diagonal tile and not a kill
    if (!this.absVec.equals(new Vector(1, 1)) && !this.isKill()) return false;

    // if move is to overlap with other pawn
    if (
      this.gamestate.pawns.find(
        (pawn) => pawn.pos_x === this.x && pawn.pos_y === this.y
      )
    )
      return false;

    // if move is kill
    if (this.absVec.equals(new Vector(2, 2)) && this.isKill()) return true;

    // if move is one tile diagonally
    if (this.absVec.equals(new Vector(1, 1))) return true;
  };

  isKill = () => {
    // shift vector to enemy pos
    let shift = this.vec.clone().divS(2);

    // calculate enemy pos
    let enemyPos = new Vector(this.pawn.pos_x, this.pawn.pos_y)
    enemyPos.add(shift)

    if (this.absVec.equals(new Vector(2, 2))) {
      let enemyPawn = this.gamestate.pawns.find(pawn => {
        let position = new Vector(pawn.pos_x, pawn.pos_y);
        return position.equals(enemyPos) && 
               pawn.side != this.pawn.side
          ? true : false
      });

      return enemyPawn
    } else return false;
  }
}

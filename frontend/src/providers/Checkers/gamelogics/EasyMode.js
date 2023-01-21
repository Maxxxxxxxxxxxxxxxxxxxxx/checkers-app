import { Vector } from "vector2d";

const getPawnAtVector = (gamestate, vector) => {
  let p = gamestate.pawns.find((pawn) => {
    let position = new Vector(pawn.pos_x, pawn.pos_y);
    return position.equals(vector) ? true : false;
  });

  return p;
};

const moveOneTileBack = (vector) => {
  const x = vector.x;
  const y = vector.y;

  const x2 = x > 0 ? x - 1 : x + 1
  const y2 = y > 0 ? y - 1 : y + 1

  return new Vector(x2, y2)
}

export class MovePawn {
  constructor(gamestate, pawn, x, y, playerColor) {
    this.playerColor = playerColor;
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

  static Serialize = (moveObject) => {
    let killed = moveObject.isKill();
    let serialized = {
      turn: false, // TODO: ADD TURNS
      game_move: {
        side: moveObject.pawn.side,
        index: moveObject.pawn.index,
        start_x: moveObject.pawn.pos_x,
        start_y: moveObject.pawn.pos_y,
        dest_y: moveObject.y,
        dest_x: moveObject.x
      },
    }
    return killed ? {
      ...serialized,
      killed: {
        side: killed.side,
        index: killed.index
      }
    } : serialized
  }

  validate = () => {
    // check if game is still ongoing
    if (this.gamestate.is_end) {
      alert("Game is over! Can't move")
      return false;
    }

    // check if moved pawn belongs to player
    // console.log("validate (side / playerColor):", this.pawn.side, this.playerColor)
    if (this.pawn.side != this.playerColor) {
      alert("Cannot move opponent's pawns!")
      return false;
    }

    // if move is other than 1 diagonal tile and not a kill
    if (!this.absVec.equals(new Vector(1, 1)) && !this.isKill()) { 
      alert("Illegal move!")
      return false;
    }
    // if move is to overlap with other pawn
    if (
      this.gamestate.pawns.find(
        (pawn) => pawn.pos_x === this.x && pawn.pos_y === this.y
      )
    ) {
      alert("Position already occupied!")
      return false;
    }

    // check if it's move initiator's turn
    if (this.gamestate.current_color != this.playerColor) { 
      alert(`Cannot move. Current turn: ${this.gamestate.current_color}`)
      return false; 
    }

    // if move is kill
    if (this.absVec.equals(new Vector(2, 2)) && this.isKill()) return true;

    // if move is one tile diagonally
    if (this.absVec.equals(new Vector(1, 1))) return true;
  };

  getPossibleKills = () => {
    let positions = [];

    // scanner vector to switch between all fields around to check for available kills
    let scanner = new Vector(1, 1);

    // rotates the scanner by 90 degrees and returns new vector
    let rotatedScanner = (vector) => {
      vector.rotate(1.5708);
      let obj = vector.toObject();
      return new Vector(Math.round(obj.x), Math.round(obj.y));
    };

    // rotate the vector and check for pawn presence at its pos
    for (let i = 0; i < 4; i++) {
      if (getPawnAtVector(this.gamestate, scanner)) {
        /*
          TODO: check 
        */
        // positions.push()
      }

      scanner = rotatedScanner();
    }

    console.log("killPositions: ", positions)
  };

  isKill = () => {
    // shift vector to enemy pos
    let shift = this.vec.clone().divS(2);

    // calculate enemy pos
    let enemyPos = new Vector(this.pawn.pos_x, this.pawn.pos_y);
    enemyPos.add(shift);

    if (this.absVec.equals(new Vector(2, 2))) {
      let enemyPawn = this.gamestate.pawns.find((pawn) => {
        let position = new Vector(pawn.pos_x, pawn.pos_y);
        return position.equals(enemyPos) && pawn.side != this.pawn.side
      });

      return enemyPawn;
    } else return false;
  };
}

export class MoveQueen extends MovePawn {
  validate = () => {
    // check if game is still ongoing
    if (this.gamestate.is_end) {
      alert("Game is over! Can't move")
      return false;
    }

    // check if moved pawn belongs to player
    console.log("validate (side / playerColor):", this.pawn.side, this.playerColor)
    if (this.pawn.side != this.playerColor) {
      alert("Cannot move opponent's pawns!")
      return false;
    }

    // // if move is other than 1 diagonal tile and not a kill
    // if (!this.absVec.equals(new Vector(1, 1)) && !this.isKill()) { 
    //   alert("Illegal move!")
    //   return false;
    // }

    // check if move is diagonal
    if (this.absVec.x != this.absVec.y) {
      alert("Illegal move!")
      return false;
    }

    // if move is to overlap with other pawn
    if (
      this.gamestate.pawns.find(
        (pawn) => pawn.pos_x === this.x && pawn.pos_y === this.y
      )
    ) {
      alert("Position already occupied!")
      return false;
    }

    // check if it's move initiator's turn
    if (this.gamestate.current_color != this.playerColor) { 
      alert(`Cannot move. Current turn: ${this.gamestate.current_color}`)
      return false; 
    }

    // if move is kill
    if (this.isKill()) return true;

    // if move is diagonal
    if (this.absVec.x == this.absVec.y) {
      return true;
    }
  };

  isKill = () => {
    // shift vector to enemy pos
    let shift = moveOneTileBack(this.vec);

    // calculate enemy pos
    let enemyPos = new Vector(this.pawn.pos_x, this.pawn.pos_y);
    enemyPos.add(shift);

    if (this.absVec.equals(new Vector(2, 2))) {
      let enemyPawn = this.gamestate.pawns.find((pawn) => {
        let position = new Vector(pawn.pos_x, pawn.pos_y);
        return position.equals(enemyPos) && pawn.side != this.pawn.side
      });

      return enemyPawn;
    } else return false;
  };
}
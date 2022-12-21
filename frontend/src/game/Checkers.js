import * as board from "./board.json" assert { type: "json" };
import { Vector } from "vector2d";

const randomId = () =>
  Number([...Array(5)].map((e) => Math.floor(Math.random() * 9)).join(""));

const positionsTop = [
  [1, 0],
  [3, 0],
  [5, 0],
  [7, 0],
  [0, 1],
  [2, 1],
  [4, 1],
  [6, 1],
  [1, 2],
  [3, 2],
  [5, 2],
  [7, 2],
];
const positionsBottom = [
  [0, 7],
  [2, 7],
  [4, 7],
  [6, 7],
  [1, 6],
  [3, 6],
  [5, 6],
  [7, 6],
  [0, 5],
  [2, 5],
  [4, 5],
  [6, 5],
];
const mapPawns = (side, positions) =>
  positions.map((field, index) => {
    return {
      isQueen: false,
      isDead: false,
      side,
      index,
      pos: {
        x: field[0],
        y: field[1],
      },
    };
  });

class GameState {
  constructor(colorTop, colorBottom) {
    this.player_black_id;
    this.player_white_id;
    this.current_color = "w";
    this.turn = 1;
    this.id = randomId();
    this.moves = [];
    this.pawns = [
      mapPawns(colorTop, positionsTop),
      mapPawns(colorBottom, positionsBottom),
    ].flatMap((e) => e);
  }

  endTurn = () => {
    this.turn += 1;
    this.current_color = this.current_color === "w" ? "b" : "w";
  };

  movePawn = (pawn, destX, destY) => {
    let xShift = Math.abs(destX - pawn.pos.x);
    let yShift = Math.abs(destY - pawn.pos.y);

    if (!pawn.isQueen) {
      switch (true) {
        case xShift === 1 && yShift === 1:
          // check if destination is occupied already
          if (
            this.pawns.find(
              (pawn) => pawn.pos.x === destX && pawn.pos.y === destY
            )
          ) {
            this.endTurn();
            return false;
          } else {
            this.pawns = this.pawns.map((pawn) =>
              pawn.pos.x === destX && pawn.pos.y === destY
                ? { ...pawn, pos: { x: destX, y: destY } }
                : pawn
            );
            this.endTurn();
            return true;
          }

        case xShift === 2 && yShift === 2:
          // get the directional vector
          let shiftVec = new Vector(destX - pawn.pos.x, destY - pawn.pos.y);

          // get the potential enemy position
          let enemyVec = shiftVec.divS(2).toObject();

          // check if enemy pos is occupied and if pawn is enemy
          if (
            this.pawns.find(
              (p) =>
                p.pos.x === enemyVec.x &&
                p.pos.y === enemyVec.y &&
                p.side != pawn.side
            )
          ) {
            // kill the enemy pawn
            this.pawns = this.pawns.map((e) => {
              if (e.pos.x === enemyVec.x && e.pos.y === enemyVec.y) {
                return { ...e, isDead: true, pos: { x: -1, y: -1 } };
              }
            });

            // move selected pawn
            this.pawns = this.pawns.map((pawn) =>
              pawn.pos.x === destX && pawn.pos.y === destY
                ? { ...pawn, pos: { x: destX, y: destY } }
                : pawn
            );

            this.endTurn();
            return true;
          }
          break;

        default:
          return false
      }
    }

  //   if (!pawn.isQueen) {
  //     // normal pawn move case
  //     if (xShift === 1 && yShift === 1) {
  //       // check if destination is occupied already
  //       if (
  //         this.pawns.find(
  //           (pawn) => pawn.pos.x === destX && pawn.pos.y === destY
  //         )
  //       ) {
  //         this.endTurn();
  //         return false;
  //       } else {
  //         this.pawns = this.pawns.map((pawn) =>
  //           pawn.pos.x === destX && pawn.pos.y === destY
  //             ? { ...pawn, pos: { x: destX, y: destY } }
  //             : pawn
  //         );
  //         this.endTurn();
  //         return true;
  //       }
  //     } else if (xShift === 2 && yShift === 2) {
  //       // get the directional vector
  //       let shiftVec = new Vector(destX - pawn.pos.x, destY - pawn.pos.y);

  //       // get the potential enemy position
  //       let enemyVec = shiftVec.divS(2).toObject();

  //       // check if enemy pos is occupied and if pawn is enemy
  //       if (
  //         this.pawns.find(
  //           (p) =>
  //             p.pos.x === enemyVec.x &&
  //             p.pos.y === enemyVec.y &&
  //             p.side != pawn.side
  //         )
  //       ) {
  //         // kill the enemy pawn
  //         this.pawns = this.pawns.map((e) => {
  //           if (e.pos.x === enemyVec.x && e.pos.y === enemyVec.y) {
  //             return { ...e, isDead: true, pos: { x: -1, y: -1 } };
  //           }
  //         });

  //         // move selected pawn
  //         this.pawns = this.pawns.map((pawn) =>
  //           pawn.pos.x === destX && pawn.pos.y === destY
  //             ? { ...pawn, pos: { x: destX, y: destY } }
  //             : pawn
  //         );

  //         this.endTurn();
  //         return true;
  //       }
  //     }
  //   }
  //   // TODO: isQueen case
  //   // ------------------
  // };
}

let game = new GameState("b", "w");
console.log(JSON.stringify(game));

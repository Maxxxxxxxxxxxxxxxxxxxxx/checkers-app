use std::string;

use neo4rs::Node;
use serde::{Deserialize, Serialize};
use struct_field_names_as_array::FieldNamesAsArray;

// PAYLOADS --------------------------------

#[derive(Deserialize, Serialize, Debug)]
pub struct Game {
    pub name: String,
    pub mode: String,
    pub white_side: String,
    pub black_side: String,
    pub current_color: String,
    pub turn: i32,
    pub id: String,
    pub moves: Vec<Move>,
    pub pawns: Vec<Pawn>,
}

impl Game {
    pub fn from_dbo(dbo: GameDBO, moves: Vec<Move>, pawns: Vec<Pawn>) -> Self {
        Self {
            name: dbo.name,
            white_side: dbo.white_side,
            black_side: dbo.black_side,
            mode: dbo.mode,
            current_color: dbo.current_color,
            turn: dbo.turn,
            id: dbo.id,
            moves,
            pawns,
        }
    }
}

impl From<GameDBO> for Game {
    fn from(dbo: GameDBO) -> Self {
        Self {
            name: dbo.name,
            white_side: dbo.white_side,
            black_side: dbo.black_side,
            mode: dbo.mode,
            current_color: dbo.current_color,
            turn: dbo.turn,
            id: dbo.id,
            moves: Vec::<Move>::new(),
            pawns: Vec::<Pawn>::new(),
        }
    }
}

#[derive(Deserialize, Serialize, Clone, Debug)]
pub struct Pawn {
    pub is_queen: bool,
    pub is_dead: bool,
    pub side: String,
    pub index: i32,
    pub pos_x: i32,
    pub pos_y: i32,
}

impl TryFrom<Node> for Pawn {
    type Error = ();
    fn try_from(row: Node) -> Result<Self, Self::Error> {
        let is_queen: Option<bool> = row.get("is_queen");
        let is_dead: Option<bool> = row.get("is_dead");
        let index: Option<i64> = row.get("index");
        let side: Option<String> = row.get("side");
        let pos_x: Option<i64> = row.get("pos_x");
        let pos_y: Option<i64> = row.get("pos_y");

        // dbg!(&is_queen);
        // dbg!(&is_dead);
        // dbg!(&index);
        // dbg!(&side);

        match (is_queen, is_dead, index, side, pos_x, pos_y) {
            (Some(is_queen), Some(is_dead), Some(index), Some(side), Some(pos_x), Some(pos_y)) => {
                let x32 = pos_x as i32;
                let y32 = pos_y as i32;
                let index32 = index as i32;
                Ok(Pawn {
                    is_queen,
                    is_dead,
                    index: index32,
                    side,
                    pos_x: x32,
                    pos_y: y32,
                })
            }
            _ => Err(()),
        }
    }
}

#[derive(Deserialize, Serialize)]
pub struct Pos {
    pub x: i32,
    pub y: i32,
}

#[derive(Deserialize, Serialize, Debug, Clone)]
pub struct Move {
    pub index: i32,
    pub side: String,
    pub start_x: i32,
    pub start_y: i32,
    pub dest_x: i32,
    pub dest_y: i32,
}

impl TryFrom<Node> for Move {
    type Error = ();
    fn try_from(node: Node) -> Result<Self, Self::Error> {
        let index: Option<i64> = node.get("index");
        let side: Option<String> = node.get("side");
        let start_x: Option<i64> = node.get("start_x");
        let start_y: Option<i64> = node.get("start_y");
        let dest_x: Option<i64> = node.get("dest_x");
        let dest_y: Option<i64> = node.get("dest_y");

        match (index, side, start_x, start_y, dest_x, dest_y) {
            (Some(index), Some(side), Some(start_x), Some(start_y), Some(dest_x), Some(dest_y)) => {
                let index32 = index as i32;
                let sx = start_x as i32;
                let sy = start_y as i32;
                let dx = dest_x as i32;
                let dy = dest_y as i32;

                Ok(Self {
                    index: index32,
                    side,
                    start_x: sx,
                    start_y: sy,
                    dest_x: dx,
                    dest_y: dy,
                })
            }
            _ => Err(()),
        }
    }
}

impl Move {
    pub fn from_dbo(dbo: MoveDBO, index: i32, side: String) -> Self {
        Self {
            index,
            side,
            start_x: dbo.start_x,
            start_y: dbo.start_y,
            dest_x: dbo.dest_x,
            dest_y: dbo.dest_y,
        }
    }
}

impl PartialEq for Move {
    fn eq(&self, other: &Self) -> bool {
        if self.index == other.index &&
            self.side == other.side &&
            self.start_x == other.start_x &&
            self.start_y == other.start_y &&
            self.dest_x == other.dest_x &&
            self.dest_y == other.dest_y {
                true
            } else {
                false 
            }
    }
    fn ne(&self, other: &Self) -> bool {
        if self.index != other.index ||
            self.side != other.side ||
            self.start_x != other.start_x ||
            self.start_y != other.start_y ||
            self.dest_x != other.dest_x ||
            self.dest_y != other.dest_y {
                true
            } else {
                false 
            }
    }
}

// POST bodies --------------------------------

#[derive(Deserialize, Serialize, Clone)]
pub struct KilledPawn {
    pub side: String,
    pub index: i32
}

#[derive(Deserialize, Serialize)]
pub struct NewGameRequest {
    pub white: String,
    pub black: String,
    pub mode: String,
    pub name: String,
}

#[derive(Deserialize, Serialize)]
pub struct MoveRequest {
    pub id: String,
    pub game_move: Move,
    pub killed: Option<KilledPawn>
}

// DB structs --------------------------------

#[derive(Deserialize, Serialize)]
pub struct MoveDBO {
    pub start_x: i32,
    pub start_y: i32,
    pub dest_x: i32,
    pub dest_y: i32,
}

impl TryFrom<Node> for MoveDBO {
    type Error = ();
    fn try_from(node: Node) -> Result<Self, Self::Error> {
        let start_x: Option<i64> = node.get("start_x");
        let start_y: Option<i64> = node.get("start_x");
        let dest_x: Option<i64> = node.get("start_x");
        let dest_y: Option<i64> = node.get("start_x");

        match (start_x, start_y, dest_x, dest_y) {
            (Some(sx), Some(sy), Some(dx), Some(dy)) => {
                let start_x = sx as i32;
                let start_y = sy as i32;
                let dest_x = dx as i32;
                let dest_y = dy as i32;
                Ok(MoveDBO {
                    start_x,
                    start_y,
                    dest_x,
                    dest_y,
                })
            }
            _ => Err(()),
        }
    }
}

#[derive(Deserialize, Serialize, Debug, FieldNamesAsArray)]
pub struct GameDBO {
    pub name: String,
    pub mode: String,
    pub white_side: String,
    pub black_side: String,
    pub current_color: String,
    pub turn: i32,
    pub id: String,
}

impl TryFrom<Node> for GameDBO {
    type Error = ();
    fn try_from(node: Node) -> Result<Self, Self::Error> {
        let string_fields = GameDBO::FIELD_NAMES_AS_ARRAY.iter().fold(
            Vec::<String>::new(),
            |mut vec, fieldname| match node.get::<String>(fieldname) {
                Some(key) => {
                    vec.push(key);
                    vec
                }
                None => vec,
            },
        );

        // dbg!(&string_fields);

        let turn = node.get::<i64>("turn").unwrap() as i32;
        Ok(Self {
            name: String::from(&string_fields[0]),
            mode: String::from(&string_fields[1]),
            white_side: String::from(&string_fields[2]),
            black_side: String::from(&string_fields[3]),
            current_color: String::from(&string_fields[4]),
            turn,
            id: String::from(&string_fields[5]),
        })
    }
}

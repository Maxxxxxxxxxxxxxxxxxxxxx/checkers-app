use neo4rs::Node;
use serde::{Deserialize, Serialize};

// PAYLOADS --------------------------------

#[derive(Deserialize, Serialize)]
pub struct Game {
    pub current_color: String,
    pub turn: i32,
    pub id: String,
    pub moves: Vec<Move>,
    pub pawns: Vec<Pawn>,
}

impl Game {
    pub fn from_dbo(dbo: GameDBO, moves: Vec<Move>, pawns: Vec<Pawn>) -> Self {
        Self {
            current_color: dbo.current_color,
            turn: dbo.turn,
            id: dbo.id,
            moves,
            pawns,
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
            (
                Some(is_queen), 
                Some(is_dead), 
                Some(index), 
                Some(side), 
                Some(pos_x), 
                Some(pos_y)
            ) => {
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

#[derive(Deserialize, Serialize)]
pub struct Move {
    pub index: i32,
    pub side: String,
    pub previous: Pos,
    pub new: Pos,
}

// POST bodies --------------------------------

#[derive(Deserialize, Serialize)]
pub struct NewGameRequest {
    mode: String,
}

#[derive(Deserialize, Serialize)]
pub struct MoveRequest {
    pub index: i32,
    pub side: String,
    pub old_pos: Pos,
    pub new_pos: Pos,
}

// DB structs

#[derive(Deserialize, Serialize)]
pub struct GameDBO {
    pub current_color: String,
    pub turn: i32,
    pub id: String,
}

impl TryFrom<Node> for GameDBO {
    type Error = ();
    fn try_from(node: Node) -> Result<Self, Self::Error> {
        let current_color: Option<String> = node.get("current_color");
        let turn: Option<i64> = node.get("turn");
        let id: Option<String> = node.get("id");

        match (current_color, turn, id) {
            (
                Some(current_color),
                Some(turn),
                Some(id),
            ) => {
                let turn32 = turn as i32;
                Ok(GameDBO {
                    current_color,
                    turn: turn32,
                    id
                })
            },
            _ => Err(())
        }
    }
}
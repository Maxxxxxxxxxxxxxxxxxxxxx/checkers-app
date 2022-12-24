use serde::{Serialize, Deserialize};


// PAYLOADS --------------------------------


#[derive(Deserialize, Serialize)]
pub struct Game {
    pub current_color: String,
    pub turn: i32,
    pub id: String,
    // pub moves: Vec<Move>,
    pub pawns: Vec<Pawn>,
}

#[derive(Deserialize, Serialize)]
pub struct Pawn {
    pub is_queen: bool,
    pub is_dead: bool,
    pub side: String,
    pub index: i32,
    pub pos: Pos,
}

#[derive(Deserialize, Serialize)]
pub struct Pos {
    pub x: i32,
    pub y: i32
}

pub struct Move {
    pub index: i32,
    pub side: String,
    pub old_pos: Pos,
    pub new_pos: Pos,
}


// POST bodies --------------------------------


#[derive(Deserialize, Serialize)]
pub struct NewGameRequest {
    mode: String
}

#[derive(Deserialize, Serialize)]
pub struct MoveRequest {
    pub index: i32,
    pub side: String,
    pub old_pos: Pos,
    pub new_pos: Pos,
}
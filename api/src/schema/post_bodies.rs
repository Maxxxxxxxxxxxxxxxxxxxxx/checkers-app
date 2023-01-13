use super::*;

#[derive(Deserialize, Serialize, Clone)]
pub struct KilledPawn {
    pub side: String,
    pub index: i32,
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
    // pub id: String,
    pub game_move: Move,
    pub killed: Option<KilledPawn>,
    pub turn: bool,
}

#[derive(Deserialize, Serialize)]
pub struct AuthRequest {
    pub username: String,
    pub password: String,
}
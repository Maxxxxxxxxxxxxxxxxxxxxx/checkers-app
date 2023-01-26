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
    pub author: String,
}

#[derive(Deserialize, Serialize)]
pub struct MoveRequest {
    // pub id: String,
    pub game_move: Move,
    pub killed: Option<KilledPawn>,
    pub turn: bool,
}

#[derive(Deserialize, Serialize)]
pub struct AddComment {
    pub author: String,
    pub title: String,
    pub content: String,
}

#[derive(Deserialize, Serialize)]
pub struct AddBeer {
    pub author: String,
}

#[derive(Deserialize, Serialize, Debug)]
pub struct AuthRequest {
    pub username: String,
    pub password: String,
}

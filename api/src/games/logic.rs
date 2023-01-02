use uuid::Uuid;

use crate::schema::*;

pub const POSITIONS_TOP: [(i32, i32); 12] = [
    (1, 0),
    (3, 0),
    (5, 0),
    (7, 0),
    (0, 1),
    (2, 1),
    (4, 1),
    (6, 1),
    (1, 2),
    (3, 2),
    (5, 2),
    (7, 2),
];
pub const POSITIONS_BOTTOM: [(i32, i32); 12] = [
    (0, 7),
    (2, 7),
    (4, 7),
    (6, 7),
    (1, 6),
    (3, 6),
    (5, 6),
    (7, 6),
    (0, 5),
    (2, 5),
    (4, 5),
    (6, 5),
];

pub struct GameConfig {
    pub white_side: String,
    pub black_side: String,
    pub name: String,
    pub mode: String,
}

#[allow(dead_code)]
impl GameConfig {
    pub fn name(mut self, name: &str) -> Self {
        self.name = name.to_string();
        self
    }
    pub fn mode(mut self, name: &str) -> Self {
        self.name = name.to_string();
        self
    }
    pub fn white_at(mut self, side: &str) -> Self {
        self.white_side = side.to_string();
        self
    }
    pub fn black_at(mut self, side: &str) -> Self {
        self.black_side = side.to_string();
        self
    }
    pub fn build(self) -> Result<Self, String> {
        // todo: add error on bad args
        Ok(self)
    }
}

impl Default for GameConfig {
    fn default() -> Self {
        Self {
            black_side: "top".into(),
            white_side: "bottom".into(),
            name: "Game".into(),
            mode: "easy".into(),
        }
    }
}

impl From<GameConfig> for Game {
    fn from(cfg: GameConfig) -> Self {
        let pawns = [
            create_pawns("white", &cfg.white_side),
            create_pawns("black", &cfg.black_side),
        ].concat();
        Self {
            id: Uuid::new_v4().to_string(),
            name: cfg.name,
            mode: cfg.mode,
            pawns,
            white_side: cfg.white_side,
            black_side: cfg.black_side,
            current_color: "w".to_string(),
            turn: 1,
            moves: Vec::<Move>::new()
        }
    }
}

pub fn create_pawns(side: &str, top_bottom: &str) -> Vec<Pawn> {
    let positions = match top_bottom {
        "top" => POSITIONS_TOP,
        "bottom" => POSITIONS_BOTTOM,
        _ => panic!("Wrong pawn position supplied. Use \"top\" or \"bottom\""),
    };

    positions
        .iter()
        .enumerate()
        .map(|(index, (x, y))| {
            let i32index = index as i32;
            Pawn {
                is_queen: false,
                is_dead: false,
                side: side.to_string(),
                index: i32index,
                pos_x: *x,
                pos_y: *y,
            }
        })
        .collect()
}

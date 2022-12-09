#![allow(unused)]

use rand::Rng;
use rocket::serde::{Deserialize, Serialize};
use std::fmt;
use std::num;
use std::ops::Add;
use std::ops::Div;
use std::ops::Mul;
use std::ops::Sub;
use std::result::Result;

const POSITIONS_TOP: [(i32, i32); 12] = [
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
const POSITIONS_BOTTOM: [(i32, i32); 12] = [
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

#[derive(Clone, Serialize, Deserialize)]
#[serde(crate = "rocket::serde")]
struct Board {
    fields: Vec<Vector>,
}

#[derive(Debug, PartialEq, Clone, Copy, Serialize, Deserialize)]
#[serde(crate = "rocket::serde")]
pub enum Color {
    White,
    Black,
}

impl Board {
    pub fn new() -> Self {
        let vec = (0..8)
            .map(|row| (0..8))
            .enumerate()
            .map(|(row_index, row)| {
                let y = row_index as i32;
                row.map(move |x| Vector { x, y })
            })
            .flatten()
            .collect();

        Board { fields: vec }
    }
}

impl fmt::Debug for Board {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        let mut owned = "".to_owned();
        self.fields.iter().for_each(|vector| {
            if vector.x % 8 == 0 {
                owned.push_str("\n\n\n");
            }
            owned.push_str(format!("({},{})   ", vector.x, vector.y).as_str())
        });

        write!(f, "{}", owned);
        Ok(())
    }
}

#[derive(Debug, Clone, Copy, Serialize, Deserialize)]
#[serde(crate = "rocket::serde")]
pub struct Pawn {
    is_queen: bool,
    index: usize,
    pos: Vector,
    is_dead: bool,
    side: Color,
}

#[derive(Debug, Copy, Clone, Serialize, Deserialize)]
#[serde(crate = "rocket::serde")]
pub struct Vector {
    x: i32,
    y: i32,
}

impl Vector {
    pub fn new(x: i32, y: i32) -> Self {
        Vector { x, y }
    }
    pub fn abs_between(start: &Self, end: &Self) -> Self {
        let x = i32::abs(start.x - end.x);
        let y = i32::abs(start.y - end.y);
        Vector { x, y }
    }
    pub fn between(start: &Self, end: &Self) -> Self {
        let absolute = Self::abs_between(start, end);
        match (start.x < end.x, start.y < end.y) {
            (true, true) => absolute,
            (true, false) => Vector::new(absolute.x, -absolute.y),
            (false, true) => Vector::new(-absolute.x, absolute.y),
            (false, false) => absolute * -1,
        }
    }
}

impl PartialEq for Vector {
    fn eq(&self, other: &Self) -> bool {
        if self.y == other.y && self.x == other.x {
            true
        } else {
            false
        }
    }
    fn ne(&self, other: &Self) -> bool {
        if self.x != other.x || self.y != other.y {
            true
        } else {
            false
        }
    }
}

impl Add for Vector {
    type Output = Self;
    fn add(self, rhs: Self) -> Self::Output {
        Vector {
            x: self.x + rhs.x,
            y: self.y + rhs.y,
        }
    }
}

impl Sub for Vector {
    type Output = Self;
    fn sub(self, rhs: Self) -> Self::Output {
        Vector {
            x: self.x - rhs.x,
            y: self.y - rhs.y,
        }
    }
}

impl Mul<i32> for Vector {
    type Output = Self;
    fn mul(self, rhs: i32) -> Self::Output {
        Vector {
            x: self.x * rhs,
            y: self.y * rhs,
        }
    }
}

impl Div<i32> for Vector {
    type Output = Self;
    fn div(self, rhs: i32) -> Self::Output {
        Vector {
            x: self.x / rhs,
            y: self.y / rhs,
        }
    }
}

#[derive(Debug, Clone, Copy, Serialize, Deserialize)]
#[serde(crate = "rocket::serde")]
pub struct Move {
    player: Color,
    start: Vector,
    dest: Vector,
}

pub struct IDBuilder;
impl IDBuilder {
    pub fn new() -> String {
        let nums: Vec<i32> = (0..7)
            .map(|pos| rand::thread_rng().gen_range(0..=9))
            .collect();

        let string: String = nums.iter().map(|num| num.to_string()).collect();
        return string;
    }
}

#[derive(Serialize, Deserialize)]
#[serde(crate = "rocket::serde")]
pub struct GameState {
    pub player_black_id: String,
    pub player_white_id: String,
    pub id: String,
    // board: Board,
    pub moves: Vec<Move>,
    pub pawns_white: Vec<Pawn>,
    pub pawns_black: Vec<Pawn>,
}

impl GameState {
    pub fn new() -> Self {
        GameState {
            id: IDBuilder::new(),
            player_white_id: String::from("0001"),
            player_black_id: String::from("0002"),
            // board: Board::new(),
            moves: Vec::<Move>::new(),
            pawns_white: POSITIONS_BOTTOM
                .iter()
                .enumerate()
                .map(|(index, point)| Pawn {
                    is_queen: false,
                    pos: Vector {
                        x: point.0,
                        y: point.1,
                    },
                    index,
                    is_dead: false,
                    side: Color::White,
                })
                .collect(),
            pawns_black: POSITIONS_TOP
                .iter()
                .enumerate()
                .map(|(index, point)| Pawn {
                    is_queen: false,
                    pos: Vector {
                        x: point.0,
                        y: point.1,
                    },
                    index,
                    is_dead: false,
                    side: Color::Black,
                })
                .collect(),
        }
    }

    pub fn get_pawn(&self, pos: Vector) -> Result<&Pawn, ()> {
        let find_white = self.pawns_white.iter().find(|pawn| pawn.pos == pos);
        let find_black = self.pawns_black.iter().find(|pawn| pawn.pos == pos);

        match (find_white, find_black) {
            (Some(pawn), None) => Ok(pawn),
            (None, Some(pawn)) => Ok(pawn),
            _ => Err(()),
        }
    }

    fn get_pawn_mut(&mut self, pos: Vector) -> Result<&mut Pawn, ()> {
        let white = match self.pawns_white.iter_mut().find(|pawn| pawn.pos == pos) {
            Some(pawn) => Ok(pawn),
            None => Err(()),
        };

        if white.is_ok() {
            white
        } else {
            match self.pawns_black.iter_mut().find(|pawn| pawn.pos == pos) {
                Some(pawn) => Ok(pawn),
                None => Err(()),
            }
        }
    }

    fn check_field_occupied(&self, vector: Vector) -> Result<Color, ()> {
        let black = self.pawns_black.iter().find(|p| p.pos == vector);
        let white = self.pawns_white.iter().find(|p| p.pos == vector);
        match (black, white) {
            (Some(_), None) => Ok(Color::Black),
            (None, Some(_)) => Ok(Color::White),
            _ => Err(()),
        }
    }

    fn move_pawn(&mut self, mov: Move) -> Result<(), ()> {
        match self.get_pawn(mov.start) {
            Ok(p) => {
                let enemy_pos = match self
                    .check_field_occupied(mov.start + (Vector::between(&mov.start, &mov.dest) / 2))
                {
                    Ok(color) => {
                        if mov.player != color {
                            Some(mov.start + (Vector::between(&mov.start, &mov.dest) / 2))
                        } else {
                            None
                        }
                    }
                    Err(_) => None,
                };

                // check if move is normal
                if self.check_field_occupied(mov.dest).is_err()
                    && Vector::abs_between(&mov.start, &mov.dest) == Vector::new(1, 1)
                {
                    let mutable_pawn = self.get_pawn_mut(mov.start).unwrap();

                    mutable_pawn.pos = mov.dest;
                    drop(mutable_pawn);

                    self.moves.push(mov);

                    Ok(())
                }
                // check if move is kill
                else if self.check_field_occupied(mov.dest).is_err()
                    && Vector::abs_between(&mov.start, &mov.dest) == Vector::new(2, 2)
                    && enemy_pos.is_some()
                {
                    let enemy = self.get_pawn_mut(enemy_pos.unwrap()).unwrap();

                    enemy.is_dead = true;
                    enemy.pos = Vector::new(-1, -1);

                    dbg!(&enemy);
                    drop(enemy);

                    let mutable_pawn = self.get_pawn_mut(mov.start).unwrap();

                    mutable_pawn.pos = mov.dest;
                    drop(mutable_pawn);

                    self.moves.push(mov);

                    Ok(())
                } else {
                    Err(())
                }
            }
            Err(_) => Err(()),
        }
    }

    pub fn create_move(
        &mut self,
        pawn_index: usize,
        side: Color,
        x: i32,
        y: i32,
    ) -> Result<(), ()> {
        match side {
            Color::Black => {
                let pawn = self
                    .pawns_black
                    .iter()
                    .find(|pawn| pawn.index == pawn_index);

                match pawn {
                    // if pawn exists
                    Some(p) => {
                        let new_move = Move {
                            player: side,
                            start: Vector {
                                x: p.pos.x,
                                y: p.pos.y,
                            },
                            dest: Vector { x, y },
                        };
                        // returns Err(()) if move invalid
                        self.move_pawn(new_move)
                    }
                    // if pawn doesn't exist
                    None => Err(()),
                }
            }
            Color::White => {
                let pawn = self
                    .pawns_white
                    .iter()
                    .find(|pawn| pawn.index == pawn_index);

                match pawn {
                    // if pawn exists
                    Some(p) => {
                        let new_move = Move {
                            player: side,
                            start: Vector {
                                x: p.pos.x,
                                y: p.pos.y,
                            },
                            dest: Vector { x, y },
                        };
                        // returns Err(()) if move invalid
                        self.move_pawn(new_move)
                    }
                    // if pawn doesn't exist
                    None => Err(()),
                }
            }
        }
    }
}

impl std::fmt::Debug for GameState {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        let mut owned = "".to_owned();
        let board = Board::new();
        
        board.fields.iter().for_each(|vector| {
            let pawn_white = &self.pawns_white.iter().find(|pawn| &pawn.pos == vector);
            let pawn_black = &self.pawns_black.iter().find(|pawn| &pawn.pos == vector);

            if vector.x % 8 == 0 {
                owned.push_str("\n\n\n");
            }

            match (pawn_white, pawn_black) {
                (Some(pawn), None) => owned.push_str(format!("(W{})   ", pawn.index).as_str()),
                (None, Some(pawn)) => owned.push_str(format!("(B{})   ", pawn.index).as_str()),
                (None, None) => owned.push_str(format!("({},{})   ", vector.x, vector.y).as_str()),
                (Some(pawn1), Some(pawn2)) => {
                    owned.push_str(format!("(W{}B{})   ", pawn1.index, pawn2.index).as_str())
                }
            }
        });

        write!(f, "{}", owned);
        Ok(())
    }
}

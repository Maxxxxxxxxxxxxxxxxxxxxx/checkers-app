#![allow(unused)]

pub mod vector;
pub mod board;
pub mod gamestate;

use rand::Rng;
use rocket::serde::{Deserialize, Serialize};
use std::fmt;
use std::num;
use std::result::Result;

pub use self::board::Board;
pub use self::vector::Vector;
pub use self::gamestate::GameState;

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

#[derive(Debug, PartialEq, Clone, Copy, Serialize, Deserialize)]
#[serde(crate = "rocket::serde")]
pub enum Color {
    White,
    Black,
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

#[derive(Debug, Clone, Copy, Serialize, Deserialize)]
#[serde(crate = "rocket::serde")]
pub struct Move {
    player: Color,
    start: Vector,
    dest: Vector,
}

// to get just a random 5 digit id: 
// IDBuilder::new().random().build()
pub struct IDBuilder { content: Option<String>, digits: i32 }
impl IDBuilder {
    pub fn new() -> Self {
		Self { content: None, digits: 5 }
    }

	pub fn len(&self, digits: i32) -> Self {
		Self { content: self.content.clone(), digits }
	}

    pub fn random(&mut self) -> Self {
		let nums: Vec<i32> = (0..self.digits)
            .map(|pos| rand::thread_rng().gen_range(0..=9))
            .collect();
        let content: String = nums.iter().map(|num| num.to_string()).collect();
        return Self { content: Some(content), digits: self.digits }
    }

    pub fn build(&mut self) -> String {
		match self.content.clone() {
			None => self.random().content.unwrap(),
			Some(s)  => s
		}
    }
}
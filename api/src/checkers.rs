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

mod board;
mod vector;

pub use self::board::Board;
pub use self::vector::Vector;

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

pub struct IDBuilder { current: String }
impl IDBuilder {
    pub fn new() -> String {
        let nums: Vec<i32> = (0..7)
            .map(|pos| rand::thread_rng().gen_range(0..=9))
            .collect();

        let string: String = nums.iter().map(|num| num.to_string()).collect();
        return string;
    }
    pub fn in_range(from: i32, to: i32) -> Self {

    }
    pub fn build() -> String {
        
    }
}
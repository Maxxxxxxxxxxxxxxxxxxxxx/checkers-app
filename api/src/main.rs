#![allow(unused)]

#[macro_use]
extern crate rocket;

mod checkers;

use checkers::Color;
use checkers::GameState;
use checkers::Vector;
use rocket::serde::json;
use rocket::serde::Serialize;
use rocket::State;
use std::ops::DerefMut;
use std::sync::Arc;
use std::sync::Mutex;

type GamesMutex = Mutex<Vec<GameState>>;

#[derive(Serialize)]
#[serde(crate = "rocket::serde")]
struct IdsArray {
    content: Vec<String>,
}

#[get("/example")]
fn game() -> String {
    let new_game = GameState::new();
    let stringified = json::to_pretty_string(&new_game).unwrap_or(String::from(""));

    format!("{}", stringified)
}

#[get("/game/all")]
fn all_games(current_gamestates: &State<GamesMutex>) -> String {
    let unwrapped = current_gamestates.inner();

    let content: Vec<String> = unwrapped
        .lock()
        .unwrap()
        .iter()
        .map(|gamestate| gamestate.id.clone())
        .collect();

    let array = IdsArray { content };
    json::to_pretty_string(&array).unwrap()
}

#[put("/game/new")]
fn new_game(current_gamestates: &State<GamesMutex>) -> String {
    let game = GameState::new();
    let id = game.id.clone();

    current_gamestates.lock().unwrap().push(game);

    return id;
}

#[put("/game/<id>?move&<side>&<index>&<x>&<y>")]
fn create_move(
    current_gamestates: &State<GamesMutex>,
    id: String,
    index: usize,
    side: String,
    x: i32,
    y: i32,
) -> Option<String> {
    let mut state = current_gamestates.inner();
    match state.lock().unwrap().iter_mut().find(|game| game.id == id) {
        Some(game) => {
            let move_side = match side.as_str() {
                "w" => Some(Color::White),
                "b" => Some(Color::Black),
                _ => None,
            };

            match move_side {
                Some(s) => {
                    let result = game.create_move(index, s, x, y);
                    match result {
                        Ok(_) => Some(String::from(json::to_pretty_string(&game).unwrap())),
                        Err(_) => None
                    }
                }
                None => Some(String::from("abc")),
            }
        }
        None => None,
    }
}

#[launch]
fn rocket() -> _ {
    // temporary
    let mut current_gamestates: GamesMutex = Mutex::new(<Vec<GameState>>::new());
    rocket::build()
        .manage(current_gamestates)
        .mount("/", routes![game, new_game, all_games, create_move])
    // .register("/", catchers![not_found])
}

// fn main() {
//     let mut game = GameState::new();
//     // dbg!(&game);

//     dbg!(game.create_move(8, Color::Black, 0, 3));
//     dbg!(&game);

//     game.create_move(8, Color::Black, 1, 4);
//     game.create_move(9, Color::White, 0, 3);

//     dbg!(&game);
//     // game.create_move(8, Color::Black, 1, 3);
//     // dbg!(&game);
//     // game.create_move(8, Color::Black, 1, 4);
//     // dbg!(&game);
//     // game.create_move(9, Color::White, 0, 3);
//     // dbg!(&game);
// }

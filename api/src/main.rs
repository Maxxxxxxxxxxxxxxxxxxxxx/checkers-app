#![allow(unused)]

#[macro_use]
extern crate rocket;

mod checkers;

use checkers::Color;
use checkers::GameState;
use checkers::Vector;
use checkers::Board;
use rocket::serde::json;
use rocket::serde::Serialize;
use rocket::State;
use std::ops::DerefMut;
use std::sync::Arc;
use std::sync::Mutex;
use rocket::http::Method;
use rocket::http::Header;
use rocket::{Request, Response};
use rocket::fairing::{Fairing, Info, Kind};

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

#[get("/games/all")]
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

#[get("/games/<id>")]
fn find(current_gamestates: &State<GamesMutex>, id: String) -> Option<String> {
    let unwrapped = current_gamestates.inner();

    match unwrapped
        .lock()
        .unwrap()
        .iter()
        .find(|gamestate| gamestate.id == id)
    {
        Some(content) => Some(json::to_pretty_string(&content).unwrap()),
        None => None
    }
}


#[post("/games/new")]
fn new_game(current_gamestates: &State<GamesMutex>) -> String {
    let game = GameState::new();
    let response = json::to_pretty_string(&game).unwrap();

    current_gamestates.lock().unwrap().push(game);

    return response;
}

#[put("/games/game/<id>?move&<side>&<index>&<x>&<y>")]
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

pub struct CORS;

#[rocket::async_trait]
impl Fairing for CORS {
    fn info(&self) -> Info {
        Info {
            name: "Add CORS headers to responses",
            kind: Kind::Response
        }
    }

    async fn on_response<'r>(&self, _request: &'r Request<'_>, response: &mut Response<'r>) {
        response.set_header(Header::new("Access-Control-Allow-Origin", "*"));
        response.set_header(Header::new("Access-Control-Allow-Methods", "POST, GET, PATCH, OPTIONS"));
        response.set_header(Header::new("Access-Control-Allow-Headers", "*"));
        response.set_header(Header::new("Access-Control-Allow-Credentials", "true"));
    }
}

#[launch]
fn rocket() -> _ {
    let mut current_gamestates: GamesMutex = Mutex::new(<Vec<GameState>>::new());
    
    let mut example_gamestate = GameState::new();
    example_gamestate.id = String::from("1");

    current_gamestates
        .lock()
        .unwrap()
        .push(example_gamestate);

    rocket::build()
        .manage(current_gamestates)
        .mount("/", routes![game, new_game, all_games, create_move, find])
        .attach(CORS)
}

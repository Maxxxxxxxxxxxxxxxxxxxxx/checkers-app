use std::str::FromStr;

use crate::chat::*;
use actix::Actor;
use actix_cors::Cors;
use actix_web::web::Data;
use actix_web::{App, HttpServer};
use env_logger;
use games::controllers as game_route;
use uuid::Uuid;

mod games;
mod schema;
mod utils;
mod chat;

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    
    std::env::set_var("RUST_LOG", "debug");
    env_logger::init();
    
    let game_ids = games::db::all()
        .await
        .unwrap()
        .iter()
        .map(move |game| Uuid::from_str(&game.id).unwrap())
        .collect::<Vec<Uuid>>();

    let chat_server = Lobby::default()
        .attach_ids(game_ids)
        .start();
    
    HttpServer::new(move || {
        let cors = Cors::permissive(); // temporary

        App::new()
            .service(chat_route::room)
            .service(chat_route::global)
            .app_data(Data::new(chat_server.clone()))
            .wrap(cors)
            .service(game_route::new_game)
            .service(game_route::get_game)
            .service(game_route::list_games)
            .service(game_route::put_move)
    })
    .bind(("127.0.0.1", 8080))?
    .run()
    .await
}
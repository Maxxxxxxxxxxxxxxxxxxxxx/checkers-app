use std::str::FromStr;

use crate::chat::*;
use actix::Actor;
use actix_cors::Cors;
use actix_web::web::Data;
use actix_web::{App, HttpServer};
use crud::games::controllers as game_route;
use crud::users::controllers as user_route;
use crud::comments::controllers as comment_route;
use env_logger;
use uuid::Uuid;

mod chat;
mod crud;
mod db;
mod schema;
mod utils;

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    std::env::set_var("RUST_LOG", "debug");
    env_logger::init();

    let chat_server = match db::game::all().await {
        Ok(vec) => {
            let ids = vec
                .iter()
                .map(move |game| Uuid::from_str(&game.id).unwrap())
                .collect::<Vec<Uuid>>();
            Some(Lobby::default().attach_ids(ids).start())
        }
        Err(_) => Some(Lobby::default().start()),
    }
    .unwrap();

    HttpServer::new(move || {
        let cors = Cors::permissive();

        App::new()
            .service(chat_route::room)
            .service(chat_route::global)
            .app_data(Data::new(chat_server.clone()))
            .wrap(cors)
            // games CRUD routes
            .service(game_route::new_game)
            .service(game_route::get_game)
            .service(game_route::list_games)
            .service(game_route::put_move)
            .service(game_route::preview)
            .service(game_route::delete)
            .service(game_route::promote)
            .service(game_route::end_game)
            // users CRUD routes
            .service(user_route::all_users)
            .service(user_route::user_info)
            .service(user_route::count)
            .service(user_route::register)
            .service(user_route::login)
            .service(user_route::delete)
            // comments CRUD routes
            .service(comment_route::add)
            .service(comment_route::count_all)
            .service(comment_route::of_game)
            .service(comment_route::delete)
            .service(comment_route::edit)
            .service(comment_route::give_beer)
            .service(comment_route::remove_beer)
    })
    .bind(("127.0.0.1", 8080))?
    .run()
    .await
}

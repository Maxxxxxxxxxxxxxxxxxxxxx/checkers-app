use crate::chat::*;
use actix::Actor;
use actix_cors::Cors;
use actix_web::web::Data;
use actix_web::{App, HttpServer};
use env_logger;
use games::controllers as game_route;

mod games;
mod schema;
mod utils;
mod chat;

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    
    std::env::set_var("RUST_LOG", "debug");
    env_logger::init();
    
    let chat_server = Lobby::default().start();

    HttpServer::new(move || {

        let cors = Cors::permissive(); // temporary

        App::new()
            .service(ws_route)
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
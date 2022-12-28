use actix_cors::Cors;
use actix_web::{App, HttpServer};

mod db;
mod game;
mod game_controller;
mod structs;
mod utils;

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    HttpServer::new(|| {
        let cors = Cors::permissive(); // temporary

        App::new()
            .wrap(cors)
            .service(game_controller::new_game)
            .service(game_controller::get_game)
            .service(game_controller::list_games)
    })
    .bind(("127.0.0.1", 8080))?
    .run()
    .await
}

use actix_web::{web, App, HttpRequest, HttpServer, Responder};

mod db;
mod game;
mod game_controller;
mod structs;
mod utils;

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    HttpServer::new(|| {
        App::new()
            .service(game_controller::new_game)
            .service(game_controller::get_game)
            // .route("/", web::get().to(greet))
            // .route("/{name}", web::get().to(greet))
    })
    .bind(("127.0.0.1", 8080))?
    .run()
    .await
}

use crate::db;
use crate::structs::NewGameRequest;
use crate::utils::*;
use actix_web::HttpRequest;
use actix_web::{get, post, web, HttpResponse};

#[get("/games")]
pub async fn list_games() -> HttpResponse {
    match db::get_all_games().await {
        Ok(games) => ResponseType::Ok(games).get_response(),
        Err(_) => {
            ResponseType::NotFound(NotFoundMessage::new("No games in the database!")).get_response()
        }
    }
}

#[get("/games/{id}")]
pub async fn get_game(req: HttpRequest) -> HttpResponse {
    let id = req.match_info().query("id");
    match db::get_game(id).await {
        Ok(game) => ResponseType::Ok(game).get_response(),
        Err(_) => ResponseType::NotFound(NotFoundMessage::new("Not found!")).get_response(),
    }
}

#[post("/games/new_game")]
pub async fn new_game(data: web::Json<NewGameRequest>) -> HttpResponse {
    match db::create_game(data.white.as_str(), data.black.as_str()).await {
        Ok(game) => ResponseType::Created(game).get_response(),
        Err(_) => ResponseType::BadRequest(NotFoundMessage::new("Bad request!")).get_response(),
    }
}

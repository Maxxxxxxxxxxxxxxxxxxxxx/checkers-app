use crate::db;
use crate::game::GameConfig;
use crate::structs::*;
use crate::utils::*;
use actix_web::HttpRequest;
use actix_web::{get, post, put, web, HttpResponse};

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
    let config = GameConfig::new()
        .white_at(&data.white)
        .black_at(&data.black)
        .mode(&data.mode)
        .name(&data.name);

    match db::create_game(config).await {
        Ok(game) => ResponseType::Created(game).get_response(),
        Err(_) => ResponseType::BadRequest(NotFoundMessage::new("Bad request!")).get_response(),
    }
}

#[put("/games/{id}")]
pub async fn put_move(data: web::Json<MoveRequest>) -> HttpResponse {
    match db::add_move(data.game_move.clone(), data.id.clone(), data.killed.clone()).await {
        Ok(m) => ResponseType::Created(m).get_response(),
        Err(_) => ResponseType::BadRequest(NotFoundMessage::new("Bad request!")).get_response()
    }
}

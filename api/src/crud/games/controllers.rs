use super::logic::*;
use crate::db;
use crate::schema::*;
use crate::utils::*;
use actix_web::HttpRequest;
use actix_web::{get, post, delete, put, web, HttpResponse};

#[get("/games")]
pub async fn list_games() -> HttpResponse {
    match db::game::all().await {
        Ok(games) => ResponseType::Ok(games).get_response(),
        Err(_) => {
            ResponseType::NotFound(NotFoundMessage::new("No games in the database!")).get_response()
        }
    }
}

#[get("/games/game/{id}")]
pub async fn get_game(req: HttpRequest) -> HttpResponse {
    let id = req.match_info().query("id");
    match db::game::get(id).await {
        Ok(game) => ResponseType::Ok(game).get_response(),
        Err(_) => ResponseType::NotFound(NotFoundMessage::new("Not found!")).get_response(),
    }
}

#[post("/games/new_game")]
pub async fn new_game(data: web::Json<NewGameRequest>) -> HttpResponse {
    let config = GameConfig::default()
        .white_at(&data.white)
        .black_at(&data.black)
        .mode(&data.mode)
        .name(&data.name)
        .author(&data.author);

    match db::game::create(config).await {
        Ok(game) => ResponseType::Created(game).get_response(),
        Err(_) => ResponseType::NotFound(NotFoundMessage::new("Error!")).get_response(),
    }
}

#[put("/games/game/{id}")]
pub async fn put_move(req: HttpRequest, data: web::Json<MoveRequest>) -> HttpResponse {
    let id = req.match_info().query("id");
    match db::game::add_move(data.game_move.clone(), id.to_string(), data.killed.clone()).await {
        Ok(m) => ResponseType::Created(m).get_response(),
        Err(_) => ResponseType::BadRequest(NotFoundMessage::new("Bad request!")).get_response(),
    }
}

#[put("/games/preview")]
pub async fn preview(data: web::Json<NewGameRequest>) -> HttpResponse {
    let config = GameConfig::default()
        .white_at(&data.white)
        .black_at(&data.black)
        .mode(&data.mode)
        .name(&data.name)
        .author(&data.author);

    let game = Game::from(config);

    ResponseType::Ok(game).get_response()
}

#[delete("/games/game/{game_id}")]
pub async fn delete(req: HttpRequest) -> HttpResponse {
    let id = req.match_info().query("game_id").to_string();

    match db::game::delete(id).await {
        Ok(_) => ResponseType::Ok("Deleted!").get_response(),
        Err(_) => ResponseType::NotFound("Game doesn't exist!").get_response(),
    }
}

#[put("/games/game/{game_id}/promote")]
pub async fn promote(req: HttpRequest, payload: web::Json<PromotePawn>) -> HttpResponse {
    let id = req.match_info().query("game_id").to_string();

    log::info!("promote pawn for {}{}", &payload.side, &payload.index);

    match db::game::promote_pawn(id, payload.index.to_owned(), payload.side.to_owned()).await {
        Ok(p) => ResponseType::Ok(p).get_response(),
        Err(_) => ResponseType::NotFound("Pawn not found!").get_response()
    }
}

#[put("/games/game/{game_id}/end")]
pub async fn end_game(req: HttpRequest) -> HttpResponse {
    let id = req.match_info().query("game_id").to_string();
    // let winner = req.match_info().query("winner").to_string();

    match db::game::end_game(id /*winner*/).await {
        Ok(p) => ResponseType::Ok(p).get_response(),
        Err(_) => ResponseType::NotFound("Pawn not found!").get_response()
    }
}
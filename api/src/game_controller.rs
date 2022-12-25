use crate::structs::*;
use crate::utils::*;
use crate::db;
use actix_web::HttpRequest;
use actix_web::{
    HttpResponse,
    get,
    post,
};

#[get("/games")]
pub async fn list_games() -> HttpResponse {
    match db::connect().await {
        Ok(graph) => {
            /*
                TODO: fetch games list from database
            */
            
            unimplemented!()
        },
        Err(_) => ResponseType::NotFound(
            NotFoundMessage::new("Failed to connect with db!")
        ).get_response()
    }
}

#[get("/games/{id}")]
pub async fn get_game(req: HttpRequest) -> HttpResponse {
    let id= req.match_info().query("id");
    match db::get_game(id).await {
        Ok(game) => ResponseType::Ok(game).get_response(),
        Err(_) => ResponseType::NotFound(
            NotFoundMessage::new("Not found!")
        ).get_response()
    }
}

#[post("/games/new_game")]
pub async fn new_game() -> HttpResponse {
    match db::create_game("bottom", "top").await {
        Ok(_) => ResponseType::Created(()).get_response(),
        Err(_) => ResponseType::NotFound(
            NotFoundMessage::new("Error while creating in db!")
        ).get_response()
    }
}
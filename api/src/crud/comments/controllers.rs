use crate::db;
use crate::schema::*;
use crate::utils::*;
use actix_web::HttpRequest;
use actix_web::web::Json;
use actix_web::{delete, get, post, put, web, HttpResponse};

#[get("/comments/{game_id}")]
pub async fn of_game(req: HttpRequest) -> HttpResponse {
    let gameid = req.match_info().query("game_id");
    match db::comment::of_game(gameid.to_string()).await {
        Ok(payload) => ResponseType::Ok(payload).get_response(),
        Err(_) => ResponseType::NotFound(NotFoundMessage::new("No comment")).get_response(),
    }
}

#[get("/comments/{game_id}/count")]
pub async fn count(req: HttpRequest) -> HttpResponse {
    unimplemented!();
}

#[get("/comments")]
pub async fn all(req: HttpRequest) -> HttpResponse {
    unimplemented!();
}

#[put("/comments/{game_id}/{comment_id}")]
pub async fn edit(req: HttpRequest) -> HttpResponse {
    unimplemented!();
}

#[post("/comments/{game_id}")]
pub async fn add(req: HttpRequest, payload: Json<AddComment>) -> HttpResponse {
    let gameid = req.match_info().query("game_id");
    let comment = Comment::from(payload.into_inner());

    match db::comment::add(gameid.to_string(), comment).await {
        Ok(p) => { 
            ResponseType::Ok(p).get_response() 
        },
        Err(_) => {
            log::error!("Error adding comment!");
            ResponseType::BadRequest("Not found!").get_response()
        }
    }
}

#[post("/comments/comment/{comment_id}")]
pub async fn give_beer(req: HttpRequest, payload: Json<AddBeer>) -> HttpResponse {
    let id = req.match_info().query("comment_id");

    match db::comment::give_beer(id.to_string(), payload.author.to_string()).await {
        Ok(p) => { 
            ResponseType::Ok(p).get_response() 
        },
        Err(_) => {
            log::error!("Error adding beer!");
            ResponseType::BadRequest("Request must include author username!").get_response()
        }
    }
}
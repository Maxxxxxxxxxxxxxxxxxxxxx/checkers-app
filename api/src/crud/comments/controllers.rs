use crate::db;
use crate::schema::*;
use crate::utils::*;
use actix_web::HttpRequest;
use actix_web::web::Json;
use actix_web::{delete, get, post, put, HttpResponse};

#[get("games/game/{game_id}/comments")]
pub async fn of_game(req: HttpRequest) -> HttpResponse {
    let gameid = req.match_info().query("game_id");
    match db::comment::of_game(gameid.to_string()).await {
        Ok(payload) => ResponseType::Ok(payload).get_response(),
        Err(_) => ResponseType::NotFound(NotFoundMessage::new("No comment")).get_response(),
    }
}

#[get("games/game/{game_id}/comments/count")]
pub async fn count(req: HttpRequest) -> HttpResponse {
    let id = req.match_info().query("game_id").to_string();
    match db::comment::count_for_game(id).await {
        Ok(int) => ResponseType::Ok(int).get_response(),
        Err(_) => ResponseType::NotFound("Failed to fetch comments!").get_response()
    }
}

#[get("/comments")]
pub async fn count_all() -> HttpResponse {
    match db::comment::count_all().await {
        Ok(int) => ResponseType::Ok(int).get_response(),
        Err(_) => ResponseType::NotFound("Failed to fetch comments!").get_response()
    }
}

#[put("/comments/{comment_id}")]
pub async fn edit(req: HttpRequest, payload: Json<AddComment>) -> HttpResponse {
    let cid = req.match_info().query("comment_id");
    let addcomment = payload.into_inner();

    match db::comment::edit(cid.to_string(), addcomment).await {
        Ok(c) => ResponseType::Ok(c).get_response(),
        Err(_) => ResponseType::NotFound("Failed to edit comment!").get_response()
    }
}

#[post("games/game/{game_id}/comments")]
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

#[post("/comments/comment/{comment_id}/beer/{author}")]
pub async fn give_beer(req: HttpRequest) -> HttpResponse {
    let id = req.match_info().query("comment_id");
    let author = req.match_info().query("author");

    match db::comment::give_beer(id.to_string(), author.to_string()).await {
        Ok(p) => { 
            ResponseType::Ok(p).get_response() 
        },
        Err(_) => {
            log::error!("Error adding beer!");
            ResponseType::BadRequest("Request must include author username!").get_response()
        }
    }
}

#[delete("/comments/comment/{comment_id}/beer/{author}")]
pub async fn remove_beer(req: HttpRequest) -> HttpResponse {
    let id = req.match_info().query("comment_id");
    let author = req.match_info().query("author");

    match db::comment::remove_beer(id.to_string(), author.to_string()).await {
        Ok(p) => { 
            ResponseType::Ok(p).get_response() 
        },
        Err(_) => {
            log::error!("Error removing beer!");
            ResponseType::NotFound("Beer not found!").get_response()
        }
    }
}

#[delete("/comments/comment/{comment_id}")]
pub async fn delete(req: HttpRequest) -> HttpResponse {
    let id = req.match_info().query("comment_id");

    match db::comment::delete(id.to_string()).await {
        Ok(()) => ResponseType::Ok(()).get_response(),
        Err(_) => ResponseType::NotFound("Failed to delete / not found!").get_response()
    }
}
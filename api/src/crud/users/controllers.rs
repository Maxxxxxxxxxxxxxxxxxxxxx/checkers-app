use crate::db;
use crate::utils::*;
use crate::schema::*;
use actix_web::HttpRequest;
use actix_web::{get, post, put, delete, web, HttpResponse};

#[get("/users/<username>")]
pub async fn user_info(req: HttpRequest) -> HttpResponse {
    let name = req.match_info().query("id");

    match db::user::get(name.to_string()).await {
        Ok(user) => ResponseType::Ok(user).get_response(),
        Err(_) => {
            ResponseType::NotFound(NotFoundMessage::new("User not found!")).get_response()
        }
    }
}

#[get("/users")]
pub async fn all_users() -> HttpResponse {
    match db::user::all().await {
        Ok(users) => ResponseType::Ok(users).get_response(),
        Err(_) => {
            ResponseType::NotFound(NotFoundMessage::new("No users registered found!")).get_response()
        }
    }
}

#[get("/users/count")]
pub async fn count() -> HttpResponse {
    match db::user::registered_count().await {
        Ok(count) => ResponseType::Ok(count).get_response(),
        Err(_) => {
            ResponseType::NotFound(NotFoundMessage::new("No users registered found!")).get_response()
        }
    }
}

#[post("/register")]
pub async fn register(user_data: web::Json<RegisterRequest>) -> HttpResponse {
    match db::user::register(user_data.username.to_owned(), user_data.password.to_owned()).await {
        Ok(_) => ResponseType::Ok("User registered!").get_response(),
        Err(_) => {
            ResponseType::NotFound(NotFoundMessage::new("No users registered found!")).get_response()
        }
    }
}

#[delete("/users/<username>/delete")]
pub async fn delete() -> HttpResponse {
    unimplemented!()
}

#[put("/users/<username>/change")]
pub async fn update(new_data: web::Json<RegisterRequest>) -> HttpResponse {
    unimplemented!()
}
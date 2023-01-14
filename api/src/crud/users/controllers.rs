use crate::db;
use crate::utils::*;
use crate::schema::*;
use actix_web::HttpRequest;
use actix_web::{get, post, put, delete, web, HttpResponse};

#[get("/user/users/{username}")]
pub async fn user_info(req: HttpRequest) -> HttpResponse {
    let name = req.match_info().query("username");

    match db::user::get(name.to_string()).await {
        Ok(user) => ResponseType::Ok(user).get_response(),
        Err(_) => {
            ResponseType::NotFound(NotFoundMessage::new("User not found!")).get_response()
        }
    }
}

#[get("/user/users")]
pub async fn all_users() -> HttpResponse {
    match db::user::all().await {
        Ok(users) => ResponseType::Ok(users).get_response(),
        Err(_) => {
            ResponseType::NotFound(NotFoundMessage::new("No users registered found!")).get_response()
        }
    }
}

#[get("/user/count")]
pub async fn count() -> HttpResponse {
    match db::user::registered_count().await {
        Ok(count) => ResponseType::Ok(count).get_response(),
        Err(_) => {
            ResponseType::NotFound(NotFoundMessage::new("No users registered found!")).get_response()
        }
    }
}

#[get("/user/login")]
pub async fn login(req: web::Json<AuthRequest>) -> HttpResponse {
    let creds = db::user::get_creds(req.username.clone()).await;

    match creds {
        Ok(c) => {
            if hash_password(req.password.clone()) == c.pass_hash {
                ResponseType::Ok(AuthResponse::new("Logged in!".to_string(), Some(c.pass_hash))).get_response()
            } else {
                ResponseType::NotFound(NotFoundMessage::new("Invalid credentials!")).get_response()
            }
        },
        Err(_) => ResponseType::NotFound(NotFoundMessage::new("User doesn't exist!")).get_response()
    }
}

#[post("/user/register")]
pub async fn register(user_data: web::Json<AuthRequest>) -> HttpResponse {
    match db::user::register(user_data.username.to_owned(), user_data.password.to_owned()).await {
        Ok(_) => ResponseType::Created("User registered!").get_response(),
        Err(_) => {
            ResponseType::NotFound(NotFoundMessage::new("Failed to register user!")).get_response()
        }
    }
}

#[delete("/user/users/{username}")]
pub async fn delete(req: HttpRequest) -> HttpResponse {
    let username = req.match_info().query("username");

    match db::user::delete(username.to_owned()).await {
        Ok(_) => ResponseType::Ok("User deleted!").get_response(),
        Err(_) => {
            ResponseType::NotFound(NotFoundMessage::new("Failed to delete user!")).get_response()
        }
    }
}

#[put("/user/users/{username}")]
pub async fn update(new_data: web::Json<AuthRequest>) -> HttpResponse {
    unimplemented!()
}
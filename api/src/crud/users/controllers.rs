use crate::db;
use crate::schema::*;
use crate::utils::*;
use actix_web::HttpRequest;
use actix_web::{delete, get, post, put, web, HttpResponse};

#[get("/user/users/{username}")]
pub async fn user_info(req: HttpRequest) -> HttpResponse {
    let name = req.match_info().query("username");

    match db::user::get(name.to_string()).await {
        Ok(user) => ResponseType::Ok(user).get_response(),
        Err(_) => ResponseType::NotFound(NotFoundMessage::new("User not found!")).get_response(),
    }
}

#[get("/user/users")]
pub async fn all_users() -> HttpResponse {
    match db::user::all().await {
        Ok(users) => ResponseType::Ok(users).get_response(),
        Err(_) => ResponseType::NotFound(NotFoundMessage::new("No users registered found!"))
            .get_response(),
    }
}

#[get("/user/count")]
pub async fn count() -> HttpResponse {
    match db::user::registered_count().await {
        Ok(count) => ResponseType::Ok(count).get_response(),
        Err(_) => ResponseType::NotFound(NotFoundMessage::new("No users registered found!"))
            .get_response(),
    }
}

#[put("/user/login")]
pub async fn login(req: web::Json<AuthRequest>) -> HttpResponse {
    let creds = db::user::get_creds(req.username.clone()).await;

    log::info!("User '{}' is trying to sign in...", &req.username);

    match creds {
        Ok(c) => {
            if hash_password(req.password.clone()) == c.pass_hash {
                log::info!("User {} signed in with auth token {}", &req.username, &c.pass_hash);
                ResponseType::Ok(AuthResponse::new(
                    "Logged in!".to_string(),
                    Some(c.pass_hash),
                ))
                .get_response()
            } else {
                log::error!("Failed to sign in user {}!", &req.username);
                ResponseType::NotFound(NotFoundMessage::new("Invalid password!")).get_response()
            }
        }
        Err(_) => {
            log::error!("User '{}' doesn't exist...", &req.username);
            ResponseType::NotFound(NotFoundMessage::new("User doesn't exist!")).get_response()
        }
    }
}

#[post("/user/register")]
pub async fn register(user_data: web::Json<AuthRequest>) -> HttpResponse {
    match db::user::register(user_data.username.to_owned(), user_data.password.to_owned()).await {
        Ok(_) => {
            log::info!("User '{}' registered!", &user_data.username);
            ResponseType::Created("User registered!").get_response()
        },
        Err(_) => {
            log::info!("Failed to register user '{}'!", &user_data.username);
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

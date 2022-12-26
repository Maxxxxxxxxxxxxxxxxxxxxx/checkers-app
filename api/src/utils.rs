use {
    actix_web::HttpResponse,
    serde::{Deserialize, Serialize},
};

#[derive(Serialize, Debug, Deserialize)]
pub struct NotFoundMessage {
    message: String,
}

impl NotFoundMessage {
    pub fn new(message: &str) -> Self {
        Self {
            message: String::from(message),
        }
    }
}

pub enum ResponseType<T> {
    Ok(T),
    Created(T),
    NotFound(T),
}

impl<T: Serialize> ResponseType<T> {
    pub fn get_response(&self) -> HttpResponse {
        match self {
            ResponseType::Ok(payload) => HttpResponse::Ok()
                .content_type("application/json")
                .json(payload),
            ResponseType::NotFound(error) => HttpResponse::NotFound()
                .content_type("application/json")
                .json(error),
            ResponseType::Created(payload) => HttpResponse::Created()
                .content_type("application/json")
                .json(payload),
        }
    }
}

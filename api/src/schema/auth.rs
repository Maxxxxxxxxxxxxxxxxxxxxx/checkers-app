use super::*;

#[derive(Deserialize, Serialize)]
pub struct AuthResponse {
    token: Option<String>,
    message: String
}

impl AuthResponse {
    pub fn new(message: String, token: Option<String>) -> Self {
        Self {
            message,
            token
        }
    }
}
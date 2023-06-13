#![allow(unused)]

pub mod comment;
pub mod game;
pub mod user;

use crate::crud::games::logic::*;
use crate::schema::*;
use neo4rs::*;
use std::env;
use uuid::Uuid;

const URI: &str = "127.0.0.1:7687";
const USERNAME: &str = "neo4j";
const PASSWORD: &str = "neo";

async fn connect() -> Result<Graph> {
    let uri_option = env::var("NEO4J_URI");
    let username_option = env::var("NEO4J_USERNAME");
    let password_option = env::var("NEO4J_PASSWORD");

    match (uri_option, username_option, password_option) {
        (Ok(uri), Ok(username), Ok(password)) => Graph::new(&uri, &username, &password).await,
        _ => Graph::new(&URI, &USERNAME, &PASSWORD).await,
    }
}

struct Error;
impl Error {
    fn new() -> neo4rs::Error {
        neo4rs::Error::UnexpectedMessage("Error".to_string())
    }
}

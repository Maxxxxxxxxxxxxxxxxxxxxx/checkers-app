#![allow(unused)]

pub mod game;
pub mod user;
pub mod comment;

use crate::crud::games::logic::*;
use crate::schema::*;
use std::env;
use neo4rs::*;
use uuid::Uuid;
use dotenv::dotenv;

const URI: &str = "127.0.0.1:7687";
const USERNAME: &str = "neo4j";
const PASSWORD: &str = "neo";

async fn connect() -> Result<Graph> {
    // dotenv().ok();

    // let uri = env::var("NEO4J_URI").unwrap();
    // let username = env::var("NEO4J_USERNAME").unwrap();
    // let password = env::var("NEO4J_PASSWORD").unwrap();

    Graph::new(&URI, &USERNAME, &PASSWORD).await
}

struct Error;
impl Error {
    fn new() -> neo4rs::Error {
        neo4rs::Error::UnexpectedMessage("Error".to_string())
    }
}
#![allow(unused)]

pub mod game;
pub mod user;

use crate::crud::games::logic::*;
use crate::schema::*;
use neo4rs::*;
use uuid::Uuid;

const URI: &str = "127.0.0.1:7687";
const USERNAME: &str = "neo4j";
const PASSWORD: &str = "neo";

async fn connect() -> Result<Graph> {
    Graph::new(&URI, USERNAME, PASSWORD).await
}

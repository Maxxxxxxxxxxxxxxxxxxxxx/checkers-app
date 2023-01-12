use super::*;

// is also a DBO
#[derive(Deserialize, Serialize)]
pub struct Beer {
    pub author: String,
    pub timestamp: SystemTime,
}

#[derive(Deserialize, Serialize)]
pub struct Comment {
    pub author: String,
    pub timestamp: SystemTime,
    pub title: String,
    pub content: String,
    pub beers: Vec<Beer>
}

pub struct CommentDBO {
    pub author: String,
    pub timestamp: SystemTime,
    pub title: String,
    pub content: String,
}
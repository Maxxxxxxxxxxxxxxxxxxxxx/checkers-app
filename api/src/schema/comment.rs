use std::time::UNIX_EPOCH;
use uuid::Uuid;

use super::*;

// is also a DBO
#[derive(Deserialize, Serialize, Debug)]
pub struct Beer {
    pub author: String,
    pub timestamp: u64,
    pub id: String
}

impl Beer {
    pub fn new(author: String) -> Self {
        Self {
            author,
            timestamp: SystemTime::now()
                .duration_since(UNIX_EPOCH)
                .unwrap()
                .as_secs(),
            id: Uuid::new_v4().to_string(),
        }
    }
}

impl TryFrom<Node> for Beer {
    type Error = ();
    fn try_from(node: Node) -> Result<Self, Self::Error> {
        let author = node.get::<String>("author");
        let timestamp = node.get::<i64>("timestamp");
        let id = node.get::<String>("id");

        match (author, timestamp, id) {
            (Some(a), Some(t), Some(id)) => {
                let author = a;
                let timestamp = t as u64;
                Ok(Self {author, timestamp, id})
            },
            _ => Err(())
        }
    }
}

#[derive(Deserialize, Serialize, Debug)]
pub struct Comment {
    pub author: String,
    pub timestamp: u64,
    pub title: String,
    pub content: String,
    pub id: String,
    pub beers: Vec<Beer>,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct CommentDBO {
    pub author: String,
    pub timestamp: u64,
    pub title: String,
    pub content: String,
    pub id: String,
}

impl Comment {
    pub fn from_dbo(dbo: CommentDBO, beers: Vec<Beer>) -> Self {
        Self {
            author: dbo.author,
            timestamp: dbo.timestamp,
            title: dbo.title,
            content: dbo.content,
            id: dbo.id,
            beers
        }
    }
}

impl From<AddComment> for Comment {
    fn from(a: AddComment) -> Self {
        Self {
            author: a.author,
            timestamp: SystemTime::now()
                .duration_since(UNIX_EPOCH)
                .unwrap()
                .as_secs(),
            title: a.title,
            content: a.content,
            id: Uuid::new_v4().to_string(),
            beers: Vec::new()
        }
    }
}

impl TryFrom<Node> for CommentDBO {
    type Error = ();
    fn try_from(node: Node) -> Result<Self, Self::Error> {
        match (
            node.get::<String>("author"),
            node.get::<i64>("timestamp"),
            node.get::<String>("title"),
            node.get::<String>("content"),
            node.get::<String>("id")
        ) {
            (
                Some(author),
                Some(ti64),
                Some(title),
                Some(content),
                Some(id)
            ) => {
                let timestamp = ti64 as u64;
                Ok(Self {
                    author,
                    timestamp,
                    title,
                    content,
                    id
                })
            },
            _ => Err(())
        }
    }
}
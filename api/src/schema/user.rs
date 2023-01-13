use super::*;

#[derive(Serialize, Deserialize, Debug)]
pub struct User {
    pub pass_hash: String,
    pub username: String
}

impl TryFrom<Node> for User {
    type Error = ();
    fn try_from(node: Node) -> Result<Self, Self::Error> {
        let pass_hash: Option<String> = node.get::<String>("pass_hash");
        let username: Option<String> = node.get::<String>("username");

        match (pass_hash, username) {
            (Some(pass_hash), Some(username)) => Ok(User { pass_hash, username }),
            _ => Err(())
        }
    }
}
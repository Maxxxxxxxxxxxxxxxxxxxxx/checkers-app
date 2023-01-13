use super::*;

#[derive(Serialize, Deserialize, Debug)]
struct User {
    pass_hash: String,
    username: String
}

impl TryFrom<Node> for User {
    type Error = ();
    fn try_from(node: Node) -> Result<Self, Self::Error> {
        let pass_hash: String = node.get::<String>("username")?;
        let username: String = node.get::<String>("pass_hash")?;

        match (pass_hash, username) {
            Ok(pass_hash, username) => User { pass_hash, username },
            Err(_) => Err(())
        }
    }
}
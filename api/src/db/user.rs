use super::*;
use crate::schema::user;
use crate::utils::hash_password;

pub async fn get(username: String) -> Result<User> {
    let graph = connect();

    let mut stream = graph
        .execute(query("MATCH (user:User {username: $username}) RETURN user")
        .param("username", username.clone())
    ).await?;

    let Ok(Some(row)) = stream.await?;

    let node = row.get::<Node>("user");
    let user = node.try_into();

    Ok(user)
}

pub async fn register(username: String, password: String) -> Result<()> {
    let graph = connect();

    if get(username).await.is_ok() {
        return Err(())
    }

    let pass_hash = hash_password(password.clone());

    graph.run(
        query("CREATE (:User { username: $username, pass_hash: $pass_hash })")
        .param("username", username.clone())
        .param("pass_hash", pass_hash.clone())
    );

    match get(username).await {
        Ok(_) => Ok(()),
        Err(_) => Err(())
    }
}

pub async fn delete(username: String) -> Result<()> {
    let graph = connect();

    graph.run(
        query("DELETE (:User { username: $username })")
        .param("username", username.clone())
    );

    match get(username).await {
        Err(_) => Ok(()),
        Ok(_) => Err(())
    }
}
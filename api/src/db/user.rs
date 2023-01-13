use super::*;
use crate::schema::user::*;
use crate::utils::hash_password;

pub async fn get(username: String) -> Result<User> {
    let graph = connect().await?;

    let mut stream = graph
        .execute(query("MATCH (user:User {username: $username}) RETURN user")
        .param("username", username.clone())
    ).await?;

    let row = stream.next().await.unwrap().unwrap();

    let node = row.get::<Node>("user").unwrap();
    let user: user::User = node.try_into().unwrap();

    Ok(user)
}

pub async fn registered_count() -> Result<usize> {
    let graph = connect().await?;

    let mut stream = graph
        .execute(query("MATCH (users:User) RETURN count(users) AS count")
    ).await?;

    let row = stream.next().await.unwrap().unwrap();
    let count = row.get::<i64>("count").unwrap();

    Ok(count as usize)
}

pub async fn all() -> Result<Vec<String>> {
    let graph = connect().await?;

    let mut stream = graph
        .execute(query("MATCH (users:User) RETURN users")
    ).await?;

    let mut usernames = Vec::<String>::new();

    while let Ok(Some(row)) = stream.next().await {
        let node = row.get::<Node>("user").unwrap();
        let username: String = node.get("username").unwrap();

        usernames.push(username);
    };

    Ok(usernames)
}

pub async fn register(username: String, password: String) -> Result<()> {
    let graph = connect().await?;

    let user_exists = get(username.clone()).await;

    if user_exists.is_ok() {
        return Err(neo4rs::Error::IOError { detail: "User already exists!".to_string() })
    }

    let pass_hash = hash_password(password.clone());

    graph.run(
        query("CREATE (:User { username: $username, pass_hash: $pass_hash })")
        .param("username", username.clone())
        .param("pass_hash", pass_hash.clone())
    );

    match get(username).await {
        Ok(_) => Ok(()),
        Err(_) => Err(neo4rs::Error::DeserializationError("Failed to add user to DB!".to_string()))
    }
}

pub async fn delete(username: String) -> Result<()> {
    let graph = connect().await?;

    graph.run(
        query("DELETE (:User { username: $username })")
        .param("username", username.clone())
    );

    match get(username).await {
        Err(_) => Ok(()),
        Ok(_) => Err(neo4rs::Error::DeserializationError("Deletion failed!".to_string()))
    }
}
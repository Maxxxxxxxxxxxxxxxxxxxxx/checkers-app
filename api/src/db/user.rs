use super::*;
use crate::schema::user::*;
use crate::utils::hash_password;

pub async fn get(username: String) -> Result<String> {
    let graph = connect().await?;
    let mut stream = graph
        .execute(
            query("MATCH (user:User {username: $username}) RETURN user")
                .param("username", username.clone()),
        )
        .await?;

    let row = stream.next().await?;
    match row {
        Some(row) => {
            let node = row.get::<Node>("user").unwrap();
            let user: user::User = node.try_into().unwrap();
            Ok(user.username)
        }
        None => Err(neo4rs::Error::DeserializationError(
            "User not found!".to_string(),
        )),
    }
}

pub async fn get_creds(username: String) -> Result<User> {
    let graph = connect().await?;
    let mut stream = graph
        .execute(
            query("MATCH (user:User {username: $username}) RETURN user")
                .param("username", username.clone()),
        )
        .await?;

    let row = stream.next().await?;
    match row {
        Some(row) => {
            let node = row.get::<Node>("user").unwrap();
            let user: user::User = node.try_into().unwrap();

            Ok(user)
        }
        None => Err(neo4rs::Error::DeserializationError(
            "User not found!".to_string(),
        )),
    }
}

pub async fn registered_count() -> Result<usize> {
    let graph = connect().await?;
    let mut stream = graph
        .execute(query("MATCH (users:User) RETURN count(users) AS count"))
        .await?;

    let row = stream.next().await.unwrap().unwrap();
    let count = row.get::<i64>("count").unwrap();
    Ok(count as usize)
}

pub async fn all() -> Result<Vec<String>> {
    let graph = connect().await?;
    let mut stream = graph
        .execute(query("MATCH (user:User) RETURN users"))
        .await?;

    let mut usernames = Vec::<String>::new();
    while let Ok(Some(row)) = stream.next().await {
        let node = row.get::<Node>("user").unwrap();
        let username: String = node.get("username").unwrap();

        usernames.push(username);
    }
    Ok(usernames)
}

pub async fn register(username: String, password: String) -> Result<()> {
    let graph = connect().await?;
    let user_exists = get(username.clone()).await;
    if user_exists.is_ok() {
        log::error!("User already exists! Username: {}", &username);
        return Err(neo4rs::Error::IOError {
            detail: "User already exists!".to_string(),
        });
    }

    let pass_hash = hash_password(password.clone());
    graph
        .run(
            query("CREATE (:User { username: $username, pass_hash: $pass_hash })")
                .param("username", username.clone())
                .param("pass_hash", pass_hash.clone()),
        )
        .await?;

    match get(username.clone()).await {
        Ok(_) => Ok(()),
        Err(_) => {
            log::error!("Failed to find user in DB! Username: {}", &username);
            Err(neo4rs::Error::DeserializationError(
                "Failed to add user to DB!".to_string(),
            ))
        }
    }
}

pub async fn delete(username: String) -> Result<()> {
    let graph = connect().await?;
    graph
        .run(
            query("MATCH (u:User { username: $username }) DELETE u")
                .param("username", username.clone()),
        )
        .await?;

    log::info!("deleted user {}", &username);

    match get(username).await {
        Err(_) => Ok(()),
        Ok(_) => Err(neo4rs::Error::DeserializationError(
            "Deletion failed!".to_string(),
        )),
    }
}

pub async fn login(username: String, password: String) -> Result<String> {
    let graph = connect().await?;
    let hashed = hash_password(password);
    let user_data = get_creds(username.clone()).await?;

    if hashed == user_data.pass_hash {
        return Ok(username);
    } else {
        Err(neo4rs::Error::DeserializationError(
            "Auth failed!".to_string(),
        ))
    }
}

pub async fn update_user(username: String, req: AuthRequest) -> Result<User> {
    let graph = connect().await?;
    let new_hash = hash_password(req.password);
    let new_username = req.username;
    let mut stream = graph
        .execute(
            query(
                "
            MATCH (user:User { username: $username })
            SET user.username = $new_username, user.pass_hash = $new_hash
            RETURN user
        ",
            )
            .param("username", username.clone())
            .param("new_username", new_username.clone())
            .param("new_hash", new_hash.clone()),
        )
        .await?;

    let row = stream.next().await?.unwrap();
    let user: User = row.get::<Node>("user").unwrap().try_into().unwrap();

    dbg!(&user);

    // let getted_user = get_creds(new_username).await?;
    // if getted_user.pass_hash == new_hash && getted_user.username == new_username {
    Ok(user)
    // } else {
    //     Err(neo4rs::Error::AuthenticationError("Hash check failed".to_string()))
    // }
}

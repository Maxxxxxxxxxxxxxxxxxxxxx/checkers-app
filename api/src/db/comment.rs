use std::time::SystemTime;
use std::time::UNIX_EPOCH;

use actix_web::HttpResponse;

use super::*;

pub async fn add(game_id: String, comment: Comment) -> Result<Comment> {
    let graph = connect().await?;
    let queried = graph.run(
        query(
            "
            MATCH (game:Game {id: $game_id})
            CREATE (comment:Comment { 
                author: $author, 
                timestamp: $timestamp, 
                id: $id, 
                content: $content, 
                title: $title 
            })-[:COMMENT_OF]->(game) RETURN comment, game"
        )
        .param("author", comment.author.clone())
        .param("timestamp", comment.timestamp.clone() as i64)
        .param("id", comment.id.clone())
        .param("content", comment.content.clone())
        .param("title", comment.title.clone())
        .param("game_id", game_id.clone())
    ).await;

    match queried {
        Ok(_) => { 
            log::info!("Added comment, {:?}", &comment);
            Ok(comment)
        },
        Err(err) => {
            log::error!("{:?}", &err);
            Err(err)
        }
    }
}

pub async fn get_id(comment_id: String) -> Result<Comment> {
    let graph = connect().await?;
    let mut comment_stream = graph.execute(
        query("MATCH (comment:Comment {id: $id}) RETURN comment")
        .param("id", comment_id.clone())
    ).await?;

    let mut beer_stream = graph.execute(
        query("MATCH (:Comment {id: $id})<-[:BEER_OF]-(beer) RETURN beer")
        .param("id", comment_id.clone())
    ).await?;

    let mut dbo: CommentDBO = comment_stream
        .next().await
        .unwrap()
        .unwrap()
        .get::<Node>("comment")
        .unwrap()
        .try_into()
        .unwrap();

    let mut beers: Vec<Beer> = Vec::new();

    while let Ok(Some(row)) = beer_stream.next().await {
        let beer: Beer = row.get::<Node>("beer").unwrap().try_into().unwrap();
        beers.push(beer)
    }

    Ok(Comment::from_dbo(dbo, beers))
}

pub async fn delete(comment_id: String) -> Result<()> {
    let graph = connect().await?;
    let mut comment_stream = graph.run(
        query("
            MATCH (comment:Comment {id: $id})
            OPTIONAL MATCH (comment)<-[r:BEER_OF]-(beer)
            OPTIONAL MATCH (game)<-[gr:COMMENT_OF]-(comment)
            DELETE r, gr, comment, beer
        ")
        .param("id", comment_id.clone())
    ).await?;

    log::info!("DELETED C");

    Ok(())
}

async fn get_beer(comment_id: String, author: String) -> Result<()> {
    let graph = connect().await?;
    let mut stream = graph.execute(
        query(
            "MATCH (comment:Comment {id: $id})<-[:BEER_OF]-(beer:Beer { author: $author})
            RETURN beer"
        )
        .param("id", comment_id.clone())
        .param("author", author.clone())
    ).await?;

    let row = stream.next().await?;

    match row {
        Some(r) => {
            if r.get::<Node>("beer").is_some() {
                Ok(())
            } else {
                Err(neo4rs::Error::UnknownType("".to_string()))
            }
        },
        None => Err(neo4rs::Error::UnknownType("".to_string()))
    }

}

pub async fn give_beer(comment_id: String, author: String) -> Result<Beer> {
    let graph = connect().await?;
    
    if get_beer(comment_id.clone(), author.clone()).await.is_ok() {
        return Err(neo4rs::Error::UnexpectedMessage("".to_string()))
    }

    let new_beer = Beer::new(author);

    graph.run(
        query("
            MATCH (comment:Comment {id: $id})
            CREATE (beer:Beer { id: $beer_id, author: $author, timestamp: $timestamp})-[:BEER_OF]->(comment)
        ")
        .param("id", comment_id.clone())
        .param("beer_id", new_beer.id.clone())
        .param("author", new_beer.author.clone())
        .param("timestamp", new_beer.timestamp.clone() as i64)
    ).await?;

    Ok(new_beer)
}


pub async fn of_game(id: String) -> Result<Vec<Comment>> {
    let graph = connect().await?;
    let mut stream = graph.execute(
        query("
            MATCH (game:Game { id: $id })
            OPTIONAL MATCH (comment:Comment)-[:COMMENT_OF]->(game)
            OPTIONAL MATCH (beer:Beer)-[:BEER_OF]->(comment)
            RETURN game, comment, beer
        ")
        .param("id", id.clone())
    ).await?;

    let mut comments = Vec::<Comment>::new();

    while let Ok(Some(row)) = stream.next().await {
        let dbo_node = row.get::<Node>("comment");
        let beer_node = row.get::<Node>("beer");

        if let Some(d) = dbo_node {
            let dbo = d.try_into().unwrap();
            let mut comment = Comment::from_dbo(dbo, Vec::<Beer>::new());

            match comments.iter_mut().find(|found| found.id == comment.id) {
                // if comment is found in accumulator, push beer
                Some(found) => {
                    if let Some(b) = beer_node {
                        found.beers.push(b.try_into().unwrap())
                    }
                }
                // if comment is not found, push all
                None => {
                    if let Some(b) = beer_node {
                        comment.beers.push(b.try_into().unwrap())
                    }
                    comments.push(comment);
                }
            };
        }
    }

    Ok(comments)
} 

pub async fn edit(comment_id: String, req: AddComment) -> Result<Comment> {
    let graph = connect().await?;
    let timestamp = SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .unwrap()
        .as_secs();
    let mut stream = graph.execute(
        query("
            MATCH (comment:Comment {id: $id})<-(:BEER_OF)-(beer:Beer)
            SET comment.author = $author, comment.title = $title, comment.content = $content, comment.timestamp = $timestamp
            RETURN comment, beer
        ")
        .param("author", req.author.clone())
        .param("content", req.content.clone())
        .param("title", req.title.clone())
        .param("id", comment_id.clone())
        .param("timestamp", timestamp.clone() as i64)
    ).await?;

    let edited: CommentDBO = stream.next()
        .await?
        .unwrap()
        .get::<Node>("comment")
        .unwrap()
        .try_into()
        .unwrap();

    // let mut c = Comment::from_dbo(edited, Vec::new());

    log::info!("Comment DBO getted: {:?}", edited);
    
    let comment = get_id(comment_id).await?;
    Ok(comment)
}

pub async fn count_all() -> Result<i64> {
    let graph = connect().await?;
    let mut stream = graph.execute(
        query("
            MATCH (comment:Comment)
            RETURN count(comment) as count
        ")
    ).await?;

    let row = stream.next().await?.unwrap();
    let result = row.get::<i64>("count").unwrap();
    Ok(result)
}

pub async fn count_for_game(id: String) -> Result<i64> {
    let graph = connect().await?;
    let mut stream = graph.execute(
        query("
            MATCH (game:Game {id: $id})
            OPTIONAL MATCH (game)<-[:COMMENT_OF]-(comment:Comment)
            RETURN count(comment) as count
        ")
        .param("id", id.clone())
    ).await?;

    let row = stream.next().await?.unwrap();
    let result = row.get::<i64>("count").unwrap();
    Ok(result)
}

pub async fn remove_beer(id: String, author: String) -> Result<()> {
    let graph = connect().await?;

    match get_beer(id.clone(), author.clone()).await {
        Ok(_) => {
            graph.run(
                query("
                    MATCH (comment:Comment {id: $id})
                    MATCH (comment)<-[r:BEER_OF]-(beer:Beer { author: $author })
                    DELETE r, beer
                ")
                .param("id", id.clone())
                .param("author", author.clone())
            ).await?;
            Ok(())
        },
        Err(err) => Err(err)
    }
}
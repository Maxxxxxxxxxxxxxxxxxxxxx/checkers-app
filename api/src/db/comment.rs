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

pub async fn give_beer(comment_id: String, author: String) -> Result<Beer> {
    let graph = connect().await?;
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
            OPTIONAL MATCH (beer:Beer)<-[:BEER_OF]-(comment)
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
                // if game is not found, push all
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
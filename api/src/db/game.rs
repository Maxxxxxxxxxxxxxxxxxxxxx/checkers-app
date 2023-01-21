use super::*;

pub async fn all() -> Result<Vec<Game>> {
    let graph = connect().await?;

    let mut stream = graph
        .execute(query(
            "MATCH (game:Game)<-[:PAWN_OF]-(pawn:Pawn) RETURN game, pawn",
        ))
        .await?;

    let mut games = Vec::<Game>::new();
    while let Ok(Some(row)) = stream.next().await {
        let game_dbo: GameDBO = row.get::<Node>("game").unwrap().try_into().unwrap();
        let pawn: Pawn = row.get::<Node>("pawn").unwrap().try_into().unwrap();
        // let mov: Move = row.get::<Node>("move").unwrap().try_into().unwrap();

        let mut game = Game::from(game_dbo);

        match games.iter_mut().find(|found| found.id == game.id) {
            // if game is found in accumulator, push move & pawn
            Some(found) => {
                found.pawns.push(pawn);
                // game.moves.push(mov);
            }
            // if game is not found, push all
            None => {
                game.pawns.push(pawn);
                // game.moves.push(mov);
                games.push(game);
            }
        };
    }

    return Ok(games);
}

pub async fn get(game_id: &str) -> Result<Game> {
    let graph = connect().await?;

    let mut stream = graph
        .execute(
            query(
                "
                   MATCH (game:Game {id: $game_id})<-[:PAWN_OF]-(pawn:Pawn) 
                   RETURN game, pawn",
            )
            .param("game_id", game_id.clone()),
        )
        .await?;

    let mut pawns = Vec::<Pawn>::new();
    let mut game_dbo: Option<GameDBO> = None;

    while let Ok(Some(row)) = stream.next().await {
        let pawn: Pawn = row.get::<Node>("pawn").unwrap().try_into().unwrap();

        if game_dbo.is_none() {
            game_dbo = Some(row.get::<Node>("game").unwrap().try_into().unwrap())
        }

        pawns.push(pawn);
    }

    match game_dbo {
        Some(dbo) => Ok(Game::from_dbo(dbo, pawns)),
        None => Err(neo4rs::Error::DeserializationError(
            "Failed to parse game DBO".to_string(),
        )),
    }
}

pub async fn create(cfg: GameConfig) -> Result<Game> {
    match connect().await {
        Ok(graph) => {
            let game_id = Uuid::new_v4().to_string();
            let mut pawns = [
                create_pawns("w", &cfg.white_side),
                create_pawns("b", &cfg.black_side),
            ]
            .concat();

            let txn = graph.start_txn().await?;

            let game_query = query(
                "CREATE (:Game {id: $game_id, 
                current_color: $current_color, 
                turn: 1,
                white_side: $white_side,
                black_side: $black_side,
                name: $name,
                mode: $mode
            });",
            )
            .param("game_id", game_id.clone())
            .param("white_side", cfg.white_side.clone())
            .param("black_side", cfg.black_side.clone())
            .param("name", cfg.name.clone())
            .param("mode", cfg.mode.clone())
            .param("current_color", "w");

            let mut queries = pawns.clone().into_iter().map(|pawn| {
                query(
                    "
                MATCH (game:Game {id: $game_id})
                CREATE (p:Pawn {is_queen: false, is_dead: false, side: $side,index: $index,pos_x: $pos_x,pos_y: $pos_y})-[:PAWN_OF]->(game)",
                )
                .param("game_id", game_id.clone())
                .param("side", pawn.side.clone())
                .param("index", pawn.index.clone() as i64)
                .param("pos_x", pawn.pos_x.clone() as i64)
                .param("pos_y", pawn.pos_y.clone() as i64)
            }).collect::<Vec<Query>>();

            queries.insert(0, game_query);

            txn.run_queries(queries).await.unwrap();
            txn.commit().await?;

            let game = get(&game_id).await?;
            Ok(game)
        }
        Err(err) => Err(err),
    }
}

pub async fn add_move(m: Move, game_id: String, killed: Option<KilledPawn>) -> Result<Game> {
    let graph = connect().await?;

    // update game turn and current color

    let game = get(&game_id).await?;

    let new_color = || {
        if game.current_color == "w".to_string() {
            return "b".to_string()
        } else {
            return "w".to_string()
        }
    };

    // log::info!("New color for game {}: {}", &game_id, &new_color());

    graph.run(
        query(
            "
            MATCH (game:Game { id: $id })
            SET game.turn = game.turn + 1, game.current_color = $current_color
            "
        )
        .param("current_color", new_color().clone())
        .param("id", game_id.clone())
    ).await?;

    // create move query
    let mut stream = graph.execute(
        query("
        MATCH (game:Game {id: $game_id}), (pawn:Pawn {side: $side, index: $index})-[:PAWN_OF]->(game)
        CREATE (move:Move { index: $index, side: $side, start_x: $start_x, start_y: $start_y, dest_x: $dest_x, dest_y: $dest_y })-[:MOVE_OF]->(game)     
        SET pawn.pos_x = $dest_x, pawn.pos_y = $dest_y
        RETURN move, pawn"
    )
        .param("game_id", game_id.clone())
        .param("index", m.index.clone() as i64)
        .param("side", m.side.clone())
        .param("start_x", m.start_x.clone() as i64)
        .param("start_y", m.start_y.clone() as i64)
        .param("dest_x", m.dest_x.clone() as i64)
        .param("dest_y", m.dest_y.clone() as i64)
    ).await?;

    // update killed pawn state in the db
    if killed.is_some() {
        let killed = killed.unwrap();
        graph.run(
            query("
                MATCH (:Game {id: $game_id})<-[:PAWN_OF]-(pawn:Pawn {side: $killed_side, index: $killed_index})
                SET pawn.is_dead = true, pawn.pos_x = -1, pawn.pos_y = -1
                RETURN pawn
            ")
            .param("game_id", game_id.clone())
            .param("killed_side", killed.side.clone())
            .param("killed_index", killed.index.clone() as i64)
        ).await?;
    }

    let row = stream.next().await?.unwrap();
    // let move_object: Move = row.get::<Node>("move").unwrap().try_into().unwrap();
    let game = get(&game_id).await?;

    Ok(game)
}

pub async fn delete(id: String) -> Result<()> {
    let graph = connect().await?;
    graph.run(
        query(
            "
            MATCH (game:Game { id: $id })<-[r]-(n)
            DELETE game, n, r
            "
        )
        .param("id", id.clone())
    ).await?;

    match get(&id.clone()).await {
        Ok(game) => Err(neo4rs::Error::DeserializationError("Error deleting game".to_string())),
        Err(_) => Ok(())
    }
}
#![allow(unused)]

use crate::game::create_pawns;
use crate::structs::*;
use neo4rs::*;
use uuid::Uuid;

const URI: &str = "127.0.0.1:7687";
const USERNAME: &str = "neo4j";
const PASSWORD: &str = "neo";

pub async fn connect() -> Result<Graph> {
    Graph::new(&URI, USERNAME, PASSWORD).await
}

pub async fn get_all_games() -> Result<Vec<Game>> {
    let graph = connect().await?;

    let mut stream = graph.execute(
        query("MATCH (game:Game) RETURN game")
    ).await?;

    let mut all_ids = Vec::<String>::new();
    while let Ok(Some(row)) = stream.next().await {
        let node = row.get::<Node>("game").unwrap();
        let id = node.get("id").unwrap();

        all_ids.push(id);
    };

    let mut games = Vec::<Game>::new();

    for id in all_ids {
        let game = get_game(&id).await?;
        games.push(game);
    }

    return Ok(games)
}

pub async fn get_game(game_id: &str) -> Result<Game> {
    let graph = connect().await?;

    let mut game_stream = graph.execute(
        query("MATCH (game:Game {id: $game_id}) RETURN game")
        .param("game_id", game_id.clone())
    ).await?;

    let mut pawns_stream = graph.execute(
        query("MATCH (:Game {id: $game_id})<-[:PAWN_OF]-(p:Pawn) RETURN p")
        .param("game_id", game_id.clone())
    ).await?;

    let mut moves_stream = graph.execute(
        query("MATCH (:Game {id: $game_id})<-[:MOVE_OF]-(m:Move)-[:OF_PAWN]->(pawn:Pawn) RETURN m,pawn")
        .param("game_id", game_id.clone())
    ).await?;

    let game_node = game_stream.next().await?;
    let game_dbo: Option<GameDBO> = match game_node {
        Some(row) => Some(row
            .get::<Node>("game")
            .unwrap()
            .try_into()
            .unwrap()),
        None => None
    };

    let mut moves = Vec::<Move>::new();
    while let Ok(Some(row)) = moves_stream.next().await {
        let move_node = row.get::<Node>("m").unwrap();
        let pawn_node = row.get::<Node>("pawn").unwrap();
        let index = pawn_node.get::<i64>("index").unwrap();
        let side = pawn_node.get::<String>("side").unwrap();
        let move_obj = Move::from_dbo(
            move_node.try_into().unwrap(),
            index as i32,
            side
        );
    }

    let mut pawns = Vec::<Pawn>::new();
    while let Ok(Some(row)) = pawns_stream.next().await {
        let node: Node = row.get("p").unwrap();
        let pawn: Pawn = node.try_into().unwrap();
        // dbg!(pawn);
        pawns.push(pawn);
    }

    match game_dbo {
        Some(dbo) => Ok(Game::from_dbo(
            dbo,
            moves,
            pawns
        )),
        None => Err(neo4rs::Error::DeserializationError("Failed to parse game DBO".to_string()))
    }
}

pub async fn create_game(pos_white: &str, pos_black: &str) -> Result<()> {
    match connect().await {
        Ok(graph) => {
            let game_id = Uuid::new_v4().to_string();
            let mut pawns = [
                create_pawns("w", pos_white), 
                create_pawns("b", pos_black)
            ].concat();

            let txn = graph.start_txn().await.unwrap();

            let game_query = query(
                "
                CREATE (:Game {
                    id: $game_id,
                    current_color: $color,
                    turn: 1
                });
            ",
            )
            .param("game_id", game_id.clone())
            .param("color", "w");

            let mut queries = pawns.into_iter().map(|pawn| {
                query(
                    "
                MATCH (game:Game {id: $game_id})
                CREATE (p:Pawn {
                    is_queen: false, 
                    is_dead: false, 
                    side: $side,
                    index: $index,
                    pos_x: $pos_x,
                    pos_y: $pos_y
                })-[:PAWN_OF]->(game)",
                )
                .param("game_id", game_id.clone())
                .param("side", pawn.side.clone())
                .param("index", pawn.index as i64)
                .param("pos_x", pawn.pos_x as i64)
                .param("pos_y", pawn.pos_y as i64)
            }).collect::<Vec<Query>>();

            queries.insert(0, game_query);

            txn.run_queries(queries).await.unwrap();
            txn.commit().await
        }
        Err(err) => Err(err),
    }
}


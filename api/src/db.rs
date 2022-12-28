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

pub async fn get_game(game_id: &str) -> Result<Game> {
    let graph = connect().await?;

    let mut stream = graph
        .execute(
            query("MATCH (game:Game {id: $game_id})<-[:PAWN_OF]-(pawn:Pawn) RETURN game, pawn")
                .param("game_id", game_id.clone()),
        )
        .await?;

    let mut pawns = Vec::<Pawn>::new();
    let mut game_dbo: Option<GameDBO> = None;

    while let Ok(Some(row)) = stream.next().await {
        let node: Node = row.get("pawn").unwrap();
        let pawn: Pawn = node.try_into().unwrap();

        if game_dbo.is_none() {
            game_dbo = Some(row.get::<Node>("game").unwrap().try_into().unwrap())
        }
        // todo: add move handling
        pawns.push(pawn);
    }

    match game_dbo {
        Some(dbo) => Ok(Game::from_dbo(
            dbo,
            Vec::<Move>::new(), // todo: add move handling
            pawns,
        )),
        None => Err(neo4rs::Error::DeserializationError(
            "Failed to parse game DBO".to_string(),
        )),
    }
}

pub async fn create_game(pos_white: &str, pos_black: &str) -> Result<Game> {
    match connect().await {
        Ok(graph) => {
            let game_id = Uuid::new_v4().to_string();
            let mut pawns = [create_pawns("w", pos_white), create_pawns("b", pos_black)].concat();

            let txn = graph.start_txn().await.unwrap();

            let game_query = query("CREATE (:Game {id: $game_id,current_color: $color,turn: 1});")
                .param("game_id", game_id.clone())
                .param("color", "w");

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

            let game = Game {
                current_color: "w".to_string(),
                turn: 1,
                id: game_id,
                moves: Vec::<Move>::new(),
                pawns: pawns,
            };

            Ok(game)
        }
        Err(err) => Err(err),
    }
}

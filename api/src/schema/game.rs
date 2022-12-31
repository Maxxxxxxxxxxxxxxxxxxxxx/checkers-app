use super::*;

#[derive(Deserialize, Serialize, Debug)]
pub struct Game {
    pub name: String,
    pub mode: String,
    pub white_side: String,
    pub black_side: String,
    pub current_color: String,
    pub turn: i32,
    pub id: String,
    pub moves: Vec<Move>,
    pub pawns: Vec<Pawn>,
}

impl Game {
    pub fn from_dbo(dbo: GameDBO, moves: Vec<Move>, pawns: Vec<Pawn>) -> Self {
        Self {
            name: dbo.name,
            white_side: dbo.white_side,
            black_side: dbo.black_side,
            mode: dbo.mode,
            current_color: dbo.current_color,
            turn: dbo.turn,
            id: dbo.id,
            moves,
            pawns,
        }
    }
}

impl From<GameDBO> for Game {
    fn from(dbo: GameDBO) -> Self {
        Self {
            name: dbo.name,
            white_side: dbo.white_side,
            black_side: dbo.black_side,
            mode: dbo.mode,
            current_color: dbo.current_color,
            turn: dbo.turn,
            id: dbo.id,
            moves: Vec::<Move>::new(),
            pawns: Vec::<Pawn>::new(),
        }
    }
}

// DB Objects ---------------------------------

#[derive(Deserialize, Serialize, Debug, FieldNamesAsArray)]
pub struct GameDBO {
    pub name: String,
    pub mode: String,
    pub white_side: String,
    pub black_side: String,
    pub current_color: String,
    pub turn: i32,
    pub id: String,
}

impl TryFrom<Node> for GameDBO {
    type Error = ();
    fn try_from(node: Node) -> Result<Self, Self::Error> {
        let string_fields = GameDBO::FIELD_NAMES_AS_ARRAY.iter().fold(
            Vec::<String>::new(),
            |mut vec, fieldname| match node.get::<String>(fieldname) {
                Some(key) => {
                    vec.push(key);
                    vec
                }
                None => vec,
            },
        );

        // dbg!(&string_fields);

        let turn = node.get::<i64>("turn").unwrap() as i32;
        Ok(Self {
            name: String::from(&string_fields[0]),
            mode: String::from(&string_fields[1]),
            white_side: String::from(&string_fields[2]),
            black_side: String::from(&string_fields[3]),
            current_color: String::from(&string_fields[4]),
            turn,
            id: String::from(&string_fields[5]),
        })
    }
}

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
    pub author: String,
    pub pawns: Vec<Pawn>,
    pub is_end: bool,
}

impl Game {
    pub fn from_dbo(dbo: GameDBO, pawns: Vec<Pawn>) -> Self {
        Self {
            is_end: false,
            author: dbo.author,
            name: dbo.name,
            white_side: dbo.white_side,
            black_side: dbo.black_side,
            mode: dbo.mode,
            current_color: dbo.current_color,
            turn: dbo.turn,
            id: dbo.id,
            pawns,
        }
    }
}

impl From<GameDBO> for Game {
    fn from(dbo: GameDBO) -> Self {
        Self {
            author: dbo.author,
            is_end: dbo.is_end,
            name: dbo.name,
            white_side: dbo.white_side,
            black_side: dbo.black_side,
            mode: dbo.mode,
            current_color: dbo.current_color,
            turn: dbo.turn,
            id: dbo.id,
            pawns: Vec::<Pawn>::new(),
        }
    }
}

// DB Objects ---------------------------------

#[derive(Deserialize, Serialize, Debug, FieldNamesAsArray)]
pub struct GameDBO {
    pub author: String,
    pub is_end: bool,
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
        // let string_fields = GameDBO::FIELD_NAMES_AS_ARRAY.iter().fold(
        //     Vec::<String>::new(),
        //     |mut vec, fieldname| match node.get::<String>(fieldname) {
        //         Some(key) => {
        //             vec.push(key);
        //             vec
        //         }
        //         None => vec,
        //     },
        // );

        let name = node.get::<String>("name").unwrap();
        let mode = node.get::<String>("mode").unwrap();
        let white_side = node.get::<String>("white_side").unwrap();
        let black_side = node.get::<String>("black_side").unwrap();
        let current_color = node.get::<String>("current_color").unwrap();
        let id = node.get::<String>("id").unwrap();
        let author = node.get::<String>("author").unwrap();

        // dbg!(&string_fields);

        let turn = node.get::<i64>("turn").unwrap() as i32;
        let is_end = node.get::<bool>("is_end").unwrap();

        Ok(Self {
            is_end,
            name,
            mode,
            white_side,
            black_side,
            current_color,
            turn,
            id,
            author,
        })
    }
}

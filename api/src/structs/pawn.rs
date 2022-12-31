use super::*;

#[derive(Deserialize, Serialize, Clone, Debug)]
pub struct Pawn {
    pub is_queen: bool,
    pub is_dead: bool,
    pub side: String,
    pub index: i32,
    pub pos_x: i32,
    pub pos_y: i32,
}

impl TryFrom<Node> for Pawn {
    type Error = ();
    fn try_from(row: Node) -> Result<Self, Self::Error> {
        let is_queen: Option<bool> = row.get("is_queen");
        let is_dead: Option<bool> = row.get("is_dead");
        let index: Option<i64> = row.get("index");
        let side: Option<String> = row.get("side");
        let pos_x: Option<i64> = row.get("pos_x");
        let pos_y: Option<i64> = row.get("pos_y");

        // dbg!(&is_queen);
        // dbg!(&is_dead);
        // dbg!(&index);
        // dbg!(&side);

        match (is_queen, is_dead, index, side, pos_x, pos_y) {
            (Some(is_queen), Some(is_dead), Some(index), Some(side), Some(pos_x), Some(pos_y)) => {
                let x32 = pos_x as i32;
                let y32 = pos_y as i32;
                let index32 = index as i32;
                Ok(Pawn {
                    is_queen,
                    is_dead,
                    index: index32,
                    side,
                    pos_x: x32,
                    pos_y: y32,
                })
            }
            _ => Err(()),
        }
    }
}

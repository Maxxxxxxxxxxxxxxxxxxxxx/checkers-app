use super::*;

#[derive(Deserialize, Serialize, Debug, Clone)]
pub struct Move {
    pub index: i32,
    pub side: String,
    pub start_x: i32,
    pub start_y: i32,
    pub dest_x: i32,
    pub dest_y: i32,
}

impl TryFrom<Node> for Move {
    type Error = ();
    fn try_from(node: Node) -> Result<Self, Self::Error> {
        let index: Option<i64> = node.get("index");
        let side: Option<String> = node.get("side");
        let start_x: Option<i64> = node.get("start_x");
        let start_y: Option<i64> = node.get("start_y");
        let dest_x: Option<i64> = node.get("dest_x");
        let dest_y: Option<i64> = node.get("dest_y");

        match (index, side, start_x, start_y, dest_x, dest_y) {
            (Some(index), Some(side), Some(start_x), Some(start_y), Some(dest_x), Some(dest_y)) => {
                let index32 = index as i32;
                let sx = start_x as i32;
                let sy = start_y as i32;
                let dx = dest_x as i32;
                let dy = dest_y as i32;

                Ok(Self {
                    index: index32,
                    side,
                    start_x: sx,
                    start_y: sy,
                    dest_x: dx,
                    dest_y: dy,
                })
            }
            _ => Err(()),
        }
    }
}

impl PartialEq for Move {
    fn eq(&self, other: &Self) -> bool {
        if self.index == other.index &&
            self.side == other.side &&
            self.start_x == other.start_x &&
            self.start_y == other.start_y &&
            self.dest_x == other.dest_x &&
            self.dest_y == other.dest_y {
                true
            } else {
                false 
            }
    }
    fn ne(&self, other: &Self) -> bool {
        if self.index != other.index ||
            self.side != other.side ||
            self.start_x != other.start_x ||
            self.start_y != other.start_y ||
            self.dest_x != other.dest_x ||
            self.dest_y != other.dest_y {
                true
            } else {
                false 
            }
    }
}

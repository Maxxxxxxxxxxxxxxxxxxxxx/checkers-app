use crate::structs::*;

pub const POSITIONS_TOP: [(i32, i32); 12] = [
    (1, 0),
    (3, 0),
    (5, 0),
    (7, 0),
    (0, 1),
    (2, 1),
    (4, 1),
    (6, 1),
    (1, 2),
    (3, 2),
    (5, 2),
    (7, 2),
];
pub const POSITIONS_BOTTOM: [(i32, i32); 12] = [
    (0, 7),
    (2, 7),
    (4, 7),
    (6, 7),
    (1, 6),
    (3, 6),
    (5, 6),
    (7, 6),
    (0, 5),
    (2, 5),
    (4, 5),
    (6, 5),
];

pub fn create_pawns(side: &str, top_bottom: &str) -> Vec<Pawn> {
    let positions = match top_bottom {
        "top" => POSITIONS_TOP,
        "bottom" => POSITIONS_BOTTOM,
        _ => panic!("Wrong pawn position supplied. Use \"top\" or \"bottom\""),
    };

    positions
        .iter()
        .enumerate()
        .map(|(index, (x, y))| {
            let i32index = index as i32;
            Pawn {
                is_queen: false,
                is_dead: false,
                side: side.to_string(),
                index: i32index,
                pos_x: *x,
                pos_y: *y,
            }
        })
        .collect()
}

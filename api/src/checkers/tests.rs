#![cfg(test)]

use super::*;

#[test]
fn test_get_pawn() {
    let mut gamestate = GameState::new();
    let pawn = gamestate.get_pawn(Vector::new(1,2));

    assert!(pawn.is_ok())
}

#[test]
fn test_gamestate_kill() {
    let mut gamestate = GameState::new();
    gamestate.create_move(9, Color::White, 1, 4);
    gamestate.create_move(8, Color::Black, 0, 3);
    gamestate.create_move(10, Color::White, 3, 4);
    gamestate.create_move(8, Color::Black, 2, 5);

    let dead_pawn = gamestate.get_pawn(Vector::new(1,4));
    assert!(dead_pawn.is_err());
}
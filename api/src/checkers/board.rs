#![allow(unused)]

use rocket::serde::{Deserialize, Serialize};

use super::*;

#[derive(Clone, Serialize, Deserialize)]
#[serde(crate = "rocket::serde")]
pub struct Board {
    pub fields: Vec<Vector>,
}

impl Board {
  pub fn new() -> Self {
      let vec = (0..8)
          .map(|row| (0..8))
          .enumerate()
          .map(|(row_index, row)| {
              let y = row_index as i32;
              row.map(move |x| Vector { x, y })
          })
          .flatten()
          .collect();

      Board { fields: vec }
  }
}

impl fmt::Debug for Board {
  fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
      let mut owned = "".to_owned();
      self.fields.iter().for_each(|vector| {
          if vector.x % 8 == 0 {
              owned.push_str("\n\n\n");
          }
          owned.push_str(format!("({},{})   ", vector.x, vector.y).as_str())
      });

      write!(f, "{}", owned);
      Ok(())
  }
}

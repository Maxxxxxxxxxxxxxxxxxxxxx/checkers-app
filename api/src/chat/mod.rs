use std::{time::Duration, str::FromStr};

pub const HEARTBEAT_INTERVAL: Duration = Duration::from_secs(5);
pub const CLIENT_TIMEOUT: Duration = Duration::from_secs(15);
pub const GLOBAL_CHAT_ID: Uuid = Uuid::from_bytes([0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0]);

mod session;
pub mod chat_route;
mod lobby;
mod messages;

pub use session::*;
pub use lobby::*;
pub use messages::*;
use uuid::Uuid;

#[allow(unused)]
use rand::{thread_rng, Rng};


type Id = Uuid;

pub fn new_id() -> Id {
    // thread_rng().gen_range(0..2000)
    Uuid::new_v4()
}
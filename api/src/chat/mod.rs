use std::time::Duration;

pub const HEARTBEAT_INTERVAL: Duration = Duration::from_secs(5);
pub const CLIENT_TIMEOUT: Duration = Duration::from_secs(15);
pub const GLOBAL_CHAT_ID: usize = 2137;

mod connection;
mod controller;
mod lobby;
mod messages;

pub use connection::*;
pub use controller::*;
pub use lobby::*;
pub use messages::*;
use rand::{thread_rng, Rng};

type Id = usize;

pub fn new_id() -> Id {
    thread_rng().gen_range(0..2000)
}
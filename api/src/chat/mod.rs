use std::time::Duration;

pub const HEARTBEAT_INTERVAL: Duration = Duration::from_secs(5);
pub const CLIENT_TIMEOUT: Duration = Duration::from_secs(15);

mod connection;
mod controller;
mod lobby;
mod messages;

pub use connection::*;
pub use controller::*;
pub use lobby::*;
pub use messages::*;

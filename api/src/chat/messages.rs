use actix::prelude::{Message, Recipient};
use super::Id;

#[derive(Message)]
#[rtype(result = "()")]
pub struct WsMessage(pub String);

#[derive(Message)]
#[rtype(result = "()")]
pub struct Connect {
    pub addr: Recipient<WsMessage>,
    pub lobby_id: Id,
    pub self_id: Id,
}

#[derive(Message)]
#[rtype(result = "()")]
pub struct Disconnect {
    pub id: Id,
    pub room_id: Id,
}

#[derive(Message)]
#[rtype(result = "()")]
pub struct ClientActorMessage {
    pub id: Id,
    pub msg: String,
    pub room_id: Id,
}

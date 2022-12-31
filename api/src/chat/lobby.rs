use crate::chat::messages::{ClientActorMessage, Connect, Disconnect, WsMessage};
use actix::prelude::{Actor, Context, Handler, Recipient};
use std::collections::{HashMap, HashSet};

use super::GLOBAL_CHAT_ID;
use super::Id;

type Socket = Recipient<WsMessage>;

#[derive(Debug)]
pub struct Lobby {
    sessions: HashMap<Id, Socket>,
    rooms: HashMap<Id, HashSet<usize>>,
}

impl Default for Lobby {
    fn default() -> Lobby {
        let mut lobby = Lobby {
            sessions: HashMap::new(),
            rooms: HashMap::new(),
        };

        // Create the global chat room that always exists
        lobby.rooms.insert(GLOBAL_CHAT_ID, HashSet::new());
        lobby
    }
}

impl Lobby {
    fn send_message(&self, message: &str, id_to: usize) {
        if let Some(socket_recipient) = self.sessions.get(&id_to) {
            let _ = socket_recipient.do_send(WsMessage(message.to_owned()));
        } else {
            println!("attempting to send message but couldn't find user id.");
        }
    }

    /// Creates a new empty chat room, with random ID
    pub fn create_room(&mut self) {
        let room_id = super::new_id();
        self.rooms.insert(room_id, HashSet::new());
    }
}

impl Actor for Lobby {
    type Context = Context<Self>;

    // no fn impls here because Lobby doesn't need any behavior on start / stop
}

impl Handler<Disconnect> for Lobby {
    type Result = ();

    fn handle(&mut self, msg: Disconnect, _: &mut Context<Self>) {
        if self.sessions.remove(&msg.id).is_some() {
            if let Some(lobby) = self.rooms.get_mut(&msg.room_id) {
                if lobby.len() > 1 {
                    lobby.remove(&msg.id);
                } else {
                    //only one in the lobby, remove it entirely, unless its global
                    if msg.room_id != GLOBAL_CHAT_ID {
                        self.rooms.remove(&msg.room_id);
                    }
                }
            }
        }
    }
}

impl Handler<Connect> for Lobby {
    type Result = ();

    fn handle(&mut self, msg: Connect, _: &mut Context<Self>) -> Self::Result {
        self.rooms
            .entry(msg.lobby_id)
            .or_insert_with(HashSet::new)
            .insert(msg.self_id);

        self.sessions.insert(msg.self_id, msg.addr);
        self.send_message(&format!("your id is {}", msg.self_id), msg.self_id);
    }
}

impl Handler<ClientActorMessage> for Lobby {
    type Result = ();

    fn handle(&mut self, msg: ClientActorMessage, _ctx: &mut Context<Self>) -> Self::Result {
        self.rooms
            .get(&msg.room_id)
            .unwrap()
            .iter()
            .for_each(|client| self.send_message(&msg.msg, client.clone()));
    }
}
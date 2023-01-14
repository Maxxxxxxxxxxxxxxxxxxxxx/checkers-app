use crate::chat::lobby::Lobby;
use crate::chat::messages::*;
use actix::{fut, ActorContext, ActorFutureExt, ContextFutureSpawner, WrapFuture};
use actix::{Actor, Addr, Running, StreamHandler};
use actix::{AsyncContext, Handler};
use actix_web_actors::ws;
use actix_web_actors::ws::Message::Text;
use actix_web_actors::ws::WebsocketContext;
use std::time::Instant;

use super::*;

pub struct Session {
    pub id: Id,
    room_id: Id,
    lobby_addr: Addr<Lobby>,
    hb: Instant,
}

impl Session {
    pub fn new(room_id: Id, lobby_addr: Addr<Lobby>) -> Self {
        Self {
            id: super::new_id(),
            room_id,
            lobby_addr,
            hb: Instant::now(),
        }
    }
}

impl Actor for Session {
    type Context = WebsocketContext<Self>;

    fn started(&mut self, ctx: &mut Self::Context) {
        self.hb(ctx);

        let addr = ctx.address();
        self.lobby_addr
            .send(Connect {
                addr: addr.recipient(),
                lobby_id: self.room_id,
                self_id: self.id,
            })
            .into_actor(self)
            .then(|res, _, ctx| {
                match res {
                    Ok(_res) => (),
                    _ => ctx.stop(),
                }
                fut::ready(())
            })
            .wait(ctx);
    }

    fn stopping(&mut self, _: &mut Self::Context) -> actix::Running {
        self.lobby_addr.do_send(Disconnect {
            id: self.id,
            room_id: self.room_id,
        });
        Running::Stop
    }
}

impl Session {
    fn hb(&self, ctx: &mut WebsocketContext<Self>) {
        ctx.run_interval(HEARTBEAT_INTERVAL, |act, ctx| {
            if Instant::now().duration_since(act.hb) > CLIENT_TIMEOUT {
                println!("Disconnecting failed heartbeat");
                act.lobby_addr.do_send(Disconnect {
                    id: act.id,
                    room_id: act.room_id,
                });
                ctx.stop();
                return;
            }

            ctx.ping(b"hi");
        });
    }
}

impl StreamHandler<Result<ws::Message, ws::ProtocolError>> for Session {
    fn handle(&mut self, msg: Result<ws::Message, ws::ProtocolError>, ctx: &mut Self::Context) {
        match msg {
            Ok(ws::Message::Ping(msg)) => {
                self.hb = Instant::now();
                ctx.pong(&msg);
            }
            Ok(ws::Message::Pong(_)) => {
                self.hb = Instant::now();
            }
            Ok(ws::Message::Binary(bin)) => ctx.binary(bin),
            Ok(ws::Message::Close(reason)) => {
                ctx.close(reason);
                ctx.stop();
            }
            Ok(ws::Message::Continuation(_)) => {
                ctx.stop();
            }
            Ok(ws::Message::Nop) => (),

            // handles a websocket message from client
            Ok(Text(s)) => self.lobby_addr.do_send(ClientActorMessage {
                id: self.id,
                msg: String::from(s),
                room_id: self.room_id,
            }),

            Err(_) => panic!("protocol error"),
        }
    }
}

// each time Session gets a WsMessage fn handle fires
impl Handler<WsMessage> for Session {
    type Result = ();

    fn handle(&mut self, msg: WsMessage, ctx: &mut Self::Context) {
        ctx.text(msg.0);
    }
}

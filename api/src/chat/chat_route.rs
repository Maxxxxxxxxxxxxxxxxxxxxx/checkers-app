use super::*;
use actix::{Addr};
use actix_web::{get, web::Data, web::Payload, Error, HttpRequest, HttpResponse};
use actix_web_actors::ws;

#[get("/chat/room?id={group_id}")]
pub async fn room(
    req: HttpRequest,
    stream: Payload,
    srv: Data<Addr<Lobby>>,
) -> Result<HttpResponse, Error> {

    let group_id = Uuid::from_str(
        req.match_info().query("group_id")
    ).unwrap();

    let ws = Session::new(group_id, srv.get_ref().clone());
    println!("{} polaczony do pokoju {}", &ws.id, &group_id);

    let resp = ws::start(ws, &req, stream)?;
    Ok(resp)
}

#[get("/chat/global")]
pub async fn global(
    req: HttpRequest,
    stream: Payload,
    srv: Data<Addr<Lobby>>,
) -> Result<HttpResponse, Error> {
    let ws = Session::new(super::GLOBAL_CHAT_ID, srv.get_ref().clone());
    println!("{} polaczony do global", &ws.id);

    let resp = ws::start(ws, &req, stream)?;
    Ok(resp)
}
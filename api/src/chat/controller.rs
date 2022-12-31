use super::*;
use actix::{Addr};
use actix_web::{get, web::Data, web::Payload, Error, HttpRequest, HttpResponse};
use actix_web_actors::ws;

#[get("/chat/{group_id}")]
pub async fn ws_route(
    req: HttpRequest,
    stream: Payload,
    // group_id: Uuid,
    srv: Data<Addr<Lobby>>,
) -> Result<HttpResponse, Error> {
    // dbg!(req.match_info().query("group_id"));
    let group_id = usize::from_str_radix(req.match_info().query("group_id"), 10).unwrap();

    let ws = WsConnection::new(group_id, srv.get_ref().clone());

    println!("{} polaczony do pokoju {}", &ws.id, &group_id);

    let resp = ws::start(ws, &req, stream)?;
    Ok(resp)
}

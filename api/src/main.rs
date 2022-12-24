#[macro_use] extern crate nickel;
#[macro_use] extern crate serde;

use nickel::{Nickel, HttpRouter, JsonBody};

#[derive(Serialize, Deserialize)]
struct Person {
    firstname: String,
    lastname:  String,
}

fn main() {
    let mut server = Nickel::new();

    server.post("/post/", middleware! { |request, response|
        let person = request.json_as::<Person>().unwrap();

        format!("Hello {} {}", person.firstname, person.lastname)
    });

    server.listen("127.0.0.1:6767").unwrap();
}
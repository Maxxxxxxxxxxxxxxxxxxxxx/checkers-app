# Instrukcja uruchomienia

Wymagane programy:

rustc 1.70-nightly \
cargo \
mosquitto \
docker

1. Odpalamy keycloaka przez docker-compose up
2. ```docker run -dp 7474:7474 -p 7687:7687 --env NEO4J_AUTH=neo4j/neo neo4j:4.4.16``` - uruchamiamy neo4j
3. w katalogu ```api``` odpalamy komendę ```cargo run```, aby odpalić api
4. w katalogu ```frontend``` odpalamy komendę ```yarn```, następnie ```vite```, aby odpalić frontend
5. włączamy brokera mqtt skryptem ```mosquitto.sh```

Apka działa na portach: ```8080```, ```8081```, ```8082```, ```7474```, ```7687```, ```1883```, + port z vite

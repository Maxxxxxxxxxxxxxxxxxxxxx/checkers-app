# Instrukcja uruchomienia

Wymagane programy:

rustc 1.70-nightly \
cargo \
mosquitto \
docker

### Odpalenie apki

1. Odpalamy keycloaka przez docker-compose up
2. ```docker run -dp 7474:7474 -p 7687:7687 --env NEO4J_AUTH=neo4j/neo neo4j:4.4.16``` - uruchamiamy neo4j
3. w katalogu ```api``` odpalamy komendę ```cargo run```, aby odpalić api
4. w katalogu ```frontend``` odpalamy komendę ```yarn```, następnie ```vite```, aby odpalić frontend
5. włączamy brokera mqtt skryptem ```mosquitto.sh```

Apka działa na portach: ```8080```, ```8081```, ```8082```, ```7474```, ```7687```, ```1883```, + port z vite

### Scenariusz testowy

Konto admina:
```
username: max
password: max123
```
Konto uzytkownika:
```
username: mmiotk
password: qwerty
```

Po wejściu na stronę powinno przekierować do panelu logowania keycloaka. Logujemy się na konto mmiotk i dodajemy grę przez okienko "New"\
\
<img width="165" alt="image" src="https://github.com/Maxxxxxxxxxxxxxxxxxxxxx/checkers-app/assets/92157385/8fbd8d6a-f81a-41b3-b883-620db8d8e3d3">
\
\
Następnie wylogowujemy się przyciskiem log out na sidebarze, logujemy na konto admina i dodajemy kolejną grę w ten sam sposób \
\
\
Przycisk logout:
\
<img width="127" alt="image" src="https://github.com/Maxxxxxxxxxxxxxxxxxxxxx/checkers-app/assets/92157385/7ede9966-6e08-4c9f-8c69-afd2c957c47d">
\
\
<img width="932" alt="image" src="https://github.com/Maxxxxxxxxxxxxxxxxxxxxx/checkers-app/assets/92157385/f577023b-c263-4c1d-8337-ba42315bf650"> \
\
Widook z perspektywy admina powinien wyglądać następująco: mamy grę utworzoną przez użytkownika i admina, i widoczny jest przycisk delete dla obu gier \
Podobną rzecz można zrobić z komentarzami po wejściu w zakładkę Comments dla danej gry \
\
<img width="127" alt="image" src="https://github.com/Maxxxxxxxxxxxxxxxxxxxxx/checkers-app/assets/92157385/dceff604-7d23-45d9-9685-9d139ab4bbd1">
\
\
Widok z perspektywy admina na stronie Comments powinien wyglądać mniej więcej tak: 
\
\
<img width="914" alt="image" src="https://github.com/Maxxxxxxxxxxxxxxxxxxxxx/checkers-app/assets/92157385/59790f31-95cc-4a3e-abf0-d0f193a0774c">
\
\
Widok z perspektywy użytkownika:
\
\
<img width="921" alt="image" src="https://github.com/Maxxxxxxxxxxxxxxxxxxxxx/checkers-app/assets/92157385/c2c5e89e-1cb8-4236-999d-f67b4688c3d2">


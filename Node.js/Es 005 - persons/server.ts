import * as _http from "http";

let HEADERS = require("./headers.json");
let dispatcher = require("./dispatcher.ts");
let persons = require("./persons.json");
let port: number = 1337;


// tutte le volte che arriva una richgiesta dal client parte questa funzione
let server = _http.createServer(function (req, res) {
    dispatcher.dispatch(req, res);
});
server.listen(port);
console.log("Server in ascolto sulla porta " + port);

// T------------------ Registrazione dei servizi ----------------------
dispatcher.addListener("GET", "/api/nazioni", function (req, res) {
    res.writeHead(200, HEADERS.json);

    let nazioni = []; // vettore enumerativo
    for (const person of persons.results) {
        if (!nazioni.includes(person.location.country)) {
            nazioni.push(person.location.country); // lo aggiungo al vettore
        }
    }
    nazioni.sort(); // lo ordina

    res.write(JSON.stringify({ "nazioni": nazioni }));
    res.end();
})
import * as _http from "http";

import HEADERS from "./headers.json";
import { Dispatcher } from "./dispatcher";
import * as _mongodb from "mongodb";

const mongoClient = _mongodb.MongoClient;
const CONNECTIONSTRING = "mongodb://127.0.0.1:27017";
const DB_NAME = "5B";

let port: number = 1337;
let dispatcher: Dispatcher = new Dispatcher();

// tutte le volte che arriva una richgiesta dal client parte questa funzione
let server = _http.createServer(function (req, res) {
    dispatcher.dispatch(req, res);
});
server.listen(port);
console.log("Server in ascolto sulla porta " + port);

// registrazione dei servizi
dispatcher.addListener("POST", "/api/salvaFacts", function (req, res) {
    let txtFacts = req["BODY"].facts;
    let idFact = req["BODY"].id;
    let date = new Date("2021-11-15");

    mongoClient.connect(CONNECTIONSTRING, function (err, client) {
        if (!err) {
            let db = client.db(DB_NAME);
            let collection = db.collection("vallauri");
            let req = collection.updateOne(
                {"_id": idFact},
                {"$set": {
                    "_id": idFact, "value": txtFacts, "updated_at": date
                }}
            );
            req.then(function (data) {
                res.writeHead(200, HEADERS.json);
                res.write(JSON.stringify(data));
                res.end();
            })
            req.catch(function (err) {
                res.writeHead(500, HEADERS.text);
                res.write("Errore esecuzione query: " + err.message);
                res.end();
            })
            req.finally(function () {
                client.close();
            })
        }
        else {
            console.log("Errore nella connessione al database: " + err.message);
        }
    });
})

dispatcher.addListener("GET", "/api/facts", function (req, res) {

    mongoClient.connect(CONNECTIONSTRING, function (err, client) {
        if (!err) {
            let db = client.db(DB_NAME);
            let collection = db.collection("facts");
            let req = collection.aggregate([
                {"$project": {"value": 1}}
            ]).toArray();
            req.then(function (data) {
                res.writeHead(200, HEADERS.json);
                res.write(JSON.stringify(data));
                res.end();
            })
            req.catch(function (err) {
                res.writeHead(500, HEADERS.text);
                res.write("Errore esecuzione query: " + err.message);
                res.end();
            })
            req.finally(function () {
                client.close();
            })
        }
        else {
            console.log("Errore nella connessione al database: " + err.message);
        }
    });
})
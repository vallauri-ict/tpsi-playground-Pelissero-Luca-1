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
dispatcher.addListener("POST", "/api/servizio1", function (req, res) {
    let dataStart = new Date(req["BODY"].dataStart);
    let dataEnd = new Date(req["BODY"].dataEnd);

    mongoClient.connect(CONNECTIONSTRING, function (err, client) {
        if (!err) {
            let db = client.db(DB_NAME);
            let collection = db.collection("unicorns");
            let req = collection.find({
                "$and": [
                    { "$gte": { "dob": dataStart } },
                    { "$lte": { "dob": dataEnd } }
                ]
            }).project({ "nome": 1, "classe": 1 }).toArray();
            req.then(function (data) {
                res.writeHead(200, HEADERS.json);
                res.write(JSON.stringify(data));
                res.end();
            })
            req.catch(function (err) {
                res.writeHead(200, HEADERS.json);
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
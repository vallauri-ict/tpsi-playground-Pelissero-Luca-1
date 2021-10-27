import * as _http from "http";
import * as _mongodb from "mongodb";
import HEADERS from "./headers.json";
import { Dispatcher } from "./dispatcher";

const mongoClient = _mongodb.MongoClient;
const port: number = 1337;
const dispatcher: Dispatcher = new Dispatcher();

const server = _http.createServer(function (req, res) {
    dispatcher.dispatch(req, res);
});
server.listen(port);
console.log("Server in ascolto sulla porta " + port);

// modello di accesso al data base
mongoClient.connect("mongodb://127.0.0.1:27017", function (err, client) {
    if (!err) {
        let db = client.db("5B_Studenti");
        let collection = db.collection("Studenti");
        // .find() restituisce tutti i record
        collection.find().toArray(function (err, data) {
            if (!err) {
                console.log(data);
            }
            else {
                console.log("Errore esecuzione qury: " + err.message);
            }
            client.close();
        });
    }
    else {
        console.log("Errore nella connessione al database: " + err.message);
    }
});
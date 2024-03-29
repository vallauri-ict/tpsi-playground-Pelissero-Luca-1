import * as _http from "http";
import * as _mongodb from "mongodb";
import HEADERS from "./headers.json";
import { Dispatcher } from "./dispatcher";

const mongoClient = _mongodb.MongoClient;
const CONNECTIONSTRING = "mongodb://127.0.0.1:27017";
// const port: number = 1337;
// const dispatcher: Dispatcher = new Dispatcher();

// const server = _http.createServer(function (req, res) {
//     dispatcher.dispatch(req, res);
// });
// server.listen(port);
// console.log("Server in ascolto sulla porta " + port);

// inserimento nuovo record (lo commento altrimenti tutte le volte aggiunge un record)
// mongoClient.connect(CONNECTIONSTRING, function (err, client) {
//     if (!err) {
//         let db = client.db("5B_Studenti");
//         let collection = db.collection("Studenti");
//         let student = {
//             "nome": "Piepaolo",
//             "cognome": "Pelissero",
//             "indirizzo": "Informatica",
//             "sezione": "B",
//             "hobbies": ["nuoto", "calcio"],
//             "residenta": {"citta":"Genola", "provincia":"Cuneo", "cap":"12045"},
//             "lavoratore": false
//         };
//         collection.insertOne(student,function (err, data) {
//             if (!err) {
//                 console.log("Insert: "+data);
//             }
//             else {
//                 console.log("Errore esecuzione qury: " + err.message);
//             }
//             client.close();
//         })
//     }
//     else {
//         console.log("Errore nella connessione al database: " + err.message);
//     }
// });

// modello di accesso al data base
mongoClient.connect(CONNECTIONSTRING, function (err, client) {
    if (!err) {
        let db = client.db("5B_Studenti");
        let collection = db.collection("Studenti");
        // .find() restituisce tutti i record
        collection.find().toArray(function (err, data) {
            if (!err) {
                console.log("find: " + data);
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

// Update (filtro, azione)
mongoClient.connect(CONNECTIONSTRING, function (err, client) {
    if (!err) {
        let db = client.db("5B_Studenti");
        let collection = db.collection("Studenti");
        collection.updateOne({ "nome": "Pierpaolo" }, { $set: { "nome": "Chiara" } }, function (err, data) {
            if (!err) {
                console.log("UpdateOne: " + data);
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

// Delete
mongoClient.connect(CONNECTIONSTRING, function (err, client) {
    if (!err) {
        let db = client.db("5B_Studenti");
        let collection = db.collection("Studenti");
        collection.deleteMany({ "nome": "Michele" }, function (err, data) {
            if (!err) {
                console.log("Delete: " + data);
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
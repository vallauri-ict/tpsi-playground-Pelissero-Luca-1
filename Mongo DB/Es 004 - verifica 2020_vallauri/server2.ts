import * as _http from "http";

import * as _mongodb from "mongodb";

const mongoClient = _mongodb.MongoClient;
const CONNECTIONSTRING = "mongodb://127.0.0.1:27017";
const DB_NAME = "5B";

mongoClient.connect(CONNECTIONSTRING, function (err, client) {
    if (!err) {
        let db = client.db(DB_NAME);
        let collection = db.collection("vallauri");
        let req = collection.aggregate([
            {
                "$project": {
                    "mediaItaliana": { "$avg": "$italiano" },
                    "mediaInformatica": { "$avg": "$informatica" },
                    "mediaMatematica": { "$avg": "$matematica" },
                    "mediaSistemi": { "$avg": "$sistemi" },
                    "classe": 1
                }
            },
            {
                "$project": {
                    "mediaStudente": { "$avg": ["$mediaItaliana", "$mediaInformatica", "$mediaMatematica", "$mediaSistemi"] },
                    "classe": 1
                }
            },
            {
                "$group": {
                    "_id": "$classe", "mediaClasse": { "$avg": "$mediaStudente" }
                }
            },
            {
                "$sort": {
                    "mediaClasse": -1
                }
            },
            {
                "$project": {
                    "mediaClasse": {"$round": ["$mediaClasse", 2]}
                }
            }
        ]).toArray();
        req.then(function (data) {
            console.log("Query 2: ", data)
        })
        req.catch(function (err) {
            console.log("Errore: ", err)
        })
        req.finally(function () {
            client.close();
        })
    }
    else {
        console.log("Errore nella connessione al database: " + err.message);
    }
});
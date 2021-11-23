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
            { "$project": { "classe": 1, "mItaliano": { "$avg": "$italiano" }, "mMatematica": { "$avg": "$matematica" }, "mInformatica": { "$avg": "$informatica" }, "mSistemi": { "$avg": "$sistemi" } } },
            { "$project": { "classe": 1, "materie": { "$avg": ["$mItaliano", "$mMatematica", "$mInformatica", "$mSistemi"] } } },
            { "$group": { "_id": "$classe", "mediaClasse": { "$avg": "$materie" } } },
            { "$sort": { "mediaClasse": -1 } },
            { "$project": { "mediaClasse": { "$round": ["$mediaClasse", 2] } } }
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

mongoClient.connect(CONNECTIONSTRING, function (err, client) {
    if (!err) {
        let db = client.db(DB_NAME);
        let collection = db.collection("vallauri");
        let req = collection.aggregate([
            { "$match": { "genere": "f", "classe": "4A" } },
            { "$set": { "informatica": { "$concatArrays": ["$informatica", [7]] } } },
        ]).toArray();
        req.then(function (data) {
            console.log("Query 3: ", data)
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

mongoClient.connect(CONNECTIONSTRING, function (err, client) {
    if (!err) {
        let db = client.db(DB_NAME);
        let collection = db.collection("vallauri");
        let req = collection.deleteMany(
            { "classe": "3B", "sistemi": { "$in": [3] } }
        )
        req.then(function (data) {
            console.log("Query 4: ", data)
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

mongoClient.connect(CONNECTIONSTRING, function (err, client) {
    if (!err) {
        let db = client.db(DB_NAME);
        let collection = db.collection("vallauri");
        let req = collection.aggregate([
            { "$group": { "_id": "$classe", "totaleOre": { "$sum": "$assenze" } } },
            {"$sort": {"totaleOre": -1}}
        ]).toArray()
        req.then(function (data) {
            console.log("Query 5: ", data)
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
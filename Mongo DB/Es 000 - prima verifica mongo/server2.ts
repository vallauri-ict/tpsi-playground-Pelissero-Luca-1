import * as _http from "http";

import * as _mongodb from "mongodb";

const mongoClient = _mongodb.MongoClient;
const CONNECTIONSTRING = "mongodb://127.0.0.1:27017";
const DB_NAME = "5B";

const base64Chars = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "-", "_"]

mongoClient.connect(CONNECTIONSTRING, function (err, client) {
    if (!err) {
        let db = client.db(DB_NAME);
        let collection = db.collection("facts");
        let req = collection.find(
            { "$or": [{ "categories": { "$in": ["music"] } }, { "score": { "$gte": 620 } }] }
        ).project({ "_id": 1, "categories": 1, "score": 1 }).toArray();
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
    let date = new Date("2021-11-24");
    let id;
    for (let i = 0; i < 22; i++) {
        id += base64Chars[Math.floor(Math.random() * base64Chars.length - 1)]
    }
    if (!err) {
        let db = client.db(DB_NAME);
        let collection = db.collection("facts");
        let req = collection.insertOne(
            {
                "created_at": date,
                "_id": id,
                "value": "I'm inserting a new chucknorris's fact",
                "icon_url": "https://assets.chucknorris.host/img/avatar/chuck-norris.png",
                "url": "https://api.chucknorris.io/jokes/" + id,
                "score": 0
            }
        );
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
    let date = new Date("2021-11-15");
    if (!err) {
        let db = client.db(DB_NAME);
        let collection = db.collection("facts");
        let req = collection.deleteMany(
            { "created_at": { "$gt": date }, "score": 0 }
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
        let collection = db.collection("facts");
        let req = collection.aggregate([
            {"$project": {"categories": 1, "score": 1}},
            { "$unwind": "$categories" }, 
            { "$group": { _id: "$categories", "mediaScore": { "$avg": "$score" } } },
            {"$project": {"mediaScore": {"$round": ["$mediaScore", 2]}}},
            {"$sort": {"mediaScore": -1}}
        ]).toArray();
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

mongoClient.connect(CONNECTIONSTRING, function (err, client) {
    if (!err) {
        let db = client.db(DB_NAME);
        let collection = db.collection("facts");
        let req = collection.aggregate([
            {"$project": {"categories": 1}},
            { "$unwind": "$categories" }, 
            { "$group": { _id: "$categories"} }
        ]).toArray();
        req.then(function (data) {
            console.log("Query 6a: ", data)
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
        let collection = db.collection("facts");
        let req = collection.aggregate([
            { "$unwind": "$categories" }, 
            { "$group": { "_id": "$categories"} },
            {"$sort": {"_id": -1}}
        ]).toArray();
        req.then(function (data) {
            console.log("Query 6b: ", data)
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
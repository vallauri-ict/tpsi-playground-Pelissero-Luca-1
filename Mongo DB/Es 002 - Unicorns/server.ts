import * as _http from "http";
import * as _mongodb from "mongodb";
import HEADERS from "./headers.json";

const mongoClient = _mongodb.MongoClient;
const CONNECTIONSTRING = "mongodb://127.0.0.1:27017";
const DB_NAME = "5B";

// Query 1
mongoClient.connect(CONNECTIONSTRING, function (err, client) {
    if (!err) {
        let db = client.db(DB_NAME);
        let collection = db.collection("unicorns");
        collection.find({ "weight": { "$lte": 800, "$gte": 700 } }).toArray(function (err, data) {
            if (!err) {
                console.log("Query 1:", data);
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

// Query 2
mongoClient.connect(CONNECTIONSTRING, function (err, client) {
    if (!err) {
        let db = client.db(DB_NAME);
        let collection = db.collection("unicorns");
        collection.find({ "$and": [{ "gender": "m" }, { "loves": { "$in": ["grape", "apple"] } }, { "vampires": { "$gte": 60 } }] }).toArray(function (err, data) {
            if (!err) {
                console.log("Query 2:", data);
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

// Query 3
mongoClient.connect(CONNECTIONSTRING, function (err, client) {
    if (!err) {
        let db = client.db(DB_NAME);
        let collection = db.collection("unicorns");
        collection.find({ "$or": [{ "gender": "f" }, { "weight": { "$lte": 700 } }] }).toArray(function (err, data) {
            if (!err) {
                console.log("Query 3:", data);
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

// Query 4
mongoClient.connect(CONNECTIONSTRING, function (err, client) {
    if (!err) {
        let db = client.db(DB_NAME);
        let collection = db.collection("unicorns");
        collection.find({ "$and": [{ "loves": { "$in": ["apple", "grape"] } }, { "vampires": { "$gte": 60 } }] }).toArray(function (err, data) {
            if (!err) {
                console.log("Query 4:", data);
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

// Query 5
mongoClient.connect(CONNECTIONSTRING, function (err, client) {
    if (!err) {
        let db = client.db(DB_NAME);
        let collection = db.collection("unicorns");
        collection.find({ "loves": { "$all": ["grape", "watermalon"] } }).toArray(function (err, data) {
            if (!err) {
                console.log("Query 5:", data);
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

// Query 6
mongoClient.connect(CONNECTIONSTRING, function (err, client) {
    if (!err) {
        let db = client.db(DB_NAME);
        let collection = db.collection("unicorns");
        collection.find({ "$or": [{ "hair": "brown" }, { "hair": "gray" }] }).toArray(function (err, data) {
            if (!err) {
                console.log("Query 6:", data);
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

// Query 6 bis
mongoClient.connect(CONNECTIONSTRING, function (err, client) {
    if (!err) {
        let db = client.db(DB_NAME);
        let collection = db.collection("unicorns");
        collection.find({ "hair": { "$in": ["gray", "brown"] } }).toArray(function (err, data) {
            if (!err) {
                console.log("Query 6 bis:", data);
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

// Query 7
mongoClient.connect(CONNECTIONSTRING, function (err, client) {
    if (!err) {
        let db = client.db(DB_NAME);
        let collection = db.collection("unicorns");
        collection.find({ "$and": [{ "vaccinated": { "$exists": true } }, { "vaccinated": true }] }).toArray(function (err, data) {
            if (!err) {
                console.log("Query 7:", data);
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

// Query 9
mongoClient.connect(CONNECTIONSTRING, function (err, client) {
    if (!err) {
        let db = client.db(DB_NAME);
        let collection = db.collection("unicorns");
        let regex = new RegExp("^A", "i");
        collection.find({ "$and": [{ "name": { "$regex": regex } }, { "gender": "f" }] }).toArray(function (err, data) {
            if (!err) {
                console.log("Query 9:", data);
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

// Query 10
mongoClient.connect(CONNECTIONSTRING, function (err, client) {
    if (!err) {
        let db = client.db(DB_NAME);
        let collection = db.collection("unicorns");
        collection.find({ "_id": new _mongodb.ObjectId('6182393c5fcc55f6095ada66') }).toArray(function (err, data) {
            if (!err) {
                console.log("Query 10:", data);
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

// Query 11 a
mongoClient.connect(CONNECTIONSTRING, function (err, client) {
    if (!err) {
        let db = client.db(DB_NAME);
        let collection = db.collection("unicorns");
        collection.find({ "gender": "m" }).project({ "name": 1, "vampires": 1, "_id": 0 }).toArray(function (err, data) {
            if (!err) {
                console.log("Query 11 a:", data);
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

// Query 11 b
mongoClient.connect(CONNECTIONSTRING, function (err, client) {
    if (!err) {
        let db = client.db(DB_NAME);
        let collection = db.collection("unicorns");
        collection.find({ "gender": "m" }).project({ "name": 1, "vampires": 1, "_id": 0 }).sort({ "vampires": -1, "name": 1 }).toArray(function (err, data) {
            if (!err) {
                console.log("Query 11 b:", data);
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

// Query 11 c
mongoClient.connect(CONNECTIONSTRING, function (err, client) {
    if (!err) {
        let db = client.db(DB_NAME);
        let collection = db.collection("unicorns");
        collection.find({ "gender": "m" }).project({ "name": 1, "vampires": 1, "_id": 0 }).sort({ "vampires": -1, "name": 1 }).skip(1).limit(3).toArray(function (err, data) {
            if (!err) {
                console.log("Query 11 c:", data);
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

// Query 12
mongoClient.connect(CONNECTIONSTRING, function (err, client) {
    if (!err) {
        let db = client.db(DB_NAME);
        let collection = db.collection("unicorns");
        collection.find({ "weight": { "$gt": 500 } }).count(function (err, data) {
            if (!err) {
                console.log("Query 12:", data);
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

// Query 13
mongoClient.connect(CONNECTIONSTRING, function (err, client) {
    if (!err) {
        let db = client.db(DB_NAME);
        let collection = db.collection("unicorns");
        collection.findOne({ "name": "Aurora" }, {"projection":{ "hair": 1, "weight": 1 }}), function (err, data) {
            if (!err) {
                console.log("Query 13:", data);
            }
            else {
                console.log("Errore esecuzione qury: " + err.message);
            }
            client.close();
        }
    }
    else {
        console.log("Errore nella connessione al database: " + err.message);
    }
});
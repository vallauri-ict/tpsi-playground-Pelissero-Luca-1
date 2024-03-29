import * as _http from "http";
import * as _mongodb from "mongodb";
import HEADERS from "./headers.json";

const mongoClient = _mongodb.MongoClient;
const CONNECTIONSTRING = "mongodb://127.0.0.1:27017";
const DB_NAME = "5B";

// Primo esempio Aggregate
mongoClient.connect(CONNECTIONSTRING, function (err, client) {
   if (!err) {
      let db = client.db(DB_NAME);
      let collection = db.collection("unicorns");
      // i nomni dei campi devono essere sempre preceduti dal $ se li uso come valore (riga 19 / riga 20)
      // dopo aver fatto i gruppi con $group il recordset risultante avrà solo 2 colonneche sono _id e totale 
      // (gli altri non sono più visibili)
      let req = collection.aggregate([
         { "$match": { "status": "A" } },
         { "$group": { "_id": "$cust_id", "totale": { "$sum": "$amount" } } },
         { "$sort": { "amount": -1 } }
      ]).toArray();
      req.then(function (data) {
         console.log("Query 1:", data);
      })
      req.catch(function (err) {
         console.log("Errore esecuzione query: " + err.message)
      })
      req.finally(function () {
         client.close();
      })
   }
   else {
      console.log("Errore nella connessione al database: " + err.message);
   }
});

// Secondo esempio Aggregate
mongoClient.connect(CONNECTIONSTRING, function (err, client) {
   if (!err) {
      let db = client.db(DB_NAME);
      let collection = db.collection("unicorns");
      let req = collection.aggregate([
         { "$group": { "_id": "$cust_id", "avgAmount": { "$avg": "$amount" }, "avgTotal": { "$avg": { "$multiply": ["$qta", "$amount"] } } } }
      ]).toArray();
      req.then(function (data) {
         console.log("Query 2:", data);
      })
      req.catch(function (err) {
         console.log("Errore esecuzione query: " + err.message)
      })
      req.finally(function () {
         client.close();
      })
   }
   else {
      console.log("Errore nella connessione al database: " + err.message);
   }
});

// Terzo esempio Aggregate
mongoClient.connect(CONNECTIONSTRING, function (err, client) {
   if (!err) {
      let db = client.db(DB_NAME);
      let collection = db.collection("unicorns");
      let req = collection.aggregate([
         { "$match": { "gender": { "$exists": true } } },
         { "$group": { "_id": "$gender", "totale": { "$sum": 1 } } }
      ]).toArray();
      req.then(function (data) {
         console.log("Query 3:", data);
      })
      req.catch(function (err) {
         console.log("Errore esecuzione query: " + err.message)
      })
      req.finally(function () {
         client.close();
      })
   }
   else {
      console.log("Errore nella connessione al database: " + err.message);
   }
});

// Quarto esempio Aggregate
mongoClient.connect(CONNECTIONSTRING, function (err, client) {
   if (!err) {
      let db = client.db(DB_NAME);
      let collection = db.collection("unicorns");
      let req = collection.aggregate([
         { "$match": { "gender": { "$exists": true } } },
         { "$group": { "_id": { "gender": "$gender" }, "mediaVampiri": { "$avg": "$vampires" } } }
      ]).toArray();
      req.then(function (data) {
         console.log("Query 4:", data);
      })
      req.catch(function (err) {
         console.log("Errore esecuzione query: " + err.message)
      })
      req.finally(function () {
         client.close();
      })
   }
   else {
      console.log("Errore nella connessione al database: " + err.message);
   }
});

// Quinto esempio Aggregate
mongoClient.connect(CONNECTIONSTRING, function (err, client) {
   if (!err) {
      let db = client.db(DB_NAME);
      let collection = db.collection("unicorns");
      // nome di campi sempre con $ se usati come valore (a sinistra)
      let rq = collection
         .aggregate([
            { $match: { gender: { $exists: true } } },
            { $group: { _id: { gender: "$gender", hair: "$hair" }, nEsemplari: { $sum: 1 } } },
            { $sort: { nEsemplari: -1, _id: -1 } },
         ])
         .toArray();
      rq.then(function (data) {
         console.log("Query 5:", data);
      });
      rq.catch(function (err) {
         console.log("Errore esecuzione query " + err.message);
      });
      rq.finally(function () {
         client.close();
      });
   } else {
      console.log("Errore connessione al db");
   }
});


// Sesto esempio Aggregate
mongoClient.connect(CONNECTIONSTRING, function (err, client) {
   if (!err) {
      let db = client.db(DB_NAME);
      let collection = db.collection("unicorns");
      let req = collection.aggregate([
         { "$group": { "_id": {}, "media": { "$avg": "$vampires" } } },
         { "$project": { "_id": 0, "media": 1 } }
      ]).toArray();
      req.then(function (data) {
         console.log("Query 6:", data);
      })
      req.catch(function (err) {
         console.log("Errore esecuzione query: " + err.message)
      })
      req.finally(function () {
         client.close();
      })
   }
   else {
      console.log("Errore nella connessione al database: " + err.message);
   }
});

// Settimo esempio Aggregate
mongoClient.connect(CONNECTIONSTRING, function (err, client) {
   if (!err) {
      let db = client.db(DB_NAME);
      let collection = db.collection("unicorns");
      let req = collection.aggregate([
         { "$group": { "_id": {}, "media": { "$avg": "$vampires" } } },
         { "$project": { "_id": 0, "ris": { "$round": "$media" } } }
      ]).toArray();
      req.then(function (data) {
         console.log("Query 7:", data);
      })
      req.catch(function (err) {
         console.log("Errore esecuzione query: " + err.message)
      })
      req.finally(function () {
         client.close();
      })
   }
   else {
      console.log("Errore nella connessione al database: " + err.message);
   }
});

// Ottavo esempio Aggregate
mongoClient.connect(CONNECTIONSTRING, function (err, client) {
   if (!err) {
      let db = client.db(DB_NAME);
      let collection = db.collection("quizzes");
      let req = collection.aggregate([
         // funzioni di aggregazione di project lavorano sui campi del singolo record
         {
            "$project": {
               "quizAvg": { "$avg": "$quizzes" },
               "labAvg": { "$round": "$media" },
               "examAvg": { "$avg": ["$midterm", "$final"] }
            }
         },
         {
            "$project": {
               "quizAvg": { "$round": ["$quizAvg", 1] },
               "labAvg": { "$round": ["$labAvg", 1] },
               "examAvg": { "$round": ["$examAvg", 1] }
            }
         },
         {
            "$group": {
               "_id": {},
               "mediaQuiz": { "$avg": "$quizAvg" },
               "mediaLab": { "$avg": "$labAvg" },
               "mediaExam": { "$avg": "$examAvg" }
            }
         },
         {
            "$project": {
               "mediaQuiz": { "$round": ["$mediaQuiz", 2] },
               "mediaLab": { "$round": ["$mediaLab", 2] },
               "mediaExam": { "$round": ["$mediaExam", 2] },
            }
         }
      ]).toArray();
      req.then(function (data) {
         console.log("Query 8:", data);
      })
      req.catch(function (err) {
         console.log("Errore esecuzione query: " + err.message)
      })
      req.finally(function () {
         client.close();
      })
   }
   else {
      console.log("Errore nella connessione al database: " + err.message);
   }
});

// Nono esempio Aggregate
mongoClient.connect(CONNECTIONSTRING, function (err, client) {
   if (!err) {
      let db = client.db(DB_NAME);
      let collection = db.collection("students");
      // let regExp = new RegExp("F", "i");
      let req = collection.aggregate([
         { "$match": { "genere": "f" } },
         { "$project": { "nome": 1, "mediaVoti": { "$avg": "$voti" } } },
         { "$sort": { "mediaVoti": -1 } },
         { "$skip": 1 },
         { "$limit": 1 }
      ]).toArray();
      req.then(function (data) {
         console.log("Query 9:", data);
      })
      req.catch(function (err) {
         console.log("Errore esecuzione query: " + err.message)
      })
      req.finally(function () {
         client.close();
      })
   }
   else {
      console.log("Errore nella connessione al database: " + err.message);
   }
});

// Decimo esempio Aggregate
mongoClient.connect(CONNECTIONSTRING, function (err, client) {
   if (!err) {
      let db = client.db(DB_NAME);
      let collection = db.collection("orders");
      let req = collection.aggregate([
         { "$project": { "status": 1, "nDettagli": 1 } },
         { "$unwind": "$nDettagli" },
         { "$group": { "_id": "$status", "sommaDettagli": { "$sum": "$nDettagli" } } }
      ]).toArray();
      req.then(function (data) {
         console.log("Query 10:", data);
      })
      req.catch(function (err) {
         console.log("Errore esecuzione query: " + err.message)
      })
      req.finally(function () {
         client.close();
      })
   }
   else {
      console.log("Errore nella connessione al database: " + err.message);
   }
});

// Undicesimo esempio Aggregate
mongoClient.connect(CONNECTIONSTRING, function (err, client) {
   if (!err) {
      let db = client.db(DB_NAME);
      let collection = db.collection("students");
      let req = collection.find(
         { "$expr": { "$gte": [{ "$year": "$nato" }, 2000] } }
      ).toArray();
      req.then(function (data) {
         console.log("Query 11:", data);
      })
      req.catch(function (err) {
         console.log("Errore esecuzione query: " + err.message)
      })
      req.finally(function () {
         client.close();
      })
   }
   else {
      console.log("Errore nella connessione al database: " + err.message);
   }
});
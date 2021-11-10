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
         { "$group": { "_id": "$cust_id", "avgAmount": { "$avg": "$amount" }, "avgTotal": {"$avg": {"$miltiply": ["$qta", "$amount"]}} } },
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
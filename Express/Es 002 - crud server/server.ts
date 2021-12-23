import express from "express";
import * as http from "http";
import * as fs from "fs";
import * as body_parser from "body-parser";
import HEADERS from "./headers.json";

// mongo
import * as _mongodb from "mongodb";
const mongoClient = _mongodb.MongoClient;
const CONNECTIONSTRING = "mongodb+srv://admin:admin@cluster0.eawws.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const DB_NAME = "5B";

let port: number = 1337;
let app = express();

let server = http.createServer(app);

server.listen(port, () => {
   console.log("Server in ascolto sulla porta " + port)
   init();
});

let paginaErrore = "";
function init() {
   fs.readFile("./static/error.html", (err, data) => {
      if (!err) {
         paginaErrore = data.toString();
      } else {
         paginaErrore = "<h2>Risorsa non trovata</h2>";
      }
   })
}

// *********************************************************************
//              elenco delle routes di tipo middleware
// *********************************************************************
// 1.log
app.use("/", (req, res, next) => {
   console.log("----> " + req.method + ":" + req.originalUrl);
   next();
})

// 2.static route
app.use("/", express.static("./static"));

// 3.route lettura parametri post
app.use("/", body_parser.json())
app.use("/", body_parser.urlencoded({ extended: true }))

// 4.log dei parametri
app.use("/", (req, res, next) => {
   if (Object.keys(req.body).length > 0) {
      console.log("Parametri GET: ", req.query)
   }
   if (Object.keys(req.body).length > 0) {
      console.log("Parametri BODY: ", req.body)
   }
   next();
})

// *********************************************************************
//              elenco delle routes di risposta al client
// *********************************************************************
// middleware di apertura della connessione
app.use("/", function (req, res, next) {
   mongoClient.connect(CONNECTIONSTRING, function (err, client) {
      if (err) {
         res.status(503).send("Errore nella connessione al DB");
      }
      else {
         console.log("Connected succesfully");
         req["client"] = client;
         next();
      }
   });
});

// lettura delle collezioni presenti nel DB
app.use("/api/getCollections", function (req, res, next) {
   let db = req["client"].db(DB_NAME) as _mongodb.Db;
   let request = db.listCollections().toArray();
   request.then(function (data) {
      res.send(data);
   });
   request.catch(function (err) {
      res.status(503).send("Errore esecuzione query");
   })
   request.finally(function () {
      req["client"].close();
   })
});

// middleware di intercettazione dei parametri
let currentCollection = "";
let id = "";
// id? campo facoltativo
app.use("/api/:collection/:id?", function (req, res, next) {
   currentCollection = req.params.collection;
   id = req.params.id;
   next();
});


// listener specifici:
app.get("/api/*", function (req, res, next) {
   let db = req["client"].db(DB_NAME) as _mongodb.Db;
   let collection = db.collection(currentCollection);
   if (!id) {
      let request = collection.find(req["query"]).toArray();
      request.then(function (data) {
         res.send(data);
      });
      request.catch(function (err) {
         res.status(503).send("Errore esecuzione query");
      })
      request.finally(function () {
         req["client"].close();
      })
   }
   else {
      let oId = new _mongodb.ObjectId(id);
      let request = collection.findOne({ "_id": oId });
      request.then(function (data) {
         res.send(data);
      });
      request.catch(function (err) {
         res.status(503).send("Errore esecuzione query");
      })
      request.finally(function () {
         req["client"].close();
      })
   }
});

app.post("/api/*", function (req, res, next) {
   let db = req["client"].db(DB_NAME) as _mongodb.Db;
   let collection = db.collection(currentCollection);

   let request = collection.insertOne(req["body"]);
   request.then(function (data) {
      res.send(data);
   });
   request.catch(function (err) {
      res.status(503).send("Errore esecuzione query");
   })
   request.finally(function () {
      req["client"].close();
   })
});

app.post("/api/*", function (req, res, next) {
   let db = req["client"].db(DB_NAME) as _mongodb.Db;
   let collection = db.collection(currentCollection);
   let _id = new _mongodb.ObjectId(id);

   let request = collection.deleteOne({ "_id": _id });
   request.then(function (data) {
      res.send(data);
   });
   request.catch(function (err) {
      res.status(503).send("Errore esecuzione query");
   })
   request.finally(function () {
      req["client"].close();
   })
});

app.patch("/api/*", function (req, res, next) {
   let db = req["client"].db(DB_NAME) as _mongodb.Db;
   let collection = db.collection(currentCollection);
   let _id = new _mongodb.ObjectId(id);

   let request = collection.updateOne({ "_id": _id }, { "$set": req["BODY"] });
   request.then(function (data) {
      res.send(data);
   });
   request.catch(function (err) {
      res.status(503).send("Errore esecuzione query");
   })
   request.finally(function () {
      req["client"].close();
   })
});

app.put("/api/*", function (req, res, next) {
   let db = req["client"].db(DB_NAME) as _mongodb.Db;
   let collection = db.collection(currentCollection);
   let _id = new _mongodb.ObjectId(id);

   let request = collection.replaceOne({ "_id": _id }, req["BODY"]);
   request.then(function (data) {
      res.send(data);
   });
   request.catch(function (err) {
      res.status(503).send("Errore esecuzione query");
   })
   request.finally(function () {
      req["client"].close();
   })
});

// *********************************************************************
// default route (risorsa non trovata) e routes di gestione degli errori
// *********************************************************************
app.use("/", function (req, res, next) {
   res.status(404);
   if (req.originalUrl.startsWith("/api/")) {
      res.send("Servizio non trovato ");
   } else {
      res.send(paginaErrore);
   }
});

// route di gestione errori
app.use("/", (err, req, res, next) => {
   console.log("Errore codice server", err.message);
})
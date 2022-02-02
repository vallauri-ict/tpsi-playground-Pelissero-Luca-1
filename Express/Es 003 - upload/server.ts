//#region import
import * as http from "http";
import * as fs from "fs";
import * as bodyParser from "body-parser";
import express from "express";
import * as mongodb from "mongodb";
import cors from "cors";
import fileUpload, { UploadedFile } from "express-fileupload";
//#endregion

//#region mongoDB
const mongoClient = mongodb.MongoClient;
const CONNECTION_STRING =
  process.env.MONGODB_URI ||
  "mongodb+srv://admin:admin@cluster0.eawws.mongodb.net/5B?retryWrites=true&w=majority";
// const CONNECTION_STRING = "mongodb://127.0.0.1:27017";
// const CONNECTION_STRING =
//   "mongodb+srv://admin:admin@cluster0.niwz6.mongodb.net/5B?retryWrites=true&w=majority";
const DB_NAME = "5B";
//#endregion

const PORT: number = parseInt(process.env.PORT) || 1337;
const app = express();

const server = http.createServer(app);

server.listen(PORT, () => {
  console.log(`Server in ascolto sulla porta: ${PORT}`);
  init();
});

let paginaErrore = "";
function init() {
  fs.readFile("./static/error.html", (err, data) => {
    if (!err) paginaErrore = data.toString();
    else paginaErrore = "<h2>Risorsa non trovata</h2>";
  });
}

const whitelist = [
  "http://localhost:4200",
  "http://localhost:1337"
];

/*  ******************************************
    //  elenco delle routes middleware
    ****************************************** */

//  1. Log
app.use("/", (req, res, next) => {
  console.log("---> ", req.method + ": " + req.originalUrl);
  next();
});

//  2. Static route
app.use("/", express.static("./static")); //  next fa in automatico

//  3. Route lettura paramentri post
app.use("/", bodyParser.json());
app.use("/", bodyParser.urlencoded({ extended: true }));

//  4. Log dei parametri
app.use("/", (req, res, next) => {
  if (Object.keys(req.query).length > 0) console.log("GET --->", req.query);
  if (Object.keys(req.body).length > 0) console.log("BODY --->", req.body);
  next();
});

//  5. Middleware cors
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (whitelist.indexOf(origin) === -1) {
      var msg =
        "The CORS policy for this site does not " +
        "allow access from the specified Origin.";
      return callback(new Error(msg), false);
    } else return callback(null, true);
  },
  credentials: true,
};
app.use("/", cors(corsOptions));

// 6. fileupload
app.use(fileUpload({
  "limits ": { "fileSize ": (10 * 1024 * 1024) } // 10 MB
}));


// Connessione al DB
app.use("/", (req, res, next) => {
  mongoClient.connect(CONNECTION_STRING, (err, client) => {
    if (err) res.status(503).send("DB connection error");
    else {
      req["client"] = client;
      next();
    }
  });
});

/*  ******************************************
    elenco delle routes di risposta al client
    ****************************************** */

//  middleware di intercettazione dei parametri
let currentCollection: string = "";

//  listener specifici

app.get("/api/images", (req, res, next) => {
  if (currentCollection) {
    let db = req["client"].db(DB_NAME) as mongodb.Db;
    let collection = db.collection("images");
    collection
      .find().toArray()
      .then((data) => res.send(data))
      .catch((err) => res.status(503).send("QUERY: Syntax error"))
      .finally(() => req["client"].close());
  }
});

app.get("/api/uploadBinary", (req, res, next) => {
  if (!req.files || Object.keys(req.files).length == 0 || !req.body.username)
    res.status(400).send('Manca immagine o username');
  else {
    let _file = req.files.img as UploadedFile;
    _file.mv('./static/img/' + _file["name"], function (err) {
      if (err)
        res.status(500).json(err.message);
      else{
        // insert del nuovo record nel db
        if (currentCollection) {
          let db = req["client"].db(DB_NAME) as mongodb.Db;
          let collection = db.collection("images");
          let user = {"username": req.body.username, "img": _file.name}
          collection
            .insertOne(user)
            .then((data) => res.send(data))
            .catch((err) => res.status(503).send("QUERY: Syntax error"))
            .finally(() => req["client"].close());
        }
      }
    })
  }

});

/*  ******************************************
    default route e route di gestione degli errori
    ****************************************** */
app.use("/", (err, req, res, next) => {
  console.log("**** ERRORE SERVER ***** " + err); //  da correggere
});

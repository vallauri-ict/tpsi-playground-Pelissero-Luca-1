import express from "express";
import * as fs from "fs";
import * as http from "http";
import * as body_parser from "body-parser";
import * as mongodb from "mongodb";
const fileupload = require('express-fileupload');
import cors from "cors";
import { UploadedFile } from "express-fileupload";


const mongoClient = mongodb.MongoClient;
const CONNECTION_STRING = process.env.MONGODB_URI || "mongodb+srv://edoardo:aba@cluster0.7z0jw.mongodb.net/5B?retryWrites=true&w=majority";
/*const CONNECTION_STRING =
  "mongodb://admin:admin@cluster0-shard-00-00.zarz7.mongodb.net:27017,cluster0-shard-00-01.zarz7.mongodb.net:27017,cluster0-shard-00-02.zarz7.mongodb.net:27017/test?replicaSet=atlas-bgntwo-shard-0&ssl=true&authSource=admin";*/
const DB_NAME = "5B";


let port = parseInt(process.env.PORT) || 1337;
let app = express();

let server = http.createServer(app);

server.listen(port, function () {
  console.log("Server in ascolto sulla porta " + port)

  init();
});

const whitelist = ["http://localhost:4200", "http://localhost:1337"];
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin)
      return callback(null, true);
    if (whitelist.indexOf(origin) === -1) {
      var msg = 'The CORS policy for this site does not ' +
        'allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    else
      return callback(null, true);
  },
  credentials: true
};
app.use("/", cors(corsOptions));

app.use(fileupload({
  "limits ": { "fileSize ": (10 * 1024 * 1024) } // 10 MB
 }));
 


let paginaErrore = "";
function init() {
  fs.readFile("./static/error.html", function (err, data) {
    if (!err) {
      paginaErrore = data.toString();
    }
    else {
      paginaErrore = "<h2>Risorsa non trovata</h2>";
    }
  });
}


//****************************************************************
//elenco delle routes di tipo middleware
//****************************************************************
// 1.log 
app.use("/", function (req, res, next) {
  console.log("---->" + req.method + ":" + req.originalUrl);
  next();
});

// 2.static route
//il next lo fa automaticamente quando non trova la risorsa
app.use("/", express.static("./static"));

// 3.route lettura parametri post
app.use("/", body_parser.json());
app.use("/", body_parser.urlencoded({ "extended": true }));

// 4.log parametri
app.use("/", function (req, res, next) {
  if (Object.keys(req.query).length > 0) {
    console.log("Parametri GET: ", req.query);
  }
  if (Object.keys(req.body).length > 0) {
    console.log("Parametri BODY: ", req.body);
  }
  next();
})


//****************************************************************
//elenco delle routes di risposta al client
//****************************************************************
// middleware di apertura della connessione
app.use("/", (req, res, next) => {
  mongoClient.connect(CONNECTION_STRING, (err, client) => {
    if (err) {
      res.status(503).send("Db connection error");
    } else {
      console.log("Connection made");
      req["client"] = client;//salva il client così evito si aprorla tutte le volte
      next();
    }
  });
});


// listener specifici: 

app.get("/api/images", (req, res, next) => {
  let db = req["client"].db(DB_NAME) as mongodb.Db;
  let collection = db.collection('images');
  let request = collection.find().toArray();
  request.then((data) => {
    res.send(data);
  });
  request.catch((err) => {
    res.status(503).send("Sintax error in the query");
  });
  request.finally(() => {
    req["client"].close();
  });
})

///api/uploadBase64

app.post("/api/uploadBinary", (req, res, next) => {

  if (!req.files  || Object.keys(req.files).length == 0)
    res.status(400).send('No files were uploaded');
  else {
    let _file = req.files.img as UploadedFile;
    _file.mv('./static/img/' + _file["name"], function (err) {
      if (err)
        res.status(500).json(err.message);
      else {
        let db = req["client"].db(DB_NAME) as mongodb.Db;
        let collection = db.collection('images');
        let user ={"username":req.body.username,"img":_file.name}
        let request = collection.insertOne(user)
        request.then((data) => {
          res.send(data);
        });
        request.catch((err) => {
          res.status(503).send("Sintax error in the query");
        });
        request.finally(() => {
          req["client"].close();
        });
      }
    })
  }



  // const getPageTwo = async ( page)=>{    
  //   return await (await fetch(connection_base+page)).json();
  // }

  // const getData = async (page)=>{
  //     const comuni = await getPageTwo(page)
  //     console.log(comuni)
  // }
})


//****************************************************************
//file upload
//****************************************************************
app.use(fileupload({
  "limits ": { "fileSize ": (10 * 1024 * 1024) } // 10 MB
}));


//****************************************************************
//default route(risorse non trovate) e route di gestione degli errori
//****************************************************************
app.use("/", function (err, req, res, next) {
  console.log("***************  ERRORE CODICE SERVER ", err.message, "  *****************");
})




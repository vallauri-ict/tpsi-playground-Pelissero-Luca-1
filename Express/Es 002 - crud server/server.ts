import express from "express";
import * as http from "http";
import * as fs from "fs";
import * as body_parser from "body-parser";
import * as mongodb from "mongodb";
import cors from "cors";

// munga
const mongo_client = mongodb.MongoClient;
const CONNECTIONSTRING = process.env.MONGODB_URI;
const DBNAME = "5B";

const PORT:number = parseInt(process.env.PORT) || 1337;
let app = express();

let server = http.createServer(app);

// questa collback va in esecuzione quando il server ascolta
server.listen(PORT, () => {
    console.log("Server in ascolto sulla porta " + PORT);
    init();
});

let pagina_errore = "";
let init = () => {
    fs.readFile("./static/error.html", (err, data) => {
        if(!err) {
            // data è un buffer, occorre serializzarlo
            pagina_errore = data.toString();
        } else {
            pagina_errore = "<h2>Risorsa non trovata</h2>";
        };
    });
};


const whitelist = ["http://localhost:4200/", "http://localhost:1337/", "https://luca-pelissero-crud-server.herokuapp.com"];
const corsOptions = {
 origin: function(origin, callback) {
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




/* ******************************************************************
                elenco delle route di tipo middleware
   ****************************************************************** */
// 1 - log
app.use("/", (req, res, next) => {
    console.log(" -----> " + req.method + " : " + req.originalUrl);
    next();
});

// 2 - static-route
// .static va a cercare la risorsa all'interno
// della cartella static
app.use("/", express.static("./static"));

// 3 - route di lettura dei parametri post
app.use("/", body_parser.json());
// extend fa in modo che vengano intercettati
// eventuali json all'interno del body
app.use("/", body_parser.urlencoded({ "extended": true }));

// 4 - log dei parametri
app.use("/", (req, res, next) => {
    if(Object.keys(req.query).length) {
        console.log("parametri GET: ", req.query);
    }

    if(Object.keys(req.body).length) {
        console.log("parametri BODY: ", req.body);
    };
    next();
});






/* ******************************************************************
               elenco delle route di risposta al client
   ****************************************************************** */
// middleware di apertura della connessione
app.use("/", (req, res, next) => {
    mongo_client.connect(CONNECTIONSTRING, (err, client) => {
        if (err) {
            res.status(503).send("Errore di connessione al database");
        } else {
            console.log(" >>>>>> CONNESSIONE DB ESEGUITA CORRETTAMENTE");
            req["client"] = client;
            next();
        }
    });
});

// lettura delle collezioni presenti nel db
app.get("/api/getCollections", function (req, res, next) {
    // in req["client"] salviamo il client per le connessioni successive 
    // l' oggetto che gestisce la connessione con mongo
    let db = req["client"].db(DBNAME) as mongodb.Db;

    let request = db.listCollections().toArray();

    request.then((data) => {
        res.send(data);
    });

    request.catch((err) => {
        res.status(503).send("Errore nella query");
    });

    request.finally(() => {
        req["client"].close();
    });
});


// middleware di intercettazione dei parametri
let currentCollection = "";
let id = "";

// il ? rende un parametro facoltativo
app.use("/api/:collection/:id?", function (req, res, next) {
    currentCollection = req.params.collection;
    id = req.params.id;
    next();
});

// [[[Listeners specifici]]]:
app.get("/api/*", function (req, res, next) {
    // in ascolto di qualsiasi richiesta get
    
    let db = req["client"].db(DBNAME) as mongodb.Db;
    let collection = db.collection(currentCollection);
    
    let request;
    if (!id) {
        request = collection.find().toArray();
    } else {
        // va fatto solo nella else in quanto
        // altrimenti, non esistendo id, darebbe
        // errore
        let obj_id = new mongodb.ObjectId(id);
        request = collection.findOne({"_id": obj_id});
    };

    request.then((data) => {
        res.send(data);
    });

    request.catch((err) => {
        res.status(503).send("Errore nella query");
    });

    request.finally(() => {
        req["client"].close();
    });
});

app.post("/api/*",function(req,res,next){
    let db = req["client"].db(DBNAME);
    let collection = db.collection(currentCollection);
 
    let request = collection.insertOne(req["body"]);
    request.then(function(data){
        res.send(data);
    });

    request.catch(function(err){
        res.status(503).send("Errore esecuzione query");
    });

    request.finally(function(){
        req["client"].close();
    });
});

app.patch("/api/*",function(req,res,next){
    let db = req["client"].db(DBNAME);
    let collection = db.collection(currentCollection);
 
    let obj_id = new mongodb.ObjectId(id);

    let request = collection.updateOne({"_id": obj_id}, {"$set": req["body"]});
    request.then(function(data){
        res.send(data);
    });

    request.catch(function(err){
        res.status(503).send("Errore esecuzione query");
    });

    request.finally(function(){
        req["client"].close();
    });
});

app.put("/api/*",function(req,res,next){
    let db = req["client"].db(DBNAME);
    let collection = db.collection(currentCollection);
 
    let obj_id = new mongodb.ObjectId(id);

    let request = collection.replaceOne({"_id": obj_id}, {"$set": req["body"]});
    request.then(function(data){
        res.send(data);
    });

    request.catch(function(err){
        res.status(503).send("Errore esecuzione query");
    });

    request.finally(function(){
        req["client"].close();
    });
});
 
app.delete("/api/*", function (req, res, next) {
    let db = req["client"].db(DBNAME) as mongodb.Db;
    let collection = db.collection(currentCollection);
    
    let obj_id = new mongodb.ObjectId(id);
    let request = collection.deleteOne({"_id": obj_id});

    request.then((data) => {
        res.send(data);
    });

    request.catch((err) => {
        res.status(503).send("Errore nella query");
    });

    request.finally(() => {
        req["client"].close();
    });
});






/* ******************************************************************
   default route (risorsa non trovata) e route di gestione degli errori
   ****************************************************************** */
app.use("/", (req, res, next) => {
    res.status(404);
    if(req.originalUrl.startsWith("/api/")) {
        res.send("Risorsa non trovata");
    } else {
        res.send(pagina_errore);
    };
});










/* ******************************************************************
                    route di gestione degli errori
   ****************************************************************** */
app.use((err, req, res, next) => {
    console.log("Errore codice server: " + err.message);
});
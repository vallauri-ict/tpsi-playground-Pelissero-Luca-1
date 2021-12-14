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
// 5.listener di risposta al client
// route della creazione della connessione
app.use("/", (req, res, next) => {
    mongoClient.connect(CONNECTIONSTRING, (err, client) => {
        if (err) {
            res.status(503).send("DB connection error");
        }
        else {
            console.log("Connessione riuscita");
            req["client"] = client; // creare un nuovo campo di req
            next();
        }
    })
})
app.get("/api/getCollections", (req, res, next) => {
    let db = req["client"].db(DB_NAME) as _mongodb.Db;
    let request = db.listCollections().toArray();
    request.then(function (data) {
        res.send(data);
    })
    request.catch(function (err) {
        res.status(503).send("errore nella sintassi della query")
    })
    request.finally(function () {
        req["client"].close();
    })
})

// 6.listener
app.patch("/api/risorsa2", (req, res, next) => {
    let unicorn = req.query.nome;
    let incVampires = req.body.vampires;
    if (unicorn) {
        let db = req["client"].db(DB_NAME) as _mongodb.Db;
        let collection = db.collection("unicorns");
        let request = collection.updateOne({ name: unicorn }, { $inc: { vampires: incVampires } });
        request.then(function (data) {
            res.send(data);
        })
        request.catch(function (err) {
            res.status(503).send("errore nella sintassi della query")
        })
        request.finally(function () {
            req["client"].close();
        })
    }
    else {
        res.status(400).send("Parametro mancante: UnicornName o incVampires");
        req["client"].close();
    }
})

// 7.listener
app.get("/api/risorsa3/:gender/:hair", (req, res, next) => {
    let gender = req.params.gender;
    let hair = req.params.hair;

    // la if sui paramtri in questo caso non serve perchè se non i sono non entra nella route
    let db = req["client"].db(DB_NAME) as _mongodb.Db;
    let collection = db.collection("unicorns");
    let request = collection.find({ $and: [{ gender: gender }, { hair: hair }] }).toArray();
    request.then(function (data) {
        res.send(data);
    })
    request.catch(function (err) {
        res.status(503).send("errore nella sintassi della query")
    })
    request.finally(function () {
        req["client"].close();
    })
})

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
import express from "express";
import * as http from "http";
import * as fs from "fs";
import * as body_parser from "body-parser";
import HEADERS from "./headers.json";

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
app.get("/api/risorsa1", (req, res, next) => {
    let nome = req.query.nome;
    res.send({ nome: nome });
})

app.post("/api/risorsa1", (req, res, next) => {
    let nome = req.body.nome;
    res.send({ nome: nome });
})

// *********************************************************************
// default route (risorsa non trovata) e routes di gestione degli errori
// *********************************************************************
app.use("/", (req, res, next) => {
    res.status(404)
    if (req.originalUrl.startsWith("/api/")) {
        res.send("Risorsa non trovata");
    }
    else {
        res.send(paginaErrore);
    }
})
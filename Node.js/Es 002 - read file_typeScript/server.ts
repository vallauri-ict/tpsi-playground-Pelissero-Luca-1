"use strict"

import * as _http from "http"
import * as _url from "url"
import * as _fs from "fs"
import * as _mime from "mime"
const HEADERS = require("./headers.json");
const { prototype } = require("events");
const { RSA_NO_PADDING } = require("constants");

const PORT : number = 1337;
let paginaErrore : string;

var server = _http.createServer(function(req, res) {

    // lettura di metodo, risorsa e parametri
    let metodo = req.method;
    let url = _url.parse(req.url, true);
    let risorsa = url.pathname;
    let parametri = url.query;

    console.log(`Richiesta: ${metodo}-${risorsa}, param: ${JSON.stringify(parametri)}`);

    if (risorsa == "/") {
        risorsa = "/index.html";
    }
    if (!risorsa.startsWith("/api/")) { // se è una pagina (un file)
        risorsa = "./static" + risorsa; // vado a prendere la pagina richiesta nella cartella
        // ora leggiamo la risorsa presa prima
        _fs.readFile(risorsa, function(error, data) { // se è anadto tutto bene data contine il contenuto del file
            if (!error) { // se è andato tutto bene
                let header = { "Content-Type": _mime.getType(risorsa) }; // se non funziona getType usare lookUp 
                res.writeHead(200, header);
                res.write(data);
                res.end();
            } else {
                res.writeHead(404, HEADERS.html);
                res.write(paginaErrore);
                res.end();
            }
        })
    } else if (risorsa == "/api/servizio1") {
        // gestione servizio1
        let json = { "ris": "ok" };
        res.writeHead(200, HEADERS.json);
        res.write(JSON.stringify(json));
        res.end();
    } else {
        // in caso il servizio non esiste
        res.writeHead(404, HEADERS.text);
        res.write("Servizio inesistente");
        res.end();
    }

});

server.listen(PORT, function() {
    _fs.readFile("./static/error.html", function(error, data) {
        if (!error) {
            paginaErrore = data.toString();
        } else {
            paginaErrore = "<h1>Pagina non trovata</h1>";
        }
    })
});
console.log("server in esecuzione sulla porta " + PORT);
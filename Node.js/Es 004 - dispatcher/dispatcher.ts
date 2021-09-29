import * as _http from "http";
import * as _url from "url";
import * as _fs from "fs";
import * as _mime from "mime";
import { inherits } from "util";

let HEADERS = require("./headers.json");
let paginaErrore: string;

class Dispatcher {
    prompt: string = ">>>"

    // ogni listener è costituito da un json del tipo { "risorsa": "callback" }
    // i listener sono suddivisi in base al metodo di chiamata
    listeners: any = {
        "Get": {},
        "POST": {},
        "DELETE": {},
        "PUT": {},
        "PATCH": {}
    }

    // costruttore
    constructor() {
        init();
    }

    // verrà richiamato dal main ogni volta che si vorrà aggiungere un listener
    // ES: "GET", "studenti", funzione
    addListener(metodo: string, risorsa: string, callback: any) {
        metodo = metodo.toUpperCase(); // per essere sicuri che il metodo arrivi scritto in maiuscolo
        // per accedere ai metodi o property delle classi bisogna sempre utilizzare il this
        // if (this.listeners[metodo]) {}  è equivalente a quella sotto
        if (metodo in this.listeners) {
            // creo una nuova chiave chiamata risorsa con come valore la callback
            this.listeners[metodo][risorsa] = callback;
        }
        else {
            throw new Error("Metodo non valido"); // genera il mesaggio di errore
        }
    }

    dispatch(req, res) {
        // deve vedere il metodo la risorla ed il parametro
        // lettura di metodo, risorsa e parametri
        let metodo = req.method;
        let url = _url.parse(req.url, true);
        let risorsa = url.pathname;
        let parametri = url.query;

        console.log(`${this.prompt} ${metodo} : ${risorsa} ${JSON.stringify(parametri)}`);

        // guardiamo se è un servizio o una risorsa
        if (risorsa.startsWith("/api/")) {
            if (risorsa in this.listeners[metodo]) {
                let _callback = this.listeners[metodo][risorsa];
                // lancio in esecuzione la callback che abbiamo scritto nel main di addListeners
                _callback(req, res);
            }
            else {
                res.writeHead(404, HEADERS.text);
                res.write("Servizio non trovato");
                res.end();
            }
        }
        else {
            staticListeners(req, res, risorsa);
        }
    }
}

function staticListeners(req, res, risorsa) {
    if (risorsa == "/") {
        risorsa = "/index.html";
    }
    let fileName = "./static" + risorsa;
    _fs.readFile(fileName, function (err, data) {
        if (!err) {
            let header = { "Content-Type": _mime.getType(fileName) };
            res.writeHead(200, header);
            res.write(data);
            res.end();
        }
        else {
            console.log(`   ${err.code} : ${err.message}`);

            // il client si aspetta una pagina
            res.writeHead(404, HEADERS.html);
            res.write(paginaErrore);
            res.end();
        }
    })
}

function init() {
    _fs.readFile("./static/error.html", function (err, data) {
        if (!err) {
            paginaErrore = data.toString();
        }
        else {
            paginaErrore = "<h1>Pagina non trovata</h1>";
        }
    })
}

// esporto l'istanze della classe in forma anonima
module.exports = new Dispatcher();
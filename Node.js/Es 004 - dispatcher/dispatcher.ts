import * as _http from "http";
import * as _url from "url";
import * as _fs from "fs";
import * as _mime from "mime";

let HEADERS = require("headers.json");
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
    constructor(){

    }

    // verrà richiamato dal main ogni volta che si vorrà aggiungere un listener
    // ES: "GET", "studenti", funzione
    addListener(metodo:string, risorsa:string, callback:any){
        metodo = metodo.toUpperCase(); // per essere sicuri che il metodo arrivi scritto in maiuscolo
        // per accedere ai metodi o property delle classi bisogna sempre utilizzare il this
        // if (this.listeners[metodo]) {}  è equivalente a quella sotto
        if (metodo in this.listeners) {
            // creo una nuova chiave chiamata risorsa con come valore la callback
            this.listeners[metodo][risorsa] = callback; 
        }
        else{
            throw new Error("Metodo non valido"); // genera il mesaggio di errore
        }
    }
}
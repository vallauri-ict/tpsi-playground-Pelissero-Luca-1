"use strict"

import * as _http from 'http'
import * as _url from 'url'
import * as _fs from 'fs'
import {Dispatcher} from "./dispatcher"   
let dispatcher = new Dispatcher()

import HEADERS from "./headers.json"
import facts from "./facts.json";

let port:number = 1337;

// tutte le volte che arriva una richgiesta dal client parte questa funzione
let server = _http.createServer(function (req, res) {
    dispatcher.dispatch(req, res);
});
server.listen(port);


/* ********************** */

// const categories = []
const categories = ["career","money","explicit","history","celebrity","dev","fashion","food","movie","music","political","religion","science","sport","animal","travel"]

const icon_url = "https://assets.chucknorris.host/img/avatar/chuck-norris.png";
const api_url = "https://api.chucknorris.io"
const base64Chars = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "-", "_"]

// --------------
dispatcher.addListener("GET", "/api/categories", function (req, res) {
    res.writeHead(200, HEADERS.json);
    res.write(JSON.stringify(categories));
    res.end();
})

dispatcher.addListener("GET", "/api/facts", function (req,res) {
    let vetFacts = [];
    for (const fact of facts.facts) {
        for (let i = 0; i < fact.categories.length; i++) {
            if(fact.categories[i] == req["GET"].categoria){
                vetFacts.push(fact);
            }
        }
    }
    res.writeHead(200, HEADERS.json);
    res.write(JSON.stringify(vetFacts));
    res.end();
})

dispatcher.addListener("POST", "/api/rate", function (req, res) {
    let vetId = req["BODY"].ids;

    for (let i = 0; i < vetId.length; i++) {
        for (const fact of facts.facts) {
            if(fact.id == vetId[i]){
                fact.score = fact.score+1
            }
        }
    }
    _fs.writeFile("./facts.json", JSON.stringify(facts), function (err) {
        if (!err) {
            console.log("OK")
        }
    })
})


dispatcher.addListener("POST", "/api/add", function (req, res) {
    let id = generaId();
    
    let newFact = {
        "categories": [req["BODY"].categoria],
        "created_at": (new Date()).toString(),
        "icon_url": icon_url,
        "id": id,
        "updated_at": (new Date()).toString(),
        "url": api_url,
        "value": req["BODY"].value,
        "score": 0
    }

    facts.facts.push(newFact);
    _fs.writeFile("./facts.json", JSON.stringify(facts), function (err) {
        if (!err) {
            console.log("OK")
            res.writeHead(200, HEADERS.json);
            res.write(JSON.stringify({"ok": true}));
            res.end();
        }
    })
})

function generaId() {
    let id;
    for (let i = 0; i < 22; i++) {
        id+=base64Chars[Math.floor(Math.random() * base64Chars.length-1)]
    }
    for (const fact of facts.facts) {
        if (fact.id == id) {
            generaId();
            break;
        }
    }
    return id;
}
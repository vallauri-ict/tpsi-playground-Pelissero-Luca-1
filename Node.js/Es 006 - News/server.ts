import * as _http from "http"
const _fs = require("fs");
const _mime = require("mime");
import { HEADERS } from "./headers"
import { Dispatcher } from "./dispatcher"
import { notizie } from "./notizie"
import { json } from "stream/consumers";
let port: number = 1337

let dispatcher: Dispatcher = new Dispatcher();

let server = _http.createServer(function (req, res) {
    dispatcher.dispatch(req, res)
})
server.listen(port)
console.log("Server in ascolto sulla porta " + port)

// -------------------------
// Registrazione dei servizi
// -------------------------
dispatcher.addListener("GET", "/api/elenco", function (req, res) {
    res.writeHead(200, HEADERS.json)
    res.write(JSON.stringify(notizie))
    res.end()
})

dispatcher.addListener("POST", "/api/dettagli", function (req, res) {
    let file = "./news/" + req["BODY"].file;
    console.log(file)

    _fs.readFile(file, function (error, data) {
        if (!error) {
            for (let i = 0; i < notizie.length; i++) {
                if (notizie[i].file == req["BODY"].file) {
                    notizie[i].visualizzazioni = notizie[i].visualizzazioni + 1;
                    break;
                }
            }
            let header = { "Content-Type": _mime.getType(file) };
            res.writeHead(200, header);
            res.write(JSON.stringify({ "file": `${data}` }));
            res.end();
        } else {
            res.writeHead(404, HEADERS.text);
            res.write("Notizia non trovata");
            res.end();
        }
    })

})
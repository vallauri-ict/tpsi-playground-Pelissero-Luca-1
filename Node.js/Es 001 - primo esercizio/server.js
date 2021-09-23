const _http = require("http");
const _url = require("url");
const HEADERS = require("./headers.json")
const _colors = require("colors"); // puntatore alla libreria colors
const port = 1337;

// crea il web server e mi restituisce il puntatore
// questa callback viene eseguita tutte le volte che arriva una richiesta dal client
// req -> informazioni della richiesta
// res -> risposta che poi restituirà al client
let server = _http.createServer(function(req, res) {
    /* prima prova
    // 1 - scrivo l'intestazione della risposta
    res.writeHead(200, HEADERS.text);
    // 2 - scrivo il corpo della risposta
    res.write("Richiesta ricevuta correttamente");
    // 3 - invio della risposta
    res.end();
    console.log("Richiesta eseguita");
    */

    // parsing della url ricevuta
    // true -> parsifica anche i parametri

    // lettura di metodo risorsa e parametri
    let metodo = req.method;
    let url = _url.parse(req.url, true);
    let risorsa = url.pathname;
    let parametri = url.query;

    let dominio = req.headers.host;

    res.writeHead(200, HEADERS.html);
    res.write("<h1>Informazioni relative alla richiesta ricevuta</h1>");
    res.write("<br>");
    res.write(`<p><b>Risorsa richiesta:</b> ${risorsa}</p>`);
    res.write(`<p><b>Metodo:</b> ${metodo}</p>`);
    res.write(`<p><b>Parametri:</b> ${JSON.stringify(parametri)}</p>`);
    res.write(`<p><b>Dominio:</b> ${dominio}</p>`);
    res.write(`<p>Grazie per la richiesta</p>`);
    res.end();

    console.log("Richiesta ricevuta: " + req.url.yellow);
});

// se non si specifica l'indirizzo IP di ascolto il server viene avviato su tutte le interfacce
server.listen(port);
console.log("server in ascolto sulla porta " + port);
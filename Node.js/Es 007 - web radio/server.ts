import * as _http from "http";
const _fs = require("fs");
const _mime = require("mime");
import { HEADERS } from "./headers";
import { Dispatcher } from "./dispatcher";
import states from "./states.json";
import radios from "./radios.json";
import { json } from "stream/consumers";
let port: number = 1337;
let jsonStates = states;
let jsonRadios = radios;

let dispatcher: Dispatcher = new Dispatcher();

let server = _http.createServer(function (req, res) {
  dispatcher.dispatch(req, res);
});
server.listen(port);
console.log("Server in ascolto sulla porta " + port);

updateStationCount();

// -------------------------
// Registrazione dei servizi
// -------------------------

function updateStationCount() {
  let stationcount = 0;

  for (const state of jsonStates) {
    for (const radio of radios) {
      if (state.value == radio.state) {
        stationcount++;
      }
    }
    state.stationcount = stationcount.toString();
    stationcount = 0;
  }
  _fs.writeFile(
    "./states2.json",
    JSON.stringify(jsonStates, null, 2),
    function (err) {
      if (!err) {
        console.log("succes");
      }
    }
  );
}

dispatcher.addListener("GET", "/api/elenco", function (req, res) {
  let vetState = [];
  for (const state of states) {
    vetState.push(state.name + "-" + state.stationcount);
  }
  vetState.sort();
  res.writeHead(200, HEADERS.json);
  res.write(JSON.stringify(vetState));
  res.end();
});

dispatcher.addListener("POST", "/api/radios", function (req, res) {
  let region = req["BODY"].region;
  let vetRadios = [];
  for (const radio of jsonRadios) {
    if (radio.state == region) {
      vetRadios.push(radio);
    }
  }
  res.writeHead(200, HEADERS.json);
  res.write(JSON.stringify(vetRadios));
  res.end();
});

dispatcher.addListener("POST", "/api/like", function (req, res) {
  for (const radio of jsonRadios) {
    if (radio.id == req["BODY"].idRadio) {
      radio.votes = (parseInt(radio.votes)+1).toString();
    }
  }
  
  res.writeHead(200, HEADERS.json);
  res.write(JSON.stringify(jsonRadios));
  res.end();
});

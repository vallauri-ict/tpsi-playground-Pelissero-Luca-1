"use strict";
import http from 'http';
import colors from 'colors';
import fs from "fs";
import body_parser from "body-parser";
import * as mongodb from "mongodb";
import fileUpload, { UploadedFile } from "express-fileupload";
import ENVIRONMENT from "./enviroment.json";

import express from "express";
const app = express();
const httpServer = http.createServer(app);

import { Server, Socket } from 'socket.io'; // import solo l‟oggetto Server
import { json } from 'body-parser';
import { userInfo } from 'os';
const io = new Server(httpServer);

const mongoClient = mongodb.MongoClient;
const DB_NAME = "5B";

const PORT = 1337

/************** HTTP ********* */
//**********************
//elenco delle routes di tipo middleware
//**********************
httpServer.listen(PORT, function () {
	console.log("Server in ascolto sulla porta " + PORT)
	init();
});

let paginaErrore = "";
function init() {
	fs.readFile("./static/error.html", function (err, data) {
		if (!err) {
			paginaErrore = data.toString();
		}
		else {
			paginaErrore = "<h2>Risorsa non trovata</h2>";
		}
	});
}

// 1.log 
app.use("/", function (req, res, next) {
	console.log("---->" + req.method + ":" + req.originalUrl);
	next();
});

// 2.static route
//il next lo fa automaticamente quando non trova la risorsa
app.use("/", express.static("./static"));

// 3.route lettura parametri post con impostazione del limite immagini base64
app.use("/", body_parser.json({ "limit": "10mb" }));
app.use("/", body_parser.urlencoded({ "extended": true, "limit": "10mb" }));

// 4.log parametri
app.use("/", function (req, res, next) {
	if (Object.keys(req.query).length > 0) {
		console.log("Parametri GET: ", req.query);
	}
	if (Object.keys(req.body).length > 0) {
		console.log("Parametri BODY: ", req.body);
	}
	next();
})

// 5. binary fileUpload
app.use(fileUpload({
	"limits ": { "fileSize ": (10 * 1024 * 1024) } // 10 MB
}));


//elenco delle routes di risposta al client
// middleware di apertura della connessione
app.use("/", (req, res, next) => {
	mongoClient.connect(process.env.MONGODB_URI || ENVIRONMENT.CONNECTION_STRING, (err, client) => {
		if (err) {
			res.status(503).send("Db connection error");
		} else {
			console.log("Connection made");
			req["client"] = client;
			next();
		}
	});
});

// listener specifici: 
//listener GET
app.get("/api/images", (req, res, next) => {
	let db = req["client"].db(DB_NAME) as mongodb.Db;
	let collection = db.collection("images");
	let request = collection.find().toArray();
	request.then((data) => {
		res.send(data);
	});
	request.catch((err) => {
		res.status(503).send("Sintax error in the query");
	});
	request.finally(() => {
		req["client"].close();
	});
})

app.post("/api/uploadImage", (req, res, next) => {

})

/*********** gestione web socket ********* */
let users = [];

/* in corrispondenza della connessione di un client,
  per ogni utente viene generato un evento 'connection' a cui
  viene inettato il 'clientSocket' contenente IP e PORT del client.
  Per ogni utente la funzione di callback crea una variabile locale
  'user' contenente tutte le informazioni relative al singolo utente  */

io.on('connection', function (clientSocket) {
	//user corrente
	let user = {} as { username: string, socket: Socket, room: string };

	// 1) ricezione username
	clientSocket.on('login', function (userInfo) {
		userInfo = JSON.parse(userInfo);
		// controllo se user esiste già
		let item = users.find(function (item) {
			return (item.username == userInfo.username)
		})
		if (item != null) {
			clientSocket.emit("loginAck", "NOK")
		}
		else {
			user.username = userInfo.username;
			user.room = userInfo.room;
			user.socket = clientSocket;
			users.push(user);
			clientSocket.emit("loginAck", "OK")
			log('User ' + colors.yellow(user.username) +
				" (sockID=" + user.socket.id + ') connected!');
			//inserisco username nella stanza richiesta 
			this.join(user.room);
		}
	});

	// 2) ricezione di un messaggio	 
	clientSocket.on('message', function (msg) {
		if (msg.startsWith("data:image")) 
		{
			let response = {
				'from': user.username,
				"message" : "",
				"img": msg,
				"icon" : "",
				'date': new Date()
			}
			io.to(user.room).emit('message_notify', JSON.stringify(response));	
		}
		else {
			log('User ' + colors.yellow(user.username) +
				" (sockID=" + user.socket.id + ') sent ' + colors.green(msg))
			// notifico a tutti i socket (mittente compreso) il messaggio ricevuto 

			mongoClient.connect(process.env.MONGODB_URI || ENVIRONMENT.CONNECTION_STRING, (err, client) => {
				if (!err) {
					let db = client.db(DB_NAME) as mongodb.Db;
					let collection = db.collection("images");
					let request = collection.findOne({ "username": user.username });
					request.then((data) => {
						if (data != null) {
							let icon = data.img;

							let response = {
								'from': user.username,
								'message': msg,
								"img" : "",
								"icon": icon,
								'date': new Date()
							}
							io.to(user.room).emit('message_notify', JSON.stringify(response));
						}
						else {
							let response = {
								'from': user.username,
								'message': msg,
								"img" : "",
								"icon": "",
								'date': new Date()
							}
							io.to(user.room).emit('message_notify', JSON.stringify(response));
						}
					});
					request.catch((err) => {
						//vuoto
					});
					request.finally(() => {
						client.close();
					});
				}
			});
		}
	});

	// 3) disconnessione dell'utente
	clientSocket.on('disconnect', function () {
		// ritorna -1 se non lo trova
		let index = users.findIndex(function (item) {
			return (item.username == user.username)
		})
		users.splice(index, 1)
		log(' User ' + user.username + ' disconnected!');
	});
});

// stampa i log con data e ora
function log(msg) {
	console.log(colors.cyan("[" + new Date().toLocaleTimeString() + "]") + ": " + msg)
}
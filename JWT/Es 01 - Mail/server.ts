"use strict"

// ***************************** Librerie *************************************
import fs from "fs";
import http from "http";
import https from "https";
import express from "express";
import body_parser from "body-parser";
import cors from "cors";
import fileUpload, { UploadedFile } from "express-fileupload";
import cloudinary, { UploadApiResponse } from "cloudinary";
import {MongoClient, ObjectId}  from "mongodb";
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import environment from "./environment.json"

// ***************************** Costanti *************************************
const app = express();
const CONNECTION_STRING = environment.CONNECTION_STRING_LOCAL
const DBNAME = "mail"
const DURATA_TOKEN = 120 // sec
const HTTP_PORT = 1337
const HTTPS_PORT = 1338
const privateKey = fs.readFileSync("keys/privateKey.pem", "utf8");
const certificate = fs.readFileSync("keys/certificate.crt", "utf8");
const credentials = { "key": privateKey, "cert": certificate };
cloudinary.v2.config({
	cloud_name: environment.cloudinary.CLOUD_NAME,
	api_key: environment.cloudinary.API_KEY,
	api_secret: environment.cloudinary.API_SECRET,
})



// ***************************** Avvio ****************************************
const httpsServer = https.createServer(credentials, app);
httpsServer.listen(HTTPS_PORT, function() {
    console.log("Server HTTPS in ascolto sulla porta " + HTTPS_PORT);
    init();
});
let paginaErrore = "";
function init() {
    fs.readFile("./static/error.html", function(err, data) {
        if (!err)
            paginaErrore = data.toString();
        else
            paginaErrore = "<h1>Risorsa non trovata</h1>"
    });
}
// app.response.log = function(err){console.log(`*** Error *** ${err.message}`)}
app.response["log"] = function(err){console.log(`*** Error *** ${err.message}`)}



/* *********************** (Sezione 1) Middleware ********************* */
// 1. Request log
app.use("/", function(req, res, next) {
    console.log("** " + req.method + " ** : " + req.originalUrl);
    next();
});


// 2 - route risorse statiche
app.use("/", express.static('./static'));


// 3 - routes di lettura dei parametri post
app.use("/", body_parser.json({ "limit": "10mb" }));
app.use("/", body_parser.urlencoded({"extended": true, "limit": "10mb"}));


// 4 - log dei parametri 
app.use("/", function(req, res, next) {
    if (Object.keys(req.query).length > 0)
        console.log("        Parametri GET: ", req.query)
    if (Object.keys(req.body).length != 0)
        console.log("        Parametri BODY: ", req.body)
    next();
});


// 5. cors accepting every call
const corsOptions = {
    origin: function(origin, callback) {
          return callback(null, true);
    },
    credentials: true
};
app.use("/", cors(corsOptions));


// 6 - binary upload
app.use("/", fileUpload({
    "limits": { "fileSize": (10 * 1024 * 1024) } // 10*1024*1024 // 10 M
}));



/* ***************** (Sezione 2) middleware relativi a JWT ****************** */





/* ********************** (Sezione 3) USER ROUTES  ************************** */




/* ***************** (Sezione 4) DEFAULT ROUTE and ERRORS ******************* */
// gestione degli errori
app.use(function(err, req, res, next) {
    console.log(err.stack); // stack completo    
});

// default route
app.use('/', function(req, res, next) {
    res.status(404)
    if (req.originalUrl.startsWith("/api/")) {
        res.send("Risorsa non trovata");
    }
	else res.send(paginaErrore);
});
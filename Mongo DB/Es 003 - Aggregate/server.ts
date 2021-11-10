import * as _http from "http";
import * as _mongodb from "mongodb";
import HEADERS from "./headers.json";

const mongoClient = _mongodb.MongoClient;
const CONNECTIONSTRING = "mongodb://127.0.0.1:27017";
const DB_NAME = "5B";


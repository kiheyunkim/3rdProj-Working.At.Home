import "@babel/polyfill";
import dotenv from "dotenv";
dotenv.config();

import app from "./app";

const PORT = process.env.PORT;

var fs = require('fs');
var http = require('http');
var https = require('https');
var privateKey  = fs.readFileSync('./sslcert/private.key', 'utf8');
var certificate = fs.readFileSync('./sslcert/private.crt', 'utf8');

var credentials = {key: privateKey, cert: certificate};
//const serverListening = () => {
//  console.log(`${PORT} Server ready...✅`);
//};

var httpServer = http.createServer(app);
var httpsServer = https.createServer(credentials, app);

httpServer.listen(8080);
httpsServer.listen(8443);
//app.listen(PORT, serverListening);

//import "./mongoDB";

//import "./models/Video";
//import "./models/Comment";
//import "./models/User";
/* Import node's http module: */
var mysql = require("mysql");
var http = require("http");
var handler = require('./request-handler.js');
var url = require('url');

/* This is the callback function that will be called each time a
 * client (i.e.. a web browser) makes a request to our server. */

var port = 8080;
var ip = "127.0.0.1";
var server = http.createServer(handler.requestRouter);
console.log("Listening on http://" + ip + ":" + port);
server.listen(port, ip);

var connection = exports.connection = mysql.createConnection({
  user: "root",
  database: "chat"
});

connection.connect();

// connection.end();












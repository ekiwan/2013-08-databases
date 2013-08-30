var url = require('url');
var http = require("http");
var _ = require('underscore');
var fs = require('fs');
var mysql = require('mysql');
var db = require('./basic-server.js');

var insertData = function(username, room, message, createdAt) {
  console.log('were in insert messages');
  // db.connection.connect();
  db.connection.query("INSERT INTO messages SET username = ?, room = ?, body = ?, createdAt = ?",
   [username, room, message, createdAt]);
  db.connection.query("INSERT IGNORE INTO users SET username = ?",
    [username]);
};

var responseHeaders = {
    "access-control-allow-origin": "*",
    "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
    "access-control-allow-headers": "content-type, accept",
    "access-control-max-age": 10 // Seconds.
};

var write = function(data, response, responseHeaders) {
  var dataString = data.toString();
  response.writeHead(200, responseHeaders);
  response.write(dataString);
  response.end();
};

var sendIndex = function(response) {
  fs.readFile('../index.html', function(err, data) {
    if (err) {
      throw new Error('oh nose! </3');
    }

    responseHeaders['Content-Type'] = 'text/html';
    write(data, response, responseHeaders);
  });
};

var sendRemaining = function(path, response) {
  if (path.indexOf('.css') !== -1) {
    fs.readFile(__dirname + '/..' + path, function(err, data) {
      responseHeaders['Content-Type'] = 'text/css';
      console.log("serving css");
      write(data, response, responseHeaders);
    });
  } else {
    fs.readFile(__dirname + '/..' + path, function(err, data) {
      console.log('serving js');
      responseHeaders['Content-Type'] = 'text/javscript';
      write(data, response, responseHeaders);
    });
  }
};

var routes = [
  [function(path){return path === '/';}, sendIndex(response)],
  [function(path){return path.indexOf('static') !== -1;}, sendRemaining(urlObj.path, response)],
  [function(path){return path === '/';}, sendIndex(response)],
  [function(path){return path === '/';}, sendIndex(response)]
];

exports.requestRouter = function (request, response) {
  var urlObj = url.parse(request.url);

  // if (urlObj.path === '/') {
  //   sendIndex(response);

  // } else if (urlObj.path.indexOf('static') !== -1 ) {
  //   console.log('in the static route');
  //   sendRemaining(urlObj.path, response);

  } else if (urlObj.path === '/1/classes/messages') {
    console.log('were at the path router');

    if (request.method === 'OPTIONS') {
      console.log('were at the options check');
      response.writeHead(200, responseHeaders);
      response.end();
    }

    if (request.method === 'POST') {
      console.log('were at the post request');
      exports.messageHandler(request, response);
    }

    if (request.method === 'GET') {
      exports.sendMessageHandler(request, response);
    }
  } else {
    response.writeHead(404);
    response.end();
  }
};

exports.messageHandler = function(request, response) {
  console.log('were in the message handler');
  response.writeHead(201, responseHeaders);

  request.on('data', function(data) {
    var messageData = JSON.parse(data.toString());
    console.log(messageData.message);
    insertData(messageData.username, 'room1', messageData.text, new Date());
  });

  request.on('end', function() {
    response.end();
  });
};

exports.sendMessageHandler = function(request, response) {

  responseHeaders['Content-Type'] = 'application/json';
  response.writeHead(200, responseHeaders);
  var resObj = { results:[] };
  db.connection.query('SELECT * FROM messages', function(err, results, fields) {
     console.log(results);
    _(results).each(function(messageData) {
      resObj.results.push(JSON.stringify(messageData));
    });
    response.write(JSON.stringify(resObj));
    response.end();
  });
  };
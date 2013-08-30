var url = require('url');
var http = require("http");
var _ = require('underscore');
var fs = require('fs');
var mysql = require('mysql');
var db = require('./basic-server.js');

var insertMessage = function(username, room, message, createdAt) {
  console.log('were in insert messages');
  // db.connection.connect();
  db.connection.query("INSERT INTO messages SET username = ?, room = ?, body = ?, createdAt = ?",
   [username, room, message, createdAt]);
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
      write(data, response, responseHeaders);
    });
  } else {
    fs.readFile(__dirname + '/..' + path, function(err, data) {
      responseHeaders['Content-Type'] = 'text/javscript';
      write(data, response, responseHeaders);
    });
  }
};

exports.requestRouter = function (request, response) {
  var urlObj = url.parse(request.url);

  if (urlObj.path === '/') {
    sendIndex(response);

  } else if (urlObj.path.indexOf('static') !== -1 ) {
    sendRemaining(urlObj.path, response);

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
    insertMessage(messageData.username, 'room1', messageData.message, new Date());
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
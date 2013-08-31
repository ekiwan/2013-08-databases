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

var sendIndex = function(request, response, path) {
  fs.readFile('../index.html', function(err, data) {
    if (err) {
      throw new Error('oh nose! </3');
    }

    responseHeaders['Content-Type'] = 'text/html';
    write(data, response, responseHeaders);
  });
};

var sendRemaining = function(request, response, path) {
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

exports.optionsResponse = function(request, response, path) {
  response.writehead(200, headers);
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

var routes = {
  GET: [
    [function(path){return path === '/';}, sendIndex],
    [function(path){return path.indexOf('static') !== -1;}, sendRemaining],
    [function(path){return path === '/1/classes/messages';}, exports.sendMessageHandler]
  ],
  POST: [
    [function(path){return path === '/1/classes/messages';}, exports.messageHandler]
  ],
  OPTIONS: [
    [function(path){return path === '/1/classes/messages';}, exports.optionsResponse]
  ]
};

exports.requestRouter = function (request, response) {
  var urlObj = url.parse(request.url);
  switch (request.method) {
    case 'GET':
      _.each(routes.GET, function(pair) {
        if (pair[0](urlObj.path)) {pair[1](request, response, urlObj.path);}
      });
      break;
    case 'POST':
      _.each(routes.POST, function(pair) {
        if (pair[0](urlObj.path)) {pair[1](request, response);}
      });
      break;
    case 'OPTIONS':
      _.each(routes.OPTIONS, function(pair) {
        if (pair[0](urlObj.path)) {pair[1](request, response);}
      });
      break;
    default:
      response.writeHead(404);
      response.end();
  }

};




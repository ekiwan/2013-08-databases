var Sequelize = require("sequelize");
var headers = require('../chat_server/src/request-handler.js');
var db = require('../chat_server/src/basic-server.js');
var _ = require('underscore');

exports.insertData = function(username, room, message) {
  console.log('were in insert messages');
  Messages.create({username: username, room: room, message: message}).success(function(message){
    console.log("new message = " + message);
  });
  Users.create({username: username}).success(function(username) {
    console.log("new user " + username + " created");
  });
  // db.connection.connect();
  // db.connection.query("INSERT INTO messages SET username = ?, room = ?, body = ?, createdAt = ?",
  //  [username, room, message, createdAt]);
  // db.connection.query("INSERT IGNORE INTO users SET username = ?",
  //   [username]);
};

// exports.sendMessageHandler = function(request, response) {

//   headers.responseHeaders['Content-Type'] = 'application/json';
//   response.writeHead(200, headers.responseHeaders);
//   var resObj = { results:[] };
//   db.connection.query('SELECT * FROM messages', function(err, results, fields) {
//     _(results).each(function(messageData) {
//       resObj.results.push(JSON.stringify(messageData));
//     });
//     response.write(JSON.stringify(resObj));
//     response.end();
//   });
//   };

// exports.addFriend = function(request, response) {
//   username1 = 'blakelie';
//   var username5;
//   response.writeHead(201, headers.responseHeaders);
//   request.on('data', function(data) {
//     dataObj = JSON.parse(data.toString());
//     username5 = dataObj.name;
//     console.log(username5);
//   });
//   request.on('end', function(err, data) {
//     db.connection.query("INSERT INTO userfriends SET username1 = ?, username2 = ?",
//       [username1, username5]);
//     response.end();
//   });
// };Ï


var sequelize = new Sequelize("chat", "root");
/* TODO this constructor takes the database name, username, then password.
 * Modify the arguments if you need to */

/* first define the data structure by giving property names and datatypes
 * See http://sequelizejs.com for other datatypes you can use besides STRING. */
var Users = sequelize.define('users', {
  username: {type: Sequelize.STRING(15), primaryKey: true, unique: true}
});

var Messages = sequelize.define('messages', {
  //M_id: {type: Sequelize.INTEGER, autoIncrement: true},
  username: Sequelize.STRING(15),
  room: Sequelize.STRING(25),
  body: Sequelize.TEXT
});

Users.hasMany(Users, {as: 'friends'});

// Sequelize.migration.addIndex('Messages', ['username'], {indicesType: 'UNIQUE'});

/* .sync() makes Sequelize create the database table for us if it doesn't
 *  exist already: */
Users.sync().success(function() {
  /* This callback function is called once sync succeeds. */

  // now instantiate an object and save it:
  var newUser = Users.build({username: "Jean Valjean"});
  newUser.save().success(function() {

    /* This callback function is called once saving succeeds. */

    // Retrieve objects from the database:
    Users.findAll({ where: {username: "Jean Valjean"} }).success(function(usrs) {
      // This function is called back with an array of matches.
      for (var i = 0; i < usrs.length; i++) {
        console.log(usrs[i].username + " exists");
      }
    });
  });
});
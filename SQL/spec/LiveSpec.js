// /* You'll need to have MySQL running and your Node server running
//  * for these tests to pass. */

// var mysql = require('mysql');
// var request = require("request"); // You might need to npm install the request module!

// describe("Persistent Node Chat Server", function() {
//   var dbConnection;

//   beforeEach(function() {
//     dbConnection = mysql.createConnection({
//     /*Fill this out with your mysql username */
//       user: "root",
//       database: "chat"
//     });
//     dbConnection.connect();

//     var tablename = "messages"; //fill this out

//     /* Empty the db table before each test so that multiple tests
//      * (or repeated runs of the tests) won't screw each other up: */
//     dbConnection.query("DELETE FROM " + tablename);
//   });

//   afterEach(function() {
//     dbConnection.end();
//   });

//   xit("Should insert posted messages to the DB", function(done) {
//     // Post a message to the node chat server:
//     request({method: "POST",
//              url: "http://127.0.0.1:8080/1/classes/messages",
//              json: {
//                 username: "Valjean",
//                 message: "In mercy's name, three days is all I need."
//              }
//             },
//             function(error, response, body) {
//               /* Now if we look in the database, we should find the
//                * posted message there. */

//               var queryString = "SELECT * from messages";
//               var queryArgs = [];
//               /* Change the above queryString & queryArgs to match your schema design
//                * The exact query string and query args to use
//                * here depend on the schema you design, so I'll leave
//                * them up to you. */
//               dbConnection.query( queryString,
//                 function(err, results, fields) {
//                   // Should have one result:
//                   expect(results.length).toEqual(1);
//                   expect(results[0].username).toEqual("Valjean");
//                   expect(results[0].body).toEqual("In mercy's name, three days is all I need.");
//                   /* You will need to change these tests if the
//                    * column names in your schema are different from
//                    * mine! */

//                   done();
//                 });
//             });
//   });

//   it("Should output all messages from the DB", function(done) {
//     // Let's insert a message into the db
//     var queryArgs = ["Javert", 'lesMisLuvas', "Men like you can never change!", new Date()];
//     var queryString = "INSERT INTO messages SET username=?, room = ?, body = ?, createdAt = ?";
//     /* The exact query string and query args to use
//      * here depend on the schema you design, so I'll leave
//      * them up to you. */

//     dbConnection.query( queryString, queryArgs,
//       function(err, results, fields) {
//         /* Now query the Node chat server and see if it returns
//          * the message we just inserted: */
//         request("http://127.0.0.1:8080/1/classes/messages",
//           function(error, response, body) {
//             var messageLog = JSON.parse(body);
//             console.log(messageLog);
//             var message = JSON.parse(messageLog.results[0]);
//             console.log(message);
//             expect(message.username).toEqual("Javert");
//             expect(message.body).toEqual("Men like you can never change!");
//             done();
//           });
//       });
//   });
// });

let MongoClient = require('mongodb').MongoClient;
let url = "mongodb://localhost:27017/";
let dbName = "kanban";
db = null;

MongoClient.connect(url, function(err, dbm) {
    if (err) throw err;
    db = dbm.db(dbName);
    console.log("db running");
  });

module.exports = db;
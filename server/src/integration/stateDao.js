db = require("./database.js");


module.exports = {
    
        readAll: () => db.collection("state").find({}).toArray()
}
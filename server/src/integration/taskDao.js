db = require("./database.js");
ObjectID = require('mongodb').ObjectID


module.exports = {

    readAll: ()=> db.collection("task").find().toArray(),

    read: (idTask,idKanban) => db.collection("task").findOne({_id:new ObjectID(idTask)}),

    update: (newTask) => db.collection("task").updateOne({_id:newTask._id},{$set:newTask}),

    create: (newTask) =>db.collection("task").insertOne(newTask).then(res=>res.insertedId)
}

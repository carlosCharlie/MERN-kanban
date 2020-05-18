const State = require("./logic/state.js");
const Task = require("./logic/task.js");

const express = require("express");
const path = require("path");
const app = express();
const port = 3000;

app.use(express.static(path.join(__dirname,"..","..","client","public")));

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname,"..","..","client","public","index.html"));
  });
  
app.get('/states', function(req,res){
  State.getStates()
  .then(s => res.json(s));
});

app.get("/tasks",function(req,res){
  Task.getTasks()
  .then(t => res.json(t));
})

app.use(express.json());

app.put("/moveTask", function(req,res){
  Task.moveTask(req.body.idTask,req.body.newState)
  .then(()=>res.sendStatus(200))
  .catch(()=>res.sendStatus(500));
})

app.put("/newTask", function(req,res){
  Task.addTask(req.body.newTask)
  .then((id)=>res.send(id))
  .catch(()=>res.sendStatus(500))
})

app.listen(port,()=>console.log("running on port "+port));
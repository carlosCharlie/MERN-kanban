const TaskDao = require("../integration/taskDao");

module.exports = {
    
    getTasks: () => TaskDao.readAll(),

    moveTask: (idTask,newState) =>{
        return TaskDao.read(idTask)
            .then((t)=>{
                t.state = newState;
                return TaskDao.update(t);
            })
    },

    addTask: (newTask) => {
        newTask.color = (newTask.color==undefined || newTask.color==null) ? "black":newTask.color;
        return TaskDao.create(newTask);
    }
}
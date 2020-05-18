let tasks = [];

//--------------TAKS----------
class AddTask extends React.Component{
  render(){
    return <div className="AddTask" onClick={this.props.addTask}>
      <h5>+ Add task</h5>
    </div>
  }
}

class Task extends React.Component{
  constructor(props){
    super(props);
  }

  drag = event => event.dataTransfer.setData("text", this.props.id);

  render(){
    return <div id={this.props.id} className="Task" draggable="true" onDragStart={this.drag} onDragEnd={this.props.updateOldParent}>
      {this.props.description==""? <input type="text" name="" id="" onBlur={()=>this.props.changeDescription(this.props.id,event.target.value)}/> : <h3>{this.props.description}</h3>}
    </div>
  }
}


//------------STATES-----------
class AddState extends React.Component{
  render(){
    return <div className="AddState">
      <h2>Add column</h2>
      <img src="res/add.png"/>
    </div>
  }
}
class State extends React.Component{
  
  constructor(props){
    super(props);
    this.state = {
      tasks: tasks.filter(t=>t.state==props.id)
    }
  }

  changeDescription = (idTask,description)=>{
    let index = tasks.findIndex(t=>t._id==idTask);
    tasks[index].description = description;

    fetch("/newTask", {
      method: 'PUT',
      body: JSON.stringify({newTask:{description,state:this.props.id}}),
      headers:{'Content-Type': 'application/json'}
    })
    .then(res=>res.json())
    .then(id=>{
      tasks[index]._id = id;
      this.updateTasks();
    })
  }

  updateTasks = () => this.setState({tasks:tasks.filter(t => t.state==this.props.id)})

  addTask = () => {
    tasks.push({_id:"tmp_id_"+tasks.length,description:"",state:this.props.id});
    this.updateTasks();
  }

  onDrop = event => {
    
    let idTask = event.dataTransfer.getData("Text");

    fetch("/moveTask", {
      method: 'PUT',
      body: JSON.stringify({idTask:idTask,newState:this.props.id}),
      headers:{'Content-Type': 'application/json'}
    })

    let index = tasks.findIndex(t=>t._id==idTask);
    tasks[index].state = this.props.id;
    this.updateTasks();
  }

  render(){
    return <div className="State" onDragOver={(ev)=>ev.preventDefault()} onDrop={this.onDrop} onDragLeave={this.updateTasks}>
      
      <h2>{this.props.title}</h2>
      <AddTask addTask = {this.addTask}/>

      {this.state.tasks.map(t => 
          <Task
            id={t._id} 
            key={t._id} 
            description={t.description} 
            color={t.color}
            updateOldParent = {this.updateTasks}
            changeDescription = {this.changeDescription}
          />
        )
      }

    </div>
  }
}




//------KANBAN--------
class Kanban extends React.Component {

  constructor(props){
    super(props);
  }

  render() {
    
    return <div className="Kanban">
      
      {this.props.states.map(s => 
        <State 
          id={s._id} 
          key={s._id} 
          title={s.name} 
        />)}
      
      <AddState/>
    </div>
  }
}



//-----------INIT------------
let getTasks = fetch("/tasks").then(r=>r.json());
let getStates = fetch("/states").then(r=>r.json());

Promise.all([getStates,getTasks])
.then(results=>{
  console.log(results);
  tasks = results[1];
  ReactDOM.render(<Kanban states={results[0]}/>,document.getElementById('Main'));
})

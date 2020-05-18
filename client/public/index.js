var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var tasks = [];

//--------------TAKS----------

var AddTask = function (_React$Component) {
  _inherits(AddTask, _React$Component);

  function AddTask() {
    _classCallCheck(this, AddTask);

    return _possibleConstructorReturn(this, (AddTask.__proto__ || Object.getPrototypeOf(AddTask)).apply(this, arguments));
  }

  _createClass(AddTask, [{
    key: "render",
    value: function render() {
      return React.createElement(
        "div",
        { className: "AddTask", onClick: this.props.addTask },
        React.createElement(
          "h5",
          null,
          "+ Add task"
        )
      );
    }
  }]);

  return AddTask;
}(React.Component);

var Task = function (_React$Component2) {
  _inherits(Task, _React$Component2);

  function Task(props) {
    _classCallCheck(this, Task);

    var _this2 = _possibleConstructorReturn(this, (Task.__proto__ || Object.getPrototypeOf(Task)).call(this, props));

    _this2.drag = function (event) {
      return event.dataTransfer.setData("text", _this2.props.id);
    };

    return _this2;
  }

  _createClass(Task, [{
    key: "render",
    value: function render() {
      var _this3 = this;

      return React.createElement(
        "div",
        { id: this.props.id, className: "Task", draggable: "true", onDragStart: this.drag, onDragEnd: this.props.updateOldParent },
        this.props.description == "" ? React.createElement("input", { type: "text", name: "", id: "", onBlur: function onBlur() {
            return _this3.props.changeDescription(_this3.props.id, event.target.value);
          } }) : React.createElement(
          "h3",
          null,
          this.props.description
        )
      );
    }
  }]);

  return Task;
}(React.Component);

//------------STATES-----------


var AddState = function (_React$Component3) {
  _inherits(AddState, _React$Component3);

  function AddState() {
    _classCallCheck(this, AddState);

    return _possibleConstructorReturn(this, (AddState.__proto__ || Object.getPrototypeOf(AddState)).apply(this, arguments));
  }

  _createClass(AddState, [{
    key: "render",
    value: function render() {
      return React.createElement(
        "div",
        { className: "AddState" },
        React.createElement(
          "h2",
          null,
          "Add column"
        ),
        React.createElement("img", { src: "res/add.png" })
      );
    }
  }]);

  return AddState;
}(React.Component);

var State = function (_React$Component4) {
  _inherits(State, _React$Component4);

  function State(props) {
    _classCallCheck(this, State);

    var _this5 = _possibleConstructorReturn(this, (State.__proto__ || Object.getPrototypeOf(State)).call(this, props));

    _this5.changeDescription = function (idTask, description) {
      var index = tasks.findIndex(function (t) {
        return t._id == idTask;
      });
      tasks[index].description = description;

      fetch("/newTask", {
        method: 'PUT',
        body: JSON.stringify({ newTask: { description: description, state: _this5.props.id } }),
        headers: { 'Content-Type': 'application/json' }
      }).then(function (res) {
        return res.json();
      }).then(function (id) {
        tasks[index]._id = id;
        _this5.updateTasks();
      });
    };

    _this5.updateTasks = function () {
      return _this5.setState({ tasks: tasks.filter(function (t) {
          return t.state == _this5.props.id;
        }) });
    };

    _this5.addTask = function () {
      tasks.push({ _id: "tmp_id_" + tasks.length, description: "", state: _this5.props.id });
      _this5.updateTasks();
    };

    _this5.onDrop = function (event) {

      var idTask = event.dataTransfer.getData("Text");

      fetch("/moveTask", {
        method: 'PUT',
        body: JSON.stringify({ idTask: idTask, newState: _this5.props.id }),
        headers: { 'Content-Type': 'application/json' }
      });

      var index = tasks.findIndex(function (t) {
        return t._id == idTask;
      });
      tasks[index].state = _this5.props.id;
      _this5.updateTasks();
    };

    _this5.state = {
      tasks: tasks.filter(function (t) {
        return t.state == props.id;
      })
    };
    return _this5;
  }

  _createClass(State, [{
    key: "render",
    value: function render() {
      var _this6 = this;

      return React.createElement(
        "div",
        { className: "State", onDragOver: function onDragOver(ev) {
            return ev.preventDefault();
          }, onDrop: this.onDrop, onDragLeave: this.updateTasks },
        React.createElement(
          "h2",
          null,
          this.props.title
        ),
        React.createElement(AddTask, { addTask: this.addTask }),
        this.state.tasks.map(function (t) {
          return React.createElement(Task, {
            id: t._id,
            key: t._id,
            description: t.description,
            color: t.color,
            updateOldParent: _this6.updateTasks,
            changeDescription: _this6.changeDescription
          });
        })
      );
    }
  }]);

  return State;
}(React.Component);

//------KANBAN--------


var Kanban = function (_React$Component5) {
  _inherits(Kanban, _React$Component5);

  function Kanban(props) {
    _classCallCheck(this, Kanban);

    return _possibleConstructorReturn(this, (Kanban.__proto__ || Object.getPrototypeOf(Kanban)).call(this, props));
  }

  _createClass(Kanban, [{
    key: "render",
    value: function render() {

      return React.createElement(
        "div",
        { className: "Kanban" },
        this.props.states.map(function (s) {
          return React.createElement(State, {
            id: s._id,
            key: s._id,
            title: s.name
          });
        }),
        React.createElement(AddState, null)
      );
    }
  }]);

  return Kanban;
}(React.Component);

//-----------INIT------------


var getTasks = fetch("/tasks").then(function (r) {
  return r.json();
});
var getStates = fetch("/states").then(function (r) {
  return r.json();
});

Promise.all([getStates, getTasks]).then(function (results) {
  console.log(results);
  tasks = results[1];
  ReactDOM.render(React.createElement(Kanban, { states: results[0] }), document.getElementById('Main'));
});
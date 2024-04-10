import { useEffect, useState } from "react";
import "./App.scss";
import axios from "axios";

function App() {
  const [tasks, setTasks] = useState([
    {
      name: "loading",
      completed: false,
    },
  ]);
  const [newTaskName, setNewTaskName] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:5000/tasks")
      .then((res) => {
        setTasks(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  async function createNewTask() {
    try {
      if (!newTaskName) throw new Error("Task name not specified.");
      const task = { name: newTaskName, completed: false };
      const newTask = await axios.post("http://localhost:5000/tasks", task);
      setTasks([...tasks, newTask.data]);
      setNewTaskName("");
    } catch (error) {
      console.log(error);
    }
  }

  async function markAsCompleted(_id) {
    try {
      const task = await axios.put(`http://localhost:5000/tasks/${_id}`, {
        completed: true,
      });
      // update the tasks list by creating a new array and updating the completed property.
      const temp = tasks.map((p) => {
        if (p._id === _id) return { ...p, completed: true };
        return p;
      });
      setTasks(temp);
    } catch (error) {
      console.log(error);
    }
  }

  async function remove(id) {
    try {
      const response = await fetch("http://localhost:5000/api/tasks/" + id, {
        method: "DELETE",
      });
      const responseJson = await response.json();
      console.log(responseJson);
      setTasks(tasks.filter((p) => p.id !== id));
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <main>
      <div className="container">
        <div className="new-task">
          <input
            type="text"
            placeholder="Add a new task"
            className="new-task__text"
            value={newTaskName}
            onChange={(e) => setNewTaskName(e.target.value)}
          />
          <button className="new-task__btn" onClick={() => createNewTask()}>
            +
          </button>
        </div>
        <div className="todo">
          <h1 className="todo__title">Tasks to do - 4</h1>
          <div className="todo__list">
            {tasks
              .filter((task) => task.completed === false)
              .map((task, i) => {
                return (
                  <div key={i} className="todo__list__element">
                    <span className="todo__list__element__text">
                      {task.name}
                    </span>
                    <button
                      className="todo__list__element__done"
                      onClick={() => markAsCompleted(task._id)}
                    >
                      v
                    </button>
                    <button
                      className="todo__list__element__delete"
                      onClick={() => remove(task.id)}
                    >
                      x
                    </button>
                  </div>
                );
              })}
          </div>
        </div>
        <div className="done">
          <h1 className="done__title">Done - 1</h1>
          <div className="done__list">
            {tasks
              .filter((task) => task.completed === true)
              .map((task) => {
                return (
                  <div className="done__list__element" key={task._id}>
                    <span className="done__list__element__text">
                      {task.name}
                    </span>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </main>
  );
}

export default App;

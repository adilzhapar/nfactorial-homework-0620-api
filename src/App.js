import {useEffect, useState} from "react";
import "./App.css";
import { TodoistApi } from '@doist/todoist-api-typescript'
import axios from 'axios';

const api = new TodoistApi('425f5a936af49d521fa76f5f1e10ae020f4f9fec');
const URL = 'https://api.todoist.com/sync/v8/completed/get_all';

function App() {
  
  const [itemToAdd, setItemToAdd] = useState("");
  const [items, setItems] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [completedItems, setCompletedItems] = useState();
  
  const handleChangeItem = (event) => {
    setItemToAdd(event.target.value);
  };

  const handleAddItem = () => {
    api.addTask({
      content: itemToAdd,
      dueString: 'tomorrow at 12:00',
      dueLang: 'en',
      priority: 4,
      completed: false
  })
      .then((task) => setItems([...items, task.data]))
      .catch((error) => console.log(error))
  };

  const toggleItemDone = ({ id, completed }) => {
    if(!completed){
      api.closeTask(id)
      .then((response) => {
        setItems(items.map((item) => {
          if(item.id === id){
            return {
              ...item,
              completed: !completed
            }
          }
          return item;
        }))
      })
      .catch((error) => console.log(error))
    }else{
      api.reopenTask(id)
      .then((response) => {
        setItems(items.map((item) => {
          if(item.id === id){
            return {
              ...item,
              completed: !completed
            }
          }
          return item;
        }))
      })
      .catch((error) => console.log(error))
    }
  };


  const handleCompletedTasks = () => {
    axios.get(`${URL}`, {
      headers: {
        "Authorization": "Bearer 425f5a936af49d521fa76f5f1e10ae020f4f9fec"
      }
    }).then((response) => {
      setCompletedItems(response.data.items);
      console.log(completedItems);
    });
  }


  const handleItemDelete = (id) => {
      
  };

  useEffect(() => {
    api.getTasks()
    .then((tasks) => {
      setItems(tasks)
      // console.log(tasks)
    })
    .catch((error) => console.log(error))
  }, [])


  return (
    <div className="todo-app">
      {/* App-header */}
      <div className="app-header d-flex">
        <h1>Todo List</h1>
      </div>

      <div className="top-panel d-flex">
        {/* Search-panel */}
        <input
          type="text"
          className="form-control search-input"
          placeholder="type to search"
          value={searchValue}
          onChange={(event) => setSearchValue(event.target.value)}
        />
      </div>

      {/* List-group */}
      <ul className="list-group todo-list">
        {items?.length > 0 ? (
          items?.map((item) => (
            <li key={item.id} className="list-group-item">
              <span className={`todo-list-item${item.completed ? " done" : ""}`}>
                <span
                  className="todo-list-item-label"
                  onClick={() => toggleItemDone(item)}
                >
                  {item.content}
                </span>

                <button
                  type="button"
                  className="btn btn-outline-success btn-sm float-right"
                >
                  <i className="fa fa-exclamation" />
                </button>

                <button
                  type="button"
                  className="btn btn-outline-danger btn-sm float-right"
                  onClick={() => handleItemDelete(item.id)}
                >
                  <i className="fa fa-trash-o" />
                </button>
              </span>
            </li>
          ))
        ) : (
          <div>No todos🤤</div>
        )}
      </ul>

      {/* Add form */}
      <div className="item-add-form d-flex">
        <input
          value={itemToAdd}
          type="text"
          className="form-control"
          placeholder="What needs to be done"
          onChange={handleChangeItem}
        />
        <button className="btn btn-outline-secondary" onClick={handleAddItem}>
          Add item
        </button>
        <button className="btn btn-outline-secondary m-1" onClick={handleCompletedTasks}>
          Show completed
        </button>
      </div>

      <ul className="list-group todo-list">
        {completedItems?.length > 0 ? (
          completedItems?.map((item) => (
            <li key={item.id} className="list-group-item">
              <span className={`todo-list-item${item.completed ? " done" : ""}`}>
                <span
                  className="todo-list-item-label"
                  onClick={() => toggleItemDone(item)}
                >
                  {item.content}
                </span>

                <button
                  type="button"
                  className="btn btn-outline-success btn-sm float-right"
                >
                  <i className="fa fa-exclamation" />
                </button>

                <button
                  type="button"
                  className="btn btn-outline-danger btn-sm float-right"
                  onClick={() => handleItemDelete(item.id)}
                >
                  <i className="fa fa-trash-o" />
                </button>
              </span>
            </li>
          ))
        ) : (
          <div>No todos🤤</div>
        )}  
      </ul>
    </div>
  );
}

export default App;

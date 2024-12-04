import { useState, useEffect } from "react";
import "./App.css";
import { v4 as uuidv4 } from "uuid";

function App() {
  const [todo, setTodo] = useState("");
  const [todos, setTodos] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");

  useEffect(() => {
    const storedTodos = localStorage.getItem("todos");
    if (storedTodos) {
      try {
        const parsedTodos = JSON.parse(storedTodos);
        setTodos(parsedTodos);
        console.log("todos fetched sucessfully")
      } catch (error) {
        console.error("Error parsing todos from localStorage:", error);
      }
    }
  }, []);


  const saveToLS = () => {
    try {
      localStorage.setItem("todos", JSON.stringify(todos));
      console.log("todo saved successfully")
    } catch (error) {
      console.error("Error saving todos to localStorage:", error);
    }
  };

  const handleAdd = () => {
    if (todo.trim()) {
      const newTodos = [...todos, { id: uuidv4(), todo, isCompleted: false }];
      setTodos(newTodos);
      setTodo("");
      saveToLS(); 
    }
  };

  const handleEdit = (id, currentTodo) => {
    setEditingId(id);
    setEditText(currentTodo);
  };

  const handleUpdate = (id) => {
    const newTodos = todos.map(item => 
      item.id === id ? { ...item, todo: editText } : item
    );
    setTodos(newTodos);
    setEditingId(null);
    saveToLS(); 
  };

  const handleDelete = (id) => {
    const newTodos = todos.filter(item => item.id !== id);
    setTodos(newTodos);
    saveToLS(); 
  };

  const handleChange = (e) => {
    setTodo(e.target.value);
  };

  const handleCheckbox = (e) => {
    const id = e.target.name;
    const newTodos = todos.map(item => 
      item.id === id ? { ...item, isCompleted: !item.isCompleted } : item
    );
    setTodos(newTodos);
    saveToLS(); 
  };

  return (
    <div className="container mx-auto max-w-2xl px-4 py-8">
      <div className="bg-violet-100 rounded-xl shadow-md p-6">
        <h1 className="text-2xl font-bold text-center text-violet-900 mb-6">
          Todo List
        </h1>

        <div className="flex mb-6">
          <input
            onChange={handleChange}
            value={todo}
            className="flex-grow px-4 py-2 border-2 border-violet-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-violet-500"
            type="text"
            placeholder="Enter a new todo"
          />
          <button
            onClick={handleAdd}
            className="bg-violet-800 hover:bg-violet-700 text-white px-6 py-2 rounded-r-md transition-all duration-300 ease-in-out transform hover:scale-105 active:scale-95 shadow-md hover:shadow-lg"
          >
            Add
          </button>
        </div>

        <div className="space-y-3">
          {todos.map((item) => (
            <div
              key={item.id}
              className="flex items-center bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              <input
                name={item.id}
                onChange={handleCheckbox}
                type="checkbox"
                checked={item.isCompleted}
                className="form-checkbox h-5 w-5 mr-4 text-violet-600 rounded focus:ring-violet-500 focus:ring-offset-0 border-gray-300"
              />
              
              {editingId === item.id ? (
                <input
                  type="text"
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  className="flex-grow px-2 py-1 border-2 border-blue-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <span
                  className={`flex-grow ${
                    item.isCompleted
                      ? "line-through text-gray-500"
                      : "text-gray-800"
                  }`}
                >
                  {item.todo}
                </span>
              )}

              <div className="flex space-x-2 ml-4">
                {editingId === item.id ? (
                  <button
                    onClick={() => handleUpdate(item.id)}
                    className="px-3 py-1 text-green-600 hover:text-white hover:bg-green-600 rounded-md transition-all duration-300 ease-in-out transform hover:scale-105 active:scale-95 shadow-sm hover:shadow-md"
                  >
                    Update
                  </button>
                ) : (
                  <button
                    onClick={() => handleEdit(item.id, item.todo)}
                    className="px-3 py-1 text-blue-600 hover:text-white hover:bg-blue-600 rounded-md transition-all duration-300 ease-in-out transform hover:scale-105 active:scale-95 shadow-sm hover:shadow-md"
                  >
                    Edit
                  </button>
                )}
                <button
                  onClick={() => handleDelete(item.id)}
                  className="px-3 py-1 text-red-600 hover:text-white hover:bg-red-600 rounded-md transition-all duration-300 ease-in-out transform hover:scale-105 active:scale-95 shadow-sm hover:shadow-md"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
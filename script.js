document.addEventListener("DOMContentLoaded", populateUi);

async function fetchData() {
  const response = await fetch("http://127.0.0.1:3001/todos");
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const data = await response.json();
  return data;
}

function populateUi() {
  const todoList = document.getElementById("todo-container");
  fetchData()
    .then((todos) => {
      todoList.innerHTML = ""; // Clear any existing items
      todos.forEach((todo) => {
        const li = document.createElement("li");
        li.innerHTML = `${todo.id} ${todo.task} <button class='btn btn-delete' onclick="deleteTask(${todo.id})">Delete</button>`;
        li.className = "todo-item";
        todoList.appendChild(li);
      });
      todoList.className = "todo-list";
    })
    .catch((error) => {
      todoList.innerHTML = `<li class="error-message">Error loading todos: ${error.message}</li>`;
      todoList.className = "todo-list";
    });
}

document.getElementById("todo_form").addEventListener("submit", addTodo);

async function addTodo(e) {
  e.preventDefault();
  const input = document.getElementById("todo_input");
  const task = input.value.trim();
  if (!task) return;

  const response = await fetch("http://127.0.0.1:3001/todos", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ task }),
  });

  if (response.ok) {
    input.value = "";
    populateUi(); // Refresh the todo list
  } else {
    alert("Failed to add todo.");
  }
}


function deleteTask(id) {
    fetch(`http://127.0.0.1:3001/todos/${id}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
        }
    })
    .then(response => {
        if (response.ok) {
            alert(`Todo with id ${id} deleted successfully.`);
            // Optionally remove the element from the DOM:
            populateUi();
        } else {
            alert("Failed to delete the todo.");
        }
    })
    .catch(error => {
        console.error("Error deleting task:", error);
    });

    populateUi(); 
}

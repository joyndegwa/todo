//selecting DOM elements
const todoInput = document.getElementById("todo-input");
const todoList = document.getElementById("todo-list");
const itemsLeft = document.getElementById("items-left");


// Add new todo when pressing Enter
let todos = [];

todoInput.addEventListener("keypress", function (e) {
  if (e.key === "Enter" && todoInput.value.trim() !== "") {
    addTodo(todoInput.value.trim());
    todoInput.value = "";
  }
});



// Add todo functions

function addTodo(text) {
  const todo = { text, completed: false, id: Date.now() };
  todos.push(todo);
  renderTodos();
}

function toggleComplete(id) {
  todos = todos.map(t => t.id === id ? { ...t, completed: !t.completed } : t);
  renderTodos();
}

function deleteTodo(id) {
  if (confirm("Are you sure you want to delete this task?")) {
    todos = todos.filter(t => t.id !== id);
    renderTodos();
  }
}

function filterTodos(filter) {
  document.querySelectorAll(".filters button").forEach(btn => btn.classList.remove("active"));
  event.target.classList.add("active");

  let filtered = todos;
  if (filter === "active") filtered = todos.filter(t => !t.completed);
  if (filter === "completed") filtered = todos.filter(t => t.completed);

  renderTodos(filtered);
}

function clearCompleted() {
  todos = todos.filter(t => !t.completed);
  renderTodos();
}
// Render todos

function renderTodos(filteredTodos = todos) {
  todoList.innerHTML = "";
  filteredTodos.forEach(todo => {
    const li = document.createElement("li");
    li.setAttribute("draggable", true);

    const circle = document.createElement("div");
    circle.className = "circle" + (todo.completed ? " checked" : "");
    circle.onclick = () => toggleComplete(todo.id);

    const span = document.createElement("span");
    span.textContent = todo.text;

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "delete-btn";
    deleteBtn.textContent = "X";
    deleteBtn.onclick = () => deleteTodo(todo.id);

    if (todo.completed) li.classList.add("completed");

    li.appendChild(circle);
    li.appendChild(span);
    li.appendChild(deleteBtn);

    todoList.appendChild(li);
  });

  itemsLeft.textContent = `${todos.filter(t => !t.completed).length} items left`;

  enableDragAndDrop();
}

// Drag and Drop
function enableDragAndDrop() {
  let dragging = null;

  document.querySelectorAll("#todo-list li").forEach(li => {
    li.addEventListener("dragstart", () => dragging = li);
    li.addEventListener("dragover", e => e.preventDefault());
    li.addEventListener("drop", e => {
      e.preventDefault();
      if (dragging && dragging !== li) {
        todoList.insertBefore(dragging, li.nextSibling);
        reorderTodos();
      }
    });
  });
}
// Reorder todos array based on current DOM order
function reorderTodos() {
  const newOrder = [];
  document.querySelectorAll("#todo-list li span").forEach(span => {
    const todo = todos.find(t => t.text === span.textContent);
    if (todo) newOrder.push(todo);
  });
  todos = newOrder;
}

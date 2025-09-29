<!-- ...existing code... -->

<div class="todo-container">
  <h1>Todo</h1>
  <form id="todo-form" autocomplete="off">
    <input id="todo-input" type="text" placeholder="Create a new todo..." style="width:100%;padding:0.7rem;border-radius:5px;border:1px solid #eee;margin-bottom:1rem;">
  </form>
  <ul class="todo-list" id="todo-list"></ul>
  <div class="todo-actions">
    <span id="items-left">0 items left</span>
    <div class="filters">
      <button class="filter-btn active" data-filter="all">All</button>
      <button class="filter-btn" data-filter="active">Active</button>
      <button class="filter-btn" data-filter="completed">Completed</button>
    </div>
    <button class="clear-btn" id="clear-completed">Clear Completed</button>
  </div>
  <div class="drag-info">Drag and drop to reorder list</div>
</div>

<script>
const todoForm = document.getElementById('todo-form');
const todoInput = document.getElementById('todo-input');
const todoList = document.getElementById('todo-list');
const itemsLeft = document.getElementById('items-left');
const filterBtns = document.querySelectorAll('.filter-btn');
const clearBtn = document.getElementById('clear-completed');

let todos = [];
let filter = 'all';

function renderTodos() {
  todoList.innerHTML = '';
  let filtered = todos.filter(todo => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });
  filtered.forEach((todo, idx) => {
    const li = document.createElement('li');
    li.className = 'todo-item' + (todo.completed ? ' completed' : '');
    li.draggable = true;
    li.dataset.index = idx;

    li.innerHTML = `
      <input type="checkbox" class="todo-checkbox" ${todo.completed ? 'checked' : ''}>
      <span class="todo-text">${todo.text}</span>
      <button class="clear-btn" style="font-size:1.2em;padding:0 0.5em;">&times;</button>
    `;

    // Complete toggle
    li.querySelector('.todo-checkbox').addEventListener('change', () => {
      todo.completed = !todo.completed;
      renderTodos();
    });

    // Delete
    li.querySelector('.clear-btn').addEventListener('click', () => {
      todos.splice(todos.indexOf(todo), 1);
      renderTodos();
    });

    // Drag events
    li.addEventListener('dragstart', e => {
      e.dataTransfer.setData('text/plain', idx);
    });
    li.addEventListener('dragover', e => e.preventDefault());
    li.addEventListener('drop', e => {
      e.preventDefault();
      const from = +e.dataTransfer.getData('text/plain');
      const to = idx;
      if (from !== to) {
        const moved = todos.splice(from, 1)[0];
        todos.splice(to, 0, moved);
        renderTodos();
      }
    });

    todoList.appendChild(li);
  });

  itemsLeft.textContent = `${todos.filter(t => !t.completed).length} items left`;
}

todoForm.addEventListener('submit', e => {
  e.preventDefault();
  const text = todoInput.value.trim();
  if (text) {
    todos.push({ text, completed: false });
    todoInput.value = '';
    renderTodos();
  }
});

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    filter = btn.dataset.filter;
    renderTodos();
  });
});

clearBtn.addEventListener('click', () => {
  todos = todos.filter(t => !t.completed);
  renderTodos();
});

// Initial render
renderTodos();
</script>
<!-- ...existing code... -->
document.getElementById('addTodo').addEventListener('click', addTodo);

function addTodo() {
  const todoText = document.getElementById('newTodo').value;
  if (todoText) {
    chrome.storage.sync.get({todos: []}, function(data) {
      const todos = data.todos;
      todos.push({text: todoText, completed: false});
      chrome.storage.sync.set({todos: todos}, function() {
        renderTodos();
      });
    });
  }
}

function renderTodos() {
  chrome.storage.sync.get({todos: []}, function(data) {
    const todoList = document.getElementById('todoList');
    todoList.innerHTML = '';
    data.todos.forEach((todo, index) => {
      const li = document.createElement('li');
      li.textContent = todo.text;
      if (todo.completed) {
        li.style.textDecoration = 'line-through';
      }
      li.addEventListener('click', () => toggleTodo(index));
      todoList.appendChild(li);
    });
  });
}

function toggleTodo(index) {
  chrome.storage.sync.get({todos: []}, function(data) {
    const todos = data.todos;
    todos[index].completed = !todos[index].completed;
    chrome.storage.sync.set({todos: todos}, function() {
      renderTodos();
      if (todos[index].completed) {
        chrome.runtime.sendMessage({action: 'taskCompleted'});
      }
    });
  });
}

renderTodos();
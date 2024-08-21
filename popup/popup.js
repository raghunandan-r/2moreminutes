document.addEventListener('DOMContentLoaded', function() {
    const addTodoButton = document.getElementById('addTodo');
    const newTodoInput = document.getElementById('newTodo');
    const todoList = document.getElementById('todoList');

    addTodoButton.addEventListener('click', addTodo);
    newTodoInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            addTodo();
        }
    });

    function addTodo() {
        const todoText = newTodoInput.value.trim();
        if (todoText) {
            chrome.storage.sync.get({todos: []}, function(data) {
                const todos = data.todos;
                todos.push({text: todoText, completed: false});
                chrome.storage.sync.set({todos: todos}, function() {
                    renderTodos();
                    newTodoInput.value = '';
                });
            });
        }
    }

    function renderTodos() {
        chrome.storage.sync.get({todos: []}, function(data) {
            todoList.innerHTML = '';
            data.todos.forEach((todo, index) => {
                const li = document.createElement('li');
                li.className = 'todo-item' + (todo.completed ? ' completed' : '');
                li.innerHTML = `
                    <input type="checkbox" class="todo-checkbox" ${todo.completed ? 'checked' : ''}>
                    <span class="todo-text">${todo.text}</span>
                `;
                const checkbox = li.querySelector('.todo-checkbox');
                checkbox.addEventListener('change', () => toggleTodo(index));
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
});
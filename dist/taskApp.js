document.addEventListener('DOMContentLoaded', function () {
    const todoTitle = document.getElementById('todoTitle');
    const todoDescription = document.getElementById('todoDesc');
    const todoList = document.getElementById('todoList');
    const addBtn = document.getElementById('addBtn');
    const displayedTodos = document.getElementById('displayedTodos');
    const todos = JSON.parse(localStorage.getItem("todos") || '[]');
    function renderTodos(todos) {
        if (todoList) {
            todoList.innerHTML = todos.map((todo, index) => `<div class="card todo-item">
          <div class="todo-content">
              <h3>${todo.title}</h3>
              <p>${todo.description}</p>
              <span class="status status-${todo.status.toLowerCase()}" id="status${index}">${todo.status}</span>
          </div>
          <div class="todo-actions">
              <button onclick="completeTodo(${index})" class="btn complete-btn" id="completeBtn${index}"><i class="fas fa-check"></i></button>
              <button onclick="editTodo(${index})" class="btn edit-btn" id="editBtn${index}" ${todo.status === 'Completed' ? 'disabled' : ''}><i class="fas fa-edit"></i></button>
              <button onclick="deleteTodo(${index})" class="btn delete-btn" id="deleteBtn"><i class="fas fa-trash"></i></button>
          </div>
        </div>`).join('');
        }
    }
    renderTodos(todos);
    function addTodo() {
        const title = todoTitle ? todoTitle.value.trim() : '';
        const description = todoDescription ? todoDescription.value.trim() : '';
        if (title) {
            todos.push({
                title: title,
                description: description,
                status: 'Pending',
            });
            if (todoTitle) {
                todoTitle.value = '';
            }
            if (todoTitle) {
                todoDescription.value = '';
            }
        }
        renderTodos(todos);
        localStorage.setItem("todos", JSON.stringify(todos));
    }
    if (addBtn) {
        addBtn.addEventListener('click', addTodo);
    }
    window.editTodo = (todoIndex) => {
        const todoToEdit = todos[todoIndex];
        if (todoTitle) {
            todoTitle.value = todoToEdit.title || '';
        }
        if (todoDescription) {
            todoDescription.value = todoToEdit.description || '';
        }
        todos.splice(todoIndex, 1);
        renderTodos(todos);
    };
    window.deleteTodo = (todoIndex) => {
        todos.splice(todoIndex, 1);
        renderTodos(todos);
    };
    window.completeTodo = (todoIndex) => {
        const todoToComplete = todos[todoIndex];
        if (todoToComplete.status === 'Pending') {
            todoToComplete.status = 'Completed';
            renderTodos(todos);
        }
        else {
            todoToComplete.status = 'Pending';
            renderTodos(todos);
        }
    };
    window.allTasks = () => {
        if (displayedTodos) {
            displayedTodos.innerHTML = 'All Tasks';
        }
        renderTodos(todos);
    };
    window.completedTasks = () => {
        if (displayedTodos) {
            displayedTodos.innerHTML = 'Completed Tasks';
        }
        const completedTodos = todos.filter((todo) => todo.status === 'Completed');
        renderTodos(completedTodos);
    };
    window.pendingTasks = () => {
        if (displayedTodos) {
            displayedTodos.innerHTML = 'Pending Tasks';
        }
        const pendingTodos = todos.filter((todo) => todo.status === 'Pending');
        renderTodos(pendingTodos);
    };
});
export {};
//# sourceMappingURL=taskApp.js.map
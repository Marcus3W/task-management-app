class Task {
    constructor(title, description, priority, dueDate) {
        this.id = Date.now();
        this.title = title;
        this.description = description;
        this.priority = priority;
        this.dueDate = dueDate;
        this.completed = false;
    }
}

function addTaskToList(task, filter) {
    if (
        (filter.priority === 'all' || task.priority === filter.priority) &&
        (filter.status === 'all' ||
            (filter.status === 'completed' && task.completed) ||
            (filter.status === 'incomplete' && !task.completed))
    ) {
        const taskList = document.getElementById('tasks');

        const listItem = document.createElement('li');
        listItem.setAttribute('data-id', task.id);
        listItem.classList.add('task-item');
        if (task.completed) {
            listItem.classList.add('completed');
        }

        listItem.innerHTML = `
      <div class="task-info">
        <div class="task-title">${task.title}</div>
        <div class="task-description">${task.description}</div>
        <div class="task-metadata">
          <span>Priority: ${task.priority}</span>
          <span>Due: ${task.dueDate || 'N/A'}</span>
        </div>
      </div>
      <button class="complete-btn">Complete</button>
      <button class="delete-btn">Delete</button>
    `;

        taskList.appendChild(listItem);
    }
}

const tasks = [];

function handleFormSubmit(event) {
    event.preventDefault();

    const titleInput = document.getElementById('task-title');
    const descriptionInput = document.getElementById('task-description');
    const priorityInput = document.getElementById('task-priority');
    const dueDateInput = document.getElementById('task-due-date');

    const newTask = new Task(
        titleInput.value,
        descriptionInput.value,
        priorityInput.value,
        dueDateInput.value
    );

    tasks.push(newTask);
    saveTasksToLocalStorage(); // stores tasks in local storage
    addTaskToList(newTask, { priority: 'all', status: 'all' });

    // Clear the form inputs
    titleInput.value = '';
    descriptionInput.value = '';
    priorityInput.value = 'low';
    dueDateInput.value = '';
}

const taskForm = document.getElementById('task-form');
taskForm.addEventListener('submit', handleFormSubmit);


// MARK TASK AS COMPLETE
function toggleTaskCompletion(taskId) {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
        task.completed = !task.completed;
        saveTasksToLocalStorage(); // stores tasks in local storage

        const listItem = document.querySelector(`[data-id="${taskId}"]`);
        listItem.classList.toggle('completed');
    }
}

const taskList = document.getElementById('tasks');

taskList.addEventListener('click', (event) => {
    if (event.target.classList.contains('complete-btn')) {
        const taskId = parseInt(event.target.parentElement.getAttribute('data-id'), 10);
        toggleTaskCompletion(taskId);
    }
});

// DELETE TASK
function deleteTask(taskId) {
    // Remove the task from the tasks array
    const taskIndex = tasks.findIndex(t => t.id === taskId);
    if (taskIndex !== -1) {
        tasks.splice(taskIndex, 1);
        saveTasksToLocalStorage(); // stores tasks in local storage
    }

    // Remove the task from the DOM
    const listItem = document.querySelector(`[data-id="${taskId}"]`);
    if (listItem) {
        listItem.remove();
    }
}

taskList.addEventListener('click', (event) => {
    if (event.target.classList.contains('delete-btn')) {
        const taskId = parseInt(event.target.parentElement.getAttribute('data-id'), 10);
        deleteTask(taskId);
    }
});

// FILTER TASKS
function applyFilters() {
    // Clear the current task list
    const taskList = document.getElementById('tasks');
    taskList.innerHTML = '';

    // Get the selected filter values
    const priorityFilter = document.getElementById('filter-priority').value;
    const statusFilter = document.getElementById('filter-status').value;

    // Add tasks to the list based on the selected filters
    const filter = { priority: priorityFilter, status: statusFilter };
    tasks.forEach(task => addTaskToList(task, filter));
}

const priorityFilterElement = document.getElementById('filter-priority');
const statusFilterElement = document.getElementById('filter-status');

priorityFilterElement.addEventListener('change', applyFilters);
statusFilterElement.addEventListener('change', applyFilters);


// SEARCH TASKS

function searchTasks(query) {
    // Clear the current task list
    const taskList = document.getElementById('tasks');
    taskList.innerHTML = '';

    // Get the selected filter values
    const priorityFilter = document.getElementById('filter-priority').value;
    const statusFilter = document.getElementById('filter-status').value;

    // Add tasks to the list based on the search query and selected filters
    const filter = { priority: priorityFilter, status: statusFilter };
    tasks.forEach(task => {
        if (task.title.toLowerCase().includes(query.toLowerCase()) || task.description.toLowerCase().includes(query.toLowerCase())) {
            addTaskToList(task, filter);
        }
    });
}

const searchInputElement = document.getElementById('search-tasks');

searchInputElement.addEventListener('input', (event) => {
    searchTasks(event.target.value);
});


// STORE TASKS IN LOCAL STORAGE
function saveTasksToLocalStorage() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadTasksFromLocalStorage() {
    const storedTasks = JSON.parse(localStorage.getItem('tasks'));
    if (storedTasks) {
        tasks.push(...storedTasks);
        storedTasks.forEach(task => addTaskToList(task, { priority: 'all', status: 'all' }));
    }
}

document.addEventListener('DOMContentLoaded', loadTasksFromLocalStorage);

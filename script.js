document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('new-task');
    const addButton = document.getElementById('addTaskButton');
    const taskList = document.getElementById('task-list');
    const filters = {
        all: document.getElementById('allFilter'),
        active: document.getElementById('activeFilter'),
        completed: document.getElementById('completedFilter')
    };

    // Load tasks from local storage
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    renderTasks();

    function saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function renderTasks(filter = 'all') {
        taskList.innerHTML = '';
        tasks.filter(task => {
            if (filter === 'all') return true;
            if (filter === 'active') return !task.completed;
            if (filter === 'completed') return task.completed;
        }).forEach(task => {
            const listItem = document.createElement('li');
            listItem.innerHTML = `
                <span class="${task.completed ? 'completed' : ''}">${task.text}</span>
                <input type="text" class="edit-input" style="display:none;">
                <button class="complete">${task.completed ? 'Undo' : 'Complete'}</button>
                <button class="edit">Edit</button>
                <button class="remove">Remove</button>
            `;

            listItem.querySelector('.complete').addEventListener('click', () => {
                task.completed = !task.completed;
                saveTasks();
                renderTasks(filter);
            });

            listItem.querySelector('.edit').addEventListener('click', () => {
                const span = listItem.querySelector('span');
                const input = listItem.querySelector('.edit-input');
                input.value = task.text;
                span.style.display = 'none';
                input.style.display = 'inline';
                input.focus();

                input.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') {
                        task.text = input.value.trim();
                        if (task.text === '') return;
                        span.style.display = 'inline';
                        input.style.display = 'none';
                        saveTasks();
                        renderTasks(filter);
                    }
                });

                input.addEventListener('blur', () => {
                    span.style.display = 'inline';
                    input.style.display = 'none';
                });
            });

            listItem.querySelector('.remove').addEventListener('click', () => {
                tasks = tasks.filter(t => t !== task);
                saveTasks();
                renderTasks(filter);
            });

            taskList.appendChild(listItem);
        });
    }

    function addTask() {
        const taskText = taskInput.value.trim();
        if (taskText === '') return;

        const task = { text: taskText, completed: false };
        tasks.push(task);
        saveTasks();
        renderTasks();
        taskInput.value = '';
        taskInput.focus();
    }

    // Event listeners
    addButton.addEventListener('click', addTask);
    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addTask();
    });

    filters.all.addEventListener('click', () => renderTasks('all'));
    filters.active.addEventListener('click', () => renderTasks('active'));
    filters.completed.addEventListener('click', () => renderTasks('completed'));
});

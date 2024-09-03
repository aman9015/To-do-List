document.addEventListener('DOMContentLoaded', () => {
    const taskList = document.getElementById('taskList');
    const completedTaskList = document.getElementById('completedTaskList');
    const completedTasksContainer = document.getElementById('completedTasksContainer');
    const addTaskButton = document.getElementById('addTaskButton');
    const viewCompletedTasksButton = document.getElementById('viewCompletedTasks');
    const resetTasksButton = document.getElementById('resetTasks');
    const backToToDoListButton = document.getElementById('backToToDoList');

    let tasks = [];
    let completedTasks = [];

    // Load tasks from local storage on initialization
    loadTasksFromLocalStorage();

    // Render tasks on initialization
    renderTasks();

    // Event listener for adding a new task
    addTaskButton.addEventListener('click', () => {
        const taskName = prompt('Enter task name:');
        if (taskName) {
            const task = { name: taskName, completed: false, deadline: null };
            tasks.push(task);
            saveTasksToLocalStorage();
            renderTasks();
        }
    });

    // Event listener for viewing completed tasks
    viewCompletedTasksButton.addEventListener('click', () => {
        completedTasksContainer.classList.remove('hidden');
        renderCompletedTasks();
    });

    // Event listener for resetting completed tasks
    resetTasksButton.addEventListener('click', () => {
        if (confirm('Are you sure you want to reset all completed tasks?')) {
            completedTasks = [];
            saveCompletedTasksToLocalStorage();
            renderCompletedTasks();
        }
    });

    // Event listener for going back to the to-do list
    backToToDoListButton.addEventListener('click', () => {
        completedTasksContainer.classList.add('hidden');
    });

    // Function to render tasks
    function renderTasks() {
        taskList.innerHTML = '';
        if (tasks.length === 0) {
            const emptyMessage = document.createElement('p');
            emptyMessage.textContent = 'No tasks added yet.';
            emptyMessage.classList.add('empty-message');
            taskList.appendChild(emptyMessage);
            return;
        }
        tasks.forEach((task, index) => {
            const li = document.createElement('li');
            li.textContent = task.name;

            if (task.deadline) {
                const deadlineSpan = document.createElement('span');
                deadlineSpan.textContent = ` (Deadline: ${task.deadline})`;
                deadlineSpan.classList.add('deadline-span');
                li.appendChild(deadlineSpan);
            }

            const buttonsContainer = document.createElement('div');
            buttonsContainer.classList.add('buttons-container');

            const completeButton = document.createElement('button');
            completeButton.textContent = 'Complete';
            completeButton.classList.add('complete-button');
            completeButton.addEventListener('click', () => {
                completeTask(index);
            });

            const editButton = document.createElement('button');
            editButton.textContent = 'Edit';
            editButton.classList.add('edit-button');
            editButton.addEventListener('click', () => {
                editTask(index);
            });

            const deadlineButton = document.createElement('button');
            deadlineButton.textContent = 'Deadline';
            deadlineButton.classList.add('deadline-button');
            deadlineButton.addEventListener('click', () => {
                setDeadline(index);
            });

            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.classList.add('delete-button');
            deleteButton.addEventListener('click', () => {
                deleteTask(index);
            });

            buttonsContainer.appendChild(completeButton);
            buttonsContainer.appendChild(editButton);
            buttonsContainer.appendChild(deadlineButton); // Added Deadline button
            buttonsContainer.appendChild(deleteButton);
            li.appendChild(buttonsContainer);
            taskList.appendChild(li);
        });
    }

    // Function to render completed tasks
    function renderCompletedTasks() {
        completedTaskList.innerHTML = '';
        if (completedTasks.length === 0) {
            const emptyMessage = document.createElement('p');
            emptyMessage.textContent = 'No completed tasks yet.';
            emptyMessage.classList.add('empty-message');
            completedTaskList.appendChild(emptyMessage);
            return;
        }
        completedTasks.forEach((task) => {
            const li = document.createElement('li');
            li.textContent = `${task.name} (Completed: ${task.completedAt})`;
            completedTaskList.appendChild(li);
        });
    }

    // Function to complete a task
    function completeTask(index) {
        const task = tasks.splice(index, 1)[0];
        task.completed = true;
        task.completedAt = new Date().toLocaleString(); // Set the completion time
        completedTasks.push(task);
        saveTasksToLocalStorage();
        saveCompletedTasksToLocalStorage();
        renderTasks();
    }

    // Function to edit a task
    function editTask(index) {
        const newTaskName = prompt('Edit task name:', tasks[index].name);
        if (newTaskName) {
            tasks[index].name = newTaskName;
            saveTasksToLocalStorage();
            renderTasks();
        }
    }

    // Function to set or edit a deadline
    function setDeadline(index) {
        const task = tasks[index];
    
        // Check if deadline modal already exists
        let deadlineModal = document.querySelector('.deadline-modal');
        if (deadlineModal) {
            // If it exists, just update the input value
            const dateTimeInput = deadlineModal.querySelector('#deadline-input');
            dateTimeInput.value = task.deadline || '';
            deadlineModal.style.display = 'block';
            return;
        }
    
        // Create the deadline modal if it does not exist
        deadlineModal = document.createElement('div');
        deadlineModal.classList.add('deadline-modal');
    
        const deadlineContent = document.createElement('div');
        deadlineContent.classList.add('deadline-content');
    
        const dateTimeLabel = document.createElement('label');
        dateTimeLabel.textContent = 'Choose deadline:';
        dateTimeLabel.setAttribute('for', 'deadline-input');
    
        const dateTimeInput = document.createElement('input');
        dateTimeInput.type = 'datetime-local';
        dateTimeInput.id = 'deadline-input';
        dateTimeInput.value = task.deadline || '';
    
        const saveButton = document.createElement('button');
        saveButton.textContent = 'Save';
        saveButton.classList.add('save-button');
        saveButton.addEventListener('click', () => {
            const selectedDeadline = dateTimeInput.value;
            if (selectedDeadline) {
                task.deadline = selectedDeadline;
                saveTasksToLocalStorage();
                renderTasks();
                document.body.removeChild(deadlineModal);
            }
        });
    
        const cancelButton = document.createElement('button');
        cancelButton.textContent = 'Cancel';
        cancelButton.classList.add('cancel-button');
        cancelButton.addEventListener('click', () => {
            document.body.removeChild(deadlineModal);
        });
    
        deadlineContent.appendChild(dateTimeLabel);
        deadlineContent.appendChild(dateTimeInput);
        deadlineContent.appendChild(saveButton);
        deadlineContent.appendChild(cancelButton);
        deadlineModal.appendChild(deadlineContent);
        document.body.appendChild(deadlineModal);
    }
    

    // Function to delete a task
    function deleteTask(index) {
        if (confirm('Are you sure you want to delete this task?')) {
            tasks.splice(index, 1);
            saveTasksToLocalStorage();
            renderTasks();
        }
    }

    // Function to load tasks from local storage
    function loadTasksFromLocalStorage() {
        const storedTasks = localStorage.getItem('tasks');
        const storedCompletedTasks = localStorage.getItem('completedTasks');
        if (storedTasks) {
            tasks = JSON.parse(storedTasks);
        }
        if (storedCompletedTasks) {
            completedTasks = JSON.parse(storedCompletedTasks);
        }
    }

    // Function to save tasks to local storage
    function saveTasksToLocalStorage() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    // Function to save completed tasks to local storage
    function saveCompletedTasksToLocalStorage() {
        localStorage.setItem('completedTasks', JSON.stringify(completedTasks));
    }
    document.addEventListener('DOMContentLoaded', () => {
        // Other initialization code...
    
        // Check for past deadlines every 30 minutes
        setInterval(checkDeadlines, 30 * 60 * 1000); // 30 minutes in milliseconds
    
        function checkDeadlines() {
            const now = new Date();
            tasks.forEach((task, index) => {
                if (task.deadline && !task.completed) {
                    const deadline = new Date(task.deadline);
                    if (now > deadline) {
                        displayNotification(task.name);
                    }
                }
            });
        }
    
        function displayNotification(taskName) {
            const notificationDiv = document.getElementById('notifications');
            notificationDiv.textContent = `You have passed the deadline for "${taskName}" task. Reschedule it or complete it fast.`;
            notificationDiv.classList.remove('hidden');
    
            // Hide notification after 10 seconds
            setTimeout(() => {
                notificationDiv.classList.add('hidden');
            }, 10000);
        }
    
        // Add other event listeners and functions...
    });
    
});

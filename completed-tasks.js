document.addEventListener('DOMContentLoaded', () => {
    const completedTasksList = document.getElementById('completed-tasks-list');
    const resetTasksBtn = document.getElementById('reset-tasks-btn');
    const backToMainBtn = document.getElementById('back-to-main-btn');

    // Load completed tasks from local storage
    const recentTasks = JSON.parse(localStorage.getItem('recentTasks')) || [];
    recentTasks.forEach(task => {
        const li = document.createElement('li');
        li.textContent = `${task.text} - Completed on ${task.date}`;
        completedTasksList.appendChild(li);
    });

    // Reset completed tasks
    resetTasksBtn.addEventListener('click', () => {
        if (confirm('Are you sure you want to reset all completed tasks?')) {
            localStorage.removeItem('recentTasks');
            completedTasksList.innerHTML = ''; // Clear the list on the page
        }
    });

    // Go back to the main page
    backToMainBtn.addEventListener('click', () => {
        window.location.href = 'main.html'; // Ensure this points to your main page
    });
});

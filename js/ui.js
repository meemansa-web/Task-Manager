// UI module - handles DOM manipulation and rendering

/**
 * Create a task card element
 * @param {Object} task - Task object
 * @param {number} index - Task index
 * @param {Object} callbacks - Object containing event handlers
 * @returns {HTMLElement} Task card element
 */
export function createTaskCard(task, index, callbacks) {
    const taskCard = document.createElement('div');
    taskCard.classList.add('taskCard');
    
    const statusClass = task.completed ? 'completed' : 'pending';
    const statusText = task.completed ? 'Completed' : 'Pending';
    taskCard.classList.add(statusClass);

    // Task text
    const taskText = document.createElement('p');
    taskText.innerText = task.text;

    // Task status
    const taskStatus = document.createElement('p');
    taskStatus.classList.add('status');
    taskStatus.innerText = statusText;

    // Toggle button
    const toggleButton = createButton('button-box', 
        task.completed ? 'Mark as Pending' : 'Mark as Completed',
        task.completed ? 'green' : 'green',
        () => callbacks.onToggle(index)
    );

    // Delete button
    const deleteButton = createButton('button-box', 'Delete', 'red', 
        () => callbacks.onDelete(index)
    );

    taskCard.appendChild(taskText);
    taskCard.appendChild(taskStatus);
    taskCard.appendChild(toggleButton);
    taskCard.appendChild(deleteButton);

    return taskCard;
}

/**
 * Create a button element
 * @param {string} className - Button class
 * @param {string} text - Button text
 * @param {string} colorClass - Color class for button
 * @param {Function} onClick - Click handler
 * @returns {HTMLElement} Button element
 */
function createButton(className, text, colorClass, onClick) {
    const button = document.createElement('button');
    button.classList.add(className);
    
    const span = document.createElement('span');
    span.classList.add(colorClass);
    span.innerText = text;
    
    button.appendChild(span);
    button.addEventListener('click', onClick);
    
    return button;
}

/**
 * Render all tasks to the container
 * @param {HTMLElement} container - Container element
 * @param {Array} tasks - Array of tasks
 * @param {Object} callbacks - Event handlers
 */
export function renderTasks(container, tasks, callbacks) {
    container.innerHTML = '';
    
    tasks.forEach((task, index) => {
        const taskCard = createTaskCard(task, index, callbacks);
        container.appendChild(taskCard);
    });
}

/**
 * Show confirmation dialog
 * @param {HTMLElement} dialog - Dialog element
 * @param {HTMLElement} container - Container to apply overlay
 */
export function showConfirmDialog(dialog, container) {
    dialog.style.display = 'block';
    container.classList.add('overlay');
}

/**
 * Hide confirmation dialog
 * @param {HTMLElement} dialog - Dialog element
 * @param {HTMLElement} container - Container to remove overlay
 */
export function hideConfirmDialog(dialog, container) {
    dialog.style.display = 'none';
    container.classList.remove('overlay');
}

/**
 * Clear input field
 * @param {HTMLElement} input - Input element
 */
export function clearInput(input) {
    input.value = '';
}
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
    taskCard.setAttribute('data-index', index);
    taskCard.draggable = true;
    
    const statusClass = task.completed ? 'completed' : 'pending';
    const statusText = task.completed ? 'Completed' : 'Pending';
    taskCard.classList.add(statusClass);

    // Task text
    const taskText = document.createElement('p');
    taskText.classList.add('task-text');
    taskText.innerText = task.text;

    // Task meta (status + actions)
    const taskMeta = document.createElement('div');
    taskMeta.classList.add('task-meta');

    // Task status
    const taskStatus = document.createElement('span');
    taskStatus.classList.add('status');
    taskStatus.innerText = statusText;

    // Task actions
    const taskActions = document.createElement('div');
    taskActions.classList.add('task-actions');

    // Toggle button
    const toggleBtn = document.createElement('button');
    toggleBtn.classList.add('btn', task.completed ? 'btn-pending' : 'btn-complete');
    toggleBtn.innerHTML = `<i class="fas ${task.completed ? 'fa-undo' : 'fa-check'}"></i> ${task.completed ? 'Pending' : 'Complete'}`;
    toggleBtn.addEventListener('click', () => callbacks.onToggle(index));

    // Edit button
    const editBtn = document.createElement('button');
    editBtn.classList.add('btn', 'btn-edit');
    editBtn.innerHTML = '<i class="fas fa-edit"></i> Edit';
    editBtn.addEventListener('click', () => callbacks.onEdit(index, task.text));

    // Delete button
    const deleteBtn = document.createElement('button');
    deleteBtn.classList.add('btn', 'btn-delete');
    deleteBtn.innerHTML = '<i class="fas fa-trash"></i> Delete';
    deleteBtn.addEventListener('click', () => callbacks.onDelete(index));

    taskActions.appendChild(toggleBtn);
    taskActions.appendChild(editBtn);
    taskActions.appendChild(deleteBtn);

    taskMeta.appendChild(taskStatus);
    taskMeta.appendChild(taskActions);

    taskCard.appendChild(taskText);
    taskCard.appendChild(taskMeta);

    return taskCard;
}

/**
 * Render all tasks to the container
 * @param {HTMLElement} container - Container element
 * @param {Array} tasks - Array of tasks
 * @param {Object} callbacks - Event handlers
 */
export function renderTasks(container, tasks, callbacks) {
    container.innerHTML = '';
    
    if (tasks.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-clipboard-list"></i>
                <p>No tasks yet. Add one above!</p>
            </div>
        `;
        return;
    }
    
    tasks.forEach((task, index) => {
        const taskCard = createTaskCard(task, index, callbacks);
        container.appendChild(taskCard);
    });
}

/**
 * Show modal dialog
 * @param {HTMLElement} modal - Modal element
 */
export function showModal(modal) {
    modal.classList.add('show');
}

/**
 * Hide modal dialog
 * @param {HTMLElement} modal - Modal element
 */
export function hideModal(modal) {
    modal.classList.remove('show');
}

/**
 * Clear input field
 * @param {HTMLElement} input - Input element
 */
export function clearInput(input) {
    input.value = '';
}

/**
 * Update statistics display
 * @param {Object} stats - Statistics object
 */
export function updateStats(stats) {
    const totalEl = document.getElementById('totalTasks');
    const completedEl = document.getElementById('completedTasks');
    const activeEl = document.getElementById('activeTasks');
    
    if (totalEl) totalEl.textContent = stats.total;
    if (completedEl) completedEl.textContent = stats.completed;
    if (activeEl) activeEl.textContent = stats.active;
}

/**
 * Update filter buttons active state
 * @param {string} filter - Current filter
 */
export function updateFilterButtons(filter) {
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.filter === filter);
    });
}

/**
 * Toggle dark mode
 * @param {boolean} isDark - Whether dark mode is active
 */
export function toggleDarkMode(isDark) {
    document.body.classList.toggle('dark-mode', isDark);
    const themeBtn = document.getElementById('themeToggle');
    if (themeBtn) {
        themeBtn.innerHTML = isDark ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
    }
}

/**
 * Setup drag and drop functionality
 * @param {HTMLElement} container - Task container
 * @param {Function} onReorder - Callback when tasks are reordered
 */
export function setupDragAndDrop(container, onReorder) {
    let draggedItem = null;

    container.addEventListener('dragstart', (e) => {
        if (e.target.classList.contains('taskCard')) {
            draggedItem = e.target;
            e.target.classList.add('dragging');
            e.dataTransfer.effectAllowed = 'move';
        }
    });

    container.addEventListener('dragend', (e) => {
        if (e.target.classList.contains('taskCard')) {
            e.target.classList.remove('dragging');
            draggedItem = null;
        }
    });

    container.addEventListener('dragover', (e) => {
        e.preventDefault();
        const afterElement = getDragAfterElement(container, e.clientY);
        if (draggedItem) {
            if (afterElement == null) {
                container.appendChild(draggedItem);
            } else {
                container.insertBefore(draggedItem, afterElement);
            }
        }
    });

    container.addEventListener('drop', (e) => {
        e.preventDefault();
        const newOrder = Array.from(container.children)
            .filter(card => card.classList.contains('taskCard'))
            .map(card => parseInt(card.getAttribute('data-index')));
        
        if (onReorder && newOrder.length > 0) {
            onReorder(newOrder);
        }
    });
}

function getDragAfterElement(container, y) {
    const draggableElements = [...container.querySelectorAll('.taskCard:not(.dragging)')];

    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        
        if (offset < 0 && offset > closest.offset) {
            return { offset: offset, element: child };
        } else {
            return closest;
        }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
}
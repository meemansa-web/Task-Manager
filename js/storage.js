// Storage module - handles localStorage operations

const STORAGE_KEY = 'tasks';

/**
 * Get all tasks from local storage
 * @returns {Array} Array of task objects
 */
export function getTasks() {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
}

/**
 * Save tasks to local storage
 * @param {Array} tasks - Array of task objects to save
 */
export function saveTasks(tasks) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

/**
 * Add a new task
 * @param {Array} tasks - Current tasks array
 * @param {Object} task - Task object to add
 * @returns {Array} Updated tasks array
 */
export function addTask(tasks, task) {
    return [...tasks, task];
}

/**
 * Delete a task by index
 * @param {Array} tasks - Current tasks array
 * @param {number} index - Index of task to delete
 * @returns {Array} Updated tasks array
 */
export function deleteTask(tasks, index) {
    const newTasks = [...tasks];
    newTasks.splice(index, 1);
    return newTasks;
}

/**
 * Toggle task completion status
 * @param {Array} tasks - Current tasks array
 * @param {number} index - Index of task to toggle
 * @returns {Array} Updated tasks array
 */
export function toggleTaskCompletion(tasks, index) {
    const newTasks = [...tasks];
    newTasks[index] = {
        ...newTasks[index],
        completed: !newTasks[index].completed
    };
    return newTasks;
}

/**
 * Update a task's text
 * @param {Array} tasks - Current tasks array
 * @param {number} index - Index of task to update
 * @param {string} newText - New task text
 * @returns {Array} Updated tasks array
 */
export function updateTask(tasks, index, newText) {
    const newTasks = [...tasks];
    newTasks[index] = {
        ...newTasks[index],
        text: newText.trim()
    };
    return newTasks;
}

/**
 * Reorder tasks (for drag and drop)
 * @param {Array} tasks - Current tasks array
 * @param {number} fromIndex - Source index
 * @param {number} toIndex - Destination index
 * @returns {Array} Updated tasks array
 */
export function reorderTasks(tasks, fromIndex, toIndex) {
    const newTasks = [...tasks];
    const [removed] = newTasks.splice(fromIndex, 1);
    newTasks.splice(toIndex, 0, removed);
    return newTasks;
}

/**
 * Get task statistics
 * @param {Array} tasks - Current tasks array
 * @returns {Object} Statistics object
 */
export function getTaskStats(tasks) {
    return {
        total: tasks.length,
        completed: tasks.filter(t => t.completed).length,
        active: tasks.filter(t => !t.completed).length
    };
}
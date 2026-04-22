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
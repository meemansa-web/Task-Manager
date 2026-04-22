// Main application module
import { getTasks, saveTasks, addTask, deleteTask, toggleTaskCompletion } from './storage.js';
import { renderTasks, showConfirmDialog, hideConfirmDialog, clearInput } from './ui.js';
import { validateTaskInput, createTaskObject, getElements, addEventListeners } from './utils.js';

// Initialize state
let tasks = getTasks();
let indexToBeDeleted = null;

// Get DOM elements
const elements = getElements({
    taskForm: '#taskForm',
    taskInput: '#taskInput',
    taskContainer: '#taskContainer',
    confirmDialog: '.confirm',
    confirmedBtn: '.confirmed',
    cancelledBtn: '.cancel',
    taskManagerContainer: '.taskManager'
});

// Callbacks for task operations
const taskCallbacks = {
    onToggle: (index) => {
        tasks = toggleTaskCompletion(tasks, index);
        saveTasks(tasks);
        renderTasks(elements.taskContainer, tasks, taskCallbacks);
    },
    onDelete: (index) => {
        indexToBeDeleted = index;
        showConfirmDialog(elements.confirmDialog, elements.taskManagerContainer);
    }
};

// Event handlers
function handleFormSubmit(event) {
    event.preventDefault();
    const taskText = elements.taskInput.value;
    
    if (validateTaskInput(taskText)) {
        const newTask = createTaskObject(taskText);
        tasks = addTask(tasks, newTask);
        saveTasks(tasks);
        clearInput(elements.taskInput);
        renderTasks(elements.taskContainer, tasks, taskCallbacks);
    }
}

function handleConfirmDelete() {
    hideConfirmDialog(elements.confirmDialog, elements.taskManagerContainer);
    if (indexToBeDeleted !== null) {
        tasks = deleteTask(tasks, indexToBeDeleted);
        saveTasks(tasks);
        renderTasks(elements.taskContainer, tasks, taskCallbacks);
        indexToBeDeleted = null;
    }
}

function handleCancelDelete() {
    hideConfirmDialog(elements.confirmDialog, elements.taskManagerContainer);
    indexToBeDeleted = null;
}

// Set up event listeners
addEventListeners([
    { element: elements.taskForm, event: 'submit', handler: handleFormSubmit },
    { element: elements.confirmedBtn, event: 'click', handler: handleConfirmDelete },
    { element: elements.cancelledBtn, event: 'click', handler: handleCancelDelete }
]);

// Initial render
renderTasks(elements.taskContainer, tasks, taskCallbacks);
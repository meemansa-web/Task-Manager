// Main application module
import { getTasks, saveTasks, addTask, deleteTask, toggleTaskCompletion, updateTask, reorderTasks, getTaskStats } from './storage.js';
import { renderTasks, showModal, hideModal, clearInput, updateStats, updateFilterButtons, toggleDarkMode, setupDragAndDrop } from './ui.js';
import { validateTaskInput, createTaskObject, getElements, addEventListeners } from './utils.js';

// Initialize state
let tasks = getTasks();
let currentFilter = 'all';
let indexToBeDeleted = null;
let indexToBeEdited = null;

// Get DOM elements
const elements = getElements({
    taskForm: '#taskForm',
    taskInput: '#taskInput',
    taskContainer: '#taskContainer',
    confirmModal: '#confirmModal',
    confirmDelete: '#confirmDelete',
    cancelDelete: '#cancelDelete',
    editModal: '#editModal',
    editInput: '#editInput',
    saveEdit: '#saveEdit',
    cancelEdit: '#cancelEdit',
    themeToggle: '#themeToggle',
    appContainer: '.app-container'
});

// Callbacks for task operations
const taskCallbacks = {
    onToggle: (index) => {
        const realIndex = getRealIndex(index);
        if (realIndex !== -1) {
            tasks = toggleTaskCompletion(tasks, realIndex);
            saveTasks(tasks);
            updateUI();
        }
    },
    onDelete: (index) => {
        const realIndex = getRealIndex(index);
        if (realIndex !== -1) {
            indexToBeDeleted = realIndex;
            showModal(elements.confirmModal);
        }
    },
    onEdit: (index, text) => {
        const realIndex = getRealIndex(index);
        if (realIndex !== -1) {
            indexToBeEdited = realIndex;
            elements.editInput.value = text;
            showModal(elements.editModal);
        }
    }
};

// Get real index from filtered view
function getRealIndex(filteredIndex) {
    const filteredTasks = getFilteredTasks();
    if (filteredIndex >= 0 && filteredIndex < filteredTasks.length) {
        const task = filteredTasks[filteredIndex];
        return tasks.findIndex(t => t.text === task.text && t.completed === task.completed);
    }
    return -1;
}

// Get filtered tasks based on current filter
function getFilteredTasks() {
    switch (currentFilter) {
        case 'active':
            return tasks.filter(t => !t.completed);
        case 'completed':
            return tasks.filter(t => t.completed);
        default:
            return tasks;
    }
}

// Update the entire UI
function updateUI() {
    const filteredTasks = getFilteredTasks();
    renderTasks(elements.taskContainer, filteredTasks, taskCallbacks);
    updateStats(getTaskStats(tasks));
    setupDragAndDrop(elements.taskContainer, handleReorder);
}

// Handle task reordering
function handleReorder(newOrder) {
    const reorderedTasks = newOrder.map(i => tasks[i]);
    tasks = reorderedTasks;
    saveTasks(tasks);
    updateUI();
}

// Event handlers
function handleFormSubmit(event) {
    event.preventDefault();
    const taskText = elements.taskInput.value;
    
    if (validateTaskInput(taskText)) {
        const newTask = createTaskObject(taskText);
        tasks = addTask(tasks, newTask);
        saveTasks(tasks);
        clearInput(elements.taskInput);
        updateUI();
    }
}

function handleConfirmDelete() {
    hideModal(elements.confirmModal);
    if (indexToBeDeleted !== null) {
        tasks = deleteTask(tasks, indexToBeDeleted);
        saveTasks(tasks);
        indexToBeDeleted = null;
        updateUI();
    }
}

function handleCancelDelete() {
    hideModal(elements.confirmModal);
    indexToBeDeleted = null;
}

function handleSaveEdit() {
    const newText = elements.editInput.value.trim();
    if (validateTaskInput(newText) && indexToBeEdited !== null) {
        tasks = updateTask(tasks, indexToBeEdited, newText);
        saveTasks(tasks);
        hideModal(elements.editModal);
        indexToBeEdited = null;
        updateUI();
    }
}

function handleCancelEdit() {
    hideModal(elements.editModal);
    indexToBeEdited = null;
}

function handleFilterClick(event) {
    if (event.target.classList.contains('filter-btn')) {
        currentFilter = event.target.dataset.filter;
        updateFilterButtons(currentFilter);
        updateUI();
    }
}

function handleThemeToggle() {
    const isDark = document.body.classList.toggle('dark-mode');
    localStorage.setItem('darkMode', isDark);
    toggleDarkMode(isDark);
}

// Load dark mode preference
function loadThemePreference() {
    const isDark = localStorage.getItem('darkMode') === 'true';
    if (isDark) {
        document.body.classList.add('dark-mode');
        toggleDarkMode(true);
    }
}

// Set up event listeners
addEventListeners([
    { element: elements.taskForm, event: 'submit', handler: handleFormSubmit },
    { element: elements.confirmDelete, event: 'click', handler: handleConfirmDelete },
    { element: elements.cancelDelete, event: 'click', handler: handleCancelDelete },
    { element: elements.saveEdit, event: 'click', handler: handleSaveEdit },
    { element: elements.cancelEdit, event: 'click', handler: handleCancelEdit },
    { element: elements.themeToggle, event: 'click', handler: handleThemeToggle },
    { element: document.querySelector('.filters'), event: 'click', handler: handleFilterClick }
]);

// Handle Enter key in edit modal
elements.editInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        handleSaveEdit();
    }
});

// Initial render
loadThemePreference();
updateUI();
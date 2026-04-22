// Utils module - Utility functions

/**
 * Validate task input
 * @param {string} text - Task text to validate
 * @returns {boolean} True if valid, false otherwise
 */
export function validateTaskInput(text) {
    return text && text.trim() !== '';
}

/**
 * Create a new task object
 * @param {string} text - Task text
 * @returns {Object} Task object
 */
export function createTaskObject(text) {
    return {
        text: text.trim(),
        completed: false
    };
}

/**
 * Get DOM elements by selectors
 * @param {Object} selectors - Object with selector values
 * @returns {Object} Object with element references
 */
export function getElements(selectors) {
    const elements = {};
    for (const [key, selector] of Object.entries(selectors)) {
        elements[key] = document.querySelector(selector);
    }
    return elements;
}

/**
 * Add event listeners to elements
 * @param {Array} events - Array of event configurations
 */
export function addEventListeners(events) {
    events.forEach(({ element, event, handler }) => {
        if (element) {
            element.addEventListener(event, handler);
        }
    });
}
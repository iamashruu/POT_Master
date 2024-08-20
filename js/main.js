// main.js
import { loadStoredFiles, handleFileInput } from './fileHandler.js';
import { processFiles } from './dataProcessor.js';
import { setupEventListeners } from './uiHandler.js';

window.onload = function () {
    loadStoredFiles();
    setupEventListeners();
};

// Add file input handler
const fileInput = document.getElementById("fileInput");
fileInput.onchange = handleFileInput;

// Add process button click handler
const processButton = document.getElementById("processButton");
processButton.onclick = function () {
    processFiles();
};

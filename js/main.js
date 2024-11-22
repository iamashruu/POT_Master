// main.js
import { loadStoredFiles, handleFileInput } from './fileHandler.js';
import { processFiles } from './dataProcessor.js';
import { setupEventListeners } from './uiHandler.js';
import { loadPreference,setPreference} from './Preference.js';
// let storedPreference = null;
window.onload = function () {
    loadStoredFiles();
    setupEventListeners();
    loadPreference();
};

// Add file input handler
const fileInput = document.getElementById("fileInput");
fileInput.onchange = handleFileInput;

// Add process button click handler
const processButton = document.getElementById("processButton");
processButton.onclick = function () {
    setPreference();
    loadPreference();
    processFiles();
    
};



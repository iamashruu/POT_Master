// fileHandler.js
let files = [];

export function loadStoredFiles() {
    const storedFiles = localStorage.getItem("files");
    if (storedFiles) {
        files = JSON.parse(storedFiles);
        console.log("Files loaded from storage");
    }
}

export function handleFileInput(event) {
    files = event.target.files;
    localStorage.setItem("files", JSON.stringify(files));
}

export function getFiles() {
    return files;
}

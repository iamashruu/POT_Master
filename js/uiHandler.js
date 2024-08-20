// uiHandler.js
export function displayOutput(output) {
    const outputDiv = document.getElementById("output");
    outputDiv.innerHTML = "";
    if (output.length === 0) {
        const notFoundText = document.createTextNode("Sorry, not found! Please check MTIs and RRN.");
        outputDiv.appendChild(notFoundText);
    } else {
        output.forEach((line) => {
            const lineElement = document.createElement("p");
            lineElement.innerHTML = line;
            outputDiv.appendChild(lineElement);
        });
    }
    document.getElementById("copyButton").style.display = output.length > 0 ? "block" : "none";
}

export function setupEventListeners() {
    const copyButton = document.getElementById("copyButton");
    copyButton.onclick = copyToClipboard;
}

function copyToClipboard() {
    const outputDiv = document.getElementById("output");
    const range = document.createRange();
    range.selectNodeContents(outputDiv);
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
    try {
        document.execCommand("copy");
        alert("Results copied to clipboard!");
    } catch (err) {
        alert("Unable to copy to clipboard.");
    }
    selection.removeAllRanges();
}

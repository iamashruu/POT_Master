// uiHandler.js
export function displayOutput(output) {
    const outputDiv = document.getElementById("output");
    outputDiv.innerHTML = "";
    if (output.length === 0) {
        const notFoundText = document.createTextNode("Sorry, not found! Please check MTIs and RRN.");
        outputDiv.appendChild(notFoundText);
    } else {
        output.forEach((line) => {
            // Create a temporary element to easily strip any HTML like &nbsp;
            const tempElement = document.createElement("div");
            tempElement.innerHTML = line;
            
            // Get the text content of the element (this will automatically convert &nbsp; to spaces)
            const plainText = tempElement.innerText.trim();
            
            if (plainText.length === 0) {
                // The line contains only spaces (or is empty), skip it
                console.log('Removing blank or space-only line:', line);
            } else {
                const lineElement = document.createElement("p");
                lineElement.innerHTML = line;
                outputDiv.appendChild(lineElement);
                console.log('Adding valid line:', line);
            }
        });  
    }

     // Flash background color to indicate processing is done
     outputDiv.classList.add('flash');

     // Remove the flash effect after a brief moment
     setTimeout(() => {
         outputDiv.classList.remove('flash');
     }, 1000); // 1.5 seconds

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

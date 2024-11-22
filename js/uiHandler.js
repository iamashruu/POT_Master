// uiHandler.js

document.addEventListener("DOMContentLoaded", () => {
    const displayPreference = document.getElementById("displayPreference");

    // Load preference from local storage on page load
    const storedPreference = localStorage.getItem("displayPreference");
    if (storedPreference !== null) {
        const isChecked = JSON.parse(storedPreference); // Convert stored string back to boolean
        displayPreference.checked = isChecked; // Set the checkbox state
    }

    // Save preference to local storage on change
    displayPreference.addEventListener("change", () => {
        const isChecked = displayPreference.checked; // Get checkbox state
        localStorage.setItem("displayPreference", JSON.stringify(isChecked)); // Save state as a string
    });
});

export function displayOutput(output,rrn,date) {

    
    const outputDiv = document.getElementById("output");
    outputDiv.innerHTML = "";

    if (output.length === 0) {
        const notFoundText = document.createTextNode("Sorry, not found! Please check MTIs and RRN.");
        outputDiv.appendChild(notFoundText);
    } else {
        if (!displayPreference) {
            outputDiv.innerHTML = `<table class="styled-table">
                                <tr>
                                    <td class="label-cell">Date</td>
                                    <td>${date}</td>
                                </tr>
                                <tr>
                                    <td class="label-cell">Test Case</td>
                                    <td> </td>
                                </tr>
                                <tr>
                                    <td class="label-cell">RRN</td>
                                    <td>${rrn}</td>
                                </tr>
                                <tr>
                                    <td class="label-cell">Result</td>
                                    <td>Approved</td>
                                </tr>
                                <tr>
                                    <td class="label-cell">Tested By</td>
                                    <td>Fintech Point</td>
                                </tr>
                            </table>`;
        }else {
            outputDiv.innerHTML = "";
        }
        

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
                // console.log('Adding valid line:', line);
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
        // alert("Results copied to clipboard!");
        // Change button text to "Copied!" for 3 seconds
        const copyButton = document.getElementById("copyButton");
        const originalText = copyButton.textContent;
        copyButton.textContent = "Copied!";
        copyButton.style.backgroundColor = '#126186';
        copyButton.disabled = true; // Disable the button temporarily

        // Revert the button text after 3 seconds
        setTimeout(() => {
            copyButton.textContent = originalText;
            copyButton.style.backgroundColor = '#4caf50';
            copyButton.disabled = false; // Enable the button again
        }, 1500);
    } catch (err) {
        alert("Unable to copy to clipboard.");
    }
    selection.removeAllRanges();
}

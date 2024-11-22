// preference
const displayPreference = document.getElementById("displayPreference");
export let isRemoveTable = false;
export function loadPreference() {
    // Load preference from local storage on page load
    let storedPreference = localStorage.getItem("displayPreference");
    // console.log(storedPreference)
    let isChecked = JSON.parse(storedPreference); // Convert stored string back to boolean
    displayPreference.checked = isChecked; // Set the checkbox state
    isRemoveTable = isChecked
    // console.log(isChecked, 'Preference loaded from local storage');
}

// If no preference is found, use the current checkbox state as default


export function setPreference() {
    let isChecked = displayPreference.checked; // Get the initial checkbox state
    localStorage.setItem("displayPreference", JSON.stringify(isChecked)); // Save state to local storage
    // console.log(isChecked, 'Preference initialized and saved to local storage');
}


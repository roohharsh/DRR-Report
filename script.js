// Function to validate the End Date when the user selects it
function validateEndDate() {
    const startDateInput = document.getElementById("start-date");
    const endDateInput = document.getElementById("end-date");

    const startDate = new Date(startDateInput.value);
    const endDate = new Date(endDateInput.value);

    if (endDate <= startDate) {
        alert("End Date must be greater than Start Date.");
        endDateInput.value = ""; // Clear the End Date input
    }
}

// Function to get the present month and year
function fillMonthYear(element) {
    const currentDate = new Date();
    const month = currentDate.getMonth() + 1; // Month is zero-based
    const year = currentDate.getFullYear();

    element.value = `${month}/${year}`;
}

// Function to add event listener for excluded date input
document.getElementById("excluded-date").addEventListener("change", function() {
    const startDate = new Date(document.getElementById("start-date").value);
    const endDate = new Date(document.getElementById("end-date").value);
    const excludedDate = new Date(this.value);

    if (excludedDate < startDate || excludedDate > endDate) {
        alert("Excluded date must be between the start and end dates.");
        this.value = ""; // Clear the input field
    } else {
        fillDaysInput(document.querySelector(".days-input"));
    }
});

// Function to enable "Excluded Dates" input when "Start Date" and "End Date" are selected
function enableExcludedDateInput() {
    const startDateInput = document.getElementById("start-date");
    const endDateInput = document.getElementById("end-date");
    const excludedDateInput = document.getElementById("excluded-date");

    if (startDateInput.value && endDateInput.value) {
        excludedDateInput.disabled = false;
    } else {
        excludedDateInput.disabled = true;
    }
}

// Add event listeners to "Start Date" and "End Date" inputs
document.getElementById("start-date").addEventListener("change", enableExcludedDateInput);
document.getElementById("end-date").addEventListener("change", enableExcludedDateInput);


// Function to calculate the total number of days
function fillDaysInput(element) {
    const startDate = new Date(document.getElementById("start-date").value);
    const endDate = new Date(document.getElementById("end-date").value);
    const excludedDate = new Date(document.getElementById("excluded-date").value);

    let timeDiff = endDate - startDate;
    let daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24)); // Milliseconds to days

    if (!isNaN(daysDiff) && daysDiff > 0) {
        // Check if the input is valid and there are positive days
        if (!isNaN(excludedDate)) {
            const excludedTime = excludedDate - startDate;
            const excludedDays = Math.floor(excludedTime / (1000 * 60 * 60 * 24));
            daysDiff = daysDiff - 1;
        }
        element.value = daysDiff;
    } else {
        element.value = '';
    }

    // Calculate and display expected lead count as well
    fillExpectedLeadCountInput(document.querySelector(".expected-lead-count-input"));
}

// Function to calculate and display expected lead count
function fillExpectedLeadCountInput(element) {
    const leadCount = parseInt(document.getElementById("lead-count").value);
    const days = parseInt(document.querySelector(".days-input").value);

    if (!isNaN(leadCount) && !isNaN(days) && days > 0) {
        element.value = (leadCount / days).toFixed(2);
    } else {
        element.value = '';
    }
}

// Function to get the current date and time in a specified format
function getCurrentDateTime() {
    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleString();
    return formattedDate;
}

let currentId = 1; // Initialize the current ID

// Function to save data and display it in the next row
function saveData() {
    const table = document.querySelector("table tbody");
    const newRow = document.createElement("tr");
    const startDateInput = document.getElementById("start-date");
    const endDateInput = document.getElementById("end-date");

    // Extract the Start Date and End Date values
    const startDate = new Date(startDateInput.value);
    const endDate = new Date(endDateInput.value);

    // Check if the End Date is greater than the Start Date
    if (endDate <= startDate) {
        alert("End Date must be greater than Start Date.");
        return; // Prevent saving if the constraint is not met
    }

    // Add an 'Id' cell with the current ID
    const idCell = document.createElement("td");
    idCell.textContent = currentId;
    newRow.appendChild(idCell);
    currentId++; // Increment the current ID

    // Extract input values
    const inputs = document.querySelectorAll("input");
    
    let cellIndex = 1; // Start at 1 to account for the 'Id' cell
    for (const input of inputs) {
        if (input.type !== "button") { // Skip buttons
            const cell = document.createElement("td");
            cell.textContent = input.value;
            newRow.appendChild(cell);
            cellIndex++;
        }
    }

    // Add a "Last Updated" cell with the current date and time
    const lastUpdatedCell = document.createElement("td");
    lastUpdatedCell.textContent = getCurrentDateTime();
    newRow.appendChild(lastUpdatedCell);

    // Insert the new row at the top of the table
    if (table.firstChild) {
        table.insertBefore(newRow, table.firstChild);
    } else {
        table.appendChild(newRow);
    }

    // Clear input fields
    inputs.forEach((input) => {
        if (input.type !== "button") {
            input.value = '';
        }
    });
}

// Function to clear input fields when "Cancel" button is clicked
function cancel() {
    const inputs = document.querySelectorAll("input");
    inputs.forEach((input) => {
        if (input.type !== "button") {
            input.value = '';
        }
    })
}

// Add event listeners to your input fields
document.querySelector(".month-input").addEventListener("click", function () {
    fillMonthYear(this);
});

document.querySelector(".days-input").addEventListener("click", function () {
    fillDaysInput(this);
});

document.querySelector(".expected-lead-count-input").addEventListener("click", function () {
    fillExpectedLeadCountInput(this);
});

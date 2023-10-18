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


// Function to enable "Add Excluded Date" input when "Start Date" and "End Date" are selected
function enableExcludedDateInput() {
    const startDateInput = document.getElementById("start-date");
    const endDateInput = document.getElementById("end-date");
    const addExcludedDateInput = document.getElementById("add-excluded-date");

    if (startDateInput.value && endDateInput.value) {
        addExcludedDateInput.disabled = false;
    } else {
        addExcludedDateInput.disabled = true;
    }
}

// Add event listeners to "Start Date" and "End Date" inputs
document.getElementById("start-date").addEventListener("change", enableExcludedDateInput);
document.getElementById("end-date").addEventListener("change", enableExcludedDateInput);

// Function to add excluded date from date input to the text input
function addExcludedDate() {
    const startDate = new Date(document.getElementById("start-date").value);
    const endDate = new Date(document.getElementById("end-date").value);
    const addExcludedDateInput = document.getElementById("add-excluded-date");
    const excludedDatesInput = document.getElementById("excluded-dates");
    const selectedDate = new Date(addExcludedDateInput.value);

    // Ensure the date is not empty and is a valid date
    if (!isNaN(selectedDate)) {
        if (selectedDate >= startDate && selectedDate <= endDate) {
            if (excludedDatesInput.value === "") {
                excludedDatesInput.value = selectedDate.toISOString().split('T')[0];
            } else {
                // Append the selected date to the existing list
                excludedDatesInput.value += `, ${selectedDate.toISOString().split('T')[0]}`;
            }

            // Clear the date input after adding the date
            addExcludedDateInput.value = "";
        } else {
            alert("Excluded date must be between the start and end dates.");
            addExcludedDateInput.value = ""; // Clear the input field
        }
    } else {
        alert("Please select a valid date.");
        addExcludedDateInput.value = ""; // Clear the input field
    }
}

// Function to count the total number of excluded dates
function countExcludedDates() {
    const excludedDatesInput = document.getElementById("excluded-dates");
    const excludedDates = excludedDatesInput.value.split(",");
    return excludedDates.length;
}


// Function to calculate the total number of days
function fillDaysInput(element) {
    const startDate = new Date(document.getElementById("start-date").value);
    const endDate = new Date(document.getElementById("end-date").value);

    let timeDiff = endDate - startDate;
    let daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24)); // Milliseconds to days

    if (!isNaN(daysDiff) && daysDiff > 0) {
        // Check if the input is valid and there are positive days
        if (!isNaN(countExcludedDates())) {
            daysDiff = daysDiff - countExcludedDates();
        }
        element.value = daysDiff + 1;
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

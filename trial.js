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

// Function to clear input fields when "Cancel" button is clicked
function cancel() {
    const inputs = document.querySelectorAll("input");
    inputs.forEach((input) => {
        if (input.type !== "button") {
            input.value = '';
        }
    })
}




// Function to save data using AJAX
function saveData() {
    // Get the values from the input fields
    const startDate = document.getElementById("start-date").value;
    const endDate = document.getElementById("end-date").value;
    const monthYear = document.querySelector(".month-input").value;
    const excludedDate = document.getElementById("excluded-date").value;
    const days = document.querySelector(".days-input").value;
    const leadCount = document.getElementById("lead-count").value;
    const expectedLeadCount = document.querySelector(".expected-lead-count-input").value;

    // Create a JavaScript object to hold the data we want to send
    const data = {
        startDate: startDate,
        endDate: endDate,
        monthYear: monthYear,
        excludedDate: excludedDate,
        days: days,
        leadCount: leadCount,
        expectedLeadCount: expectedLeadCount,
        lastUpdated: getCurrentDateTime(),
    };

    // Create a new XMLHttpRequest object
    const xhr = new XMLHttpRequest();

    // Define the AJAX request method, URL
    xhr.open("POST", "https://reqres.in/api/users");

    // Set the request header for sending data in JSON format
    xhr.setRequestHeader("Content-Type", "application/json");

    // Define the callback function to handle the AJAX response
    xhr.onload = function () {
        if (xhr.status === 201) {
            // Request was successful, we can add the new row to the UI
            const responseData = JSON.parse(xhr.responseText);
            addRowToTable(responseData);

            // Clear input fields after successful submission
            clearInputFields();
        } else {
            // Handle errors or display an error message
            console.error("Error saving data:", xhr.status, xhr.statusText);
        }
    };

    // Convert the data object to a JSON string
    const jsonData = JSON.stringify(data);

    // Send the JSON data in the request body
    xhr.send(jsonData);
}

// Function to add a new row to the table in the UI
function addRowToTable(data) {
    const tableBody = document.querySelector(".drr-table tbody");
    const newRow = tableBody.insertRow();

    newRow.innerHTML = `
        <td>${data.id}</td>
        <td>${data.startDate}</td>
        <td>${data.endDate}</td>
        <td>${data.monthYear}</td>
        <td>${data.excludedDate}</td>
        <td>${data.days}</td>
        <td>${data.leadCount}</td>
        <td>${data.expectedLeadCount}</td>
        <td>${data.lastUpdated}</td>
    `;
}

// Function to clear input fields
function clearInputFields() {
    const inputs = document.querySelectorAll("input");
    inputs.forEach((input) => {
        if (input.type !== "button") {
            input.value = '';
        }
    });
}

// Function to load data using AJAX
function loadData() {
    // Create a new XMLHttpRequest object
    const xhr = new XMLHttpRequest();

    // Define the AJAX request method, URL
    xhr.open("GET", "https://reqres.in/api/users");

    // Define the callback function to handle the AJAX response
    xhr.onload = function () {
        if (xhr.status === 201) {
            // Request was successful, we can add the rows to the UI
            const responseData = JSON.parse(xhr.responseText);
            responseData.data.forEach((item) => {
                addRowToTable(item);3

            });
        } else {
            // Handle errors or display an error message
            console.error("Error loading data:", xhr.status, xhr.statusText);
        }
    };

    // Send the GET request
    xhr.send();
}

// Add an event listener to load data when the page is loaded
window.addEventListener("load", function () {
    loadData();
});




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

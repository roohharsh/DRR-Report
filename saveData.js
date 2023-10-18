let currentId;

window.addEventListener("load", function () {
    // Initialize currentId from localStorage
    currentId = parseInt(localStorage.getItem("currentId")) || 1;
});

// Function to save data and display it in the next row
function saveData() {
    const table = document.querySelector("table tbody");
    const newRow = document.createElement("tr");

    const deleteButton = document.createElement("button");
    deleteButton.innerHTML = '<i class="fas fa-trash"></i>';
    deleteButton.addEventListener("click", function () {
        deleteRow(this);
    });

    const actionCell = document.createElement("td");
    actionCell.appendChild(deleteButton);
    newRow.appendChild(actionCell);

    // Add an 'Id' cell with the current ID
    const idCell = document.createElement("td");
    idCell.textContent = currentId;
    newRow.appendChild(idCell);
    currentId++; // Increment the current ID
    // Save the updated currentId to localStorage
    localStorage.setItem("currentId", currentId);

    // Extract input values
    const inputs = document.querySelectorAll("input");
    
    let cellIndex = 1; // Start at 1 to account for the 'Id' cell
    for (const input of inputs) {
        if (input.type !== "button" && input.id !== "add-excluded-date") { // Skip buttons and add-excluded-date input
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

    // Save the table data to localStorage
    saveDataToLocalStorage();
}

// Function to delete a row
function deleteRow(button) {
    const row = button.parentNode.parentNode;
    row.parentNode.removeChild(row);

    // Update the currentId and save it to localStorage
    currentId--;
    localStorage.setItem("currentId", currentId);

    // Save the table data to localStorage after deleting a row
    saveDataToLocalStorage();
}

// Function to save the table data to localStorage
function saveDataToLocalStorage() {
    const tableRows = document.querySelectorAll("table tbody tr");
    const savedData = [];

    tableRows.forEach((row) => {
        const cells = row.querySelectorAll("td");
        const rowData = [];

        cells.forEach((cell) => {
            rowData.push(cell.textContent);
        });

        savedData.push(rowData);
    });

    localStorage.setItem("tableData", JSON.stringify(savedData));
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

// Function to load saved data from localStorage and populate the table
function loadSavedData() {
    const table = document.querySelector("table tbody");
    const savedData = JSON.parse(localStorage.getItem("tableData"));

    if (savedData) {
        savedData.forEach((rowData) => {
            const newRow = document.createElement("tr");
            rowData.forEach((cellData, index) => {
                const cell = document.createElement("td");
                if (index === 0) { // Check if it's the first cell (Delete button)
                    const deleteButton = document.createElement("button");
                    deleteButton.innerHTML = '<i class="fas fa-trash"></i>';
                    deleteButton.addEventListener("click", function () {
                        deleteRow(this);
                    });
                    cell.appendChild(deleteButton);
                } else {
                    cell.textContent = cellData;
                }
                newRow.appendChild(cell);
            });
            table.appendChild(newRow);
        });
    }
}

// Call the function to load saved data when the page loads
window.addEventListener("load", loadSavedData);

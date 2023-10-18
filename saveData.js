let currentId;

window.addEventListener("load", function () {
    // Initialize currentId from localStorage
    currentId = parseInt(localStorage.getItem("currentId")) || 1;
});

// Function to save data and display it in the next row
function saveData() {
    const table = document.querySelector("table tbody");
    const newRow = document.createElement("tr");

    // Add an 'Edit' button
    const editButton = document.createElement("button");
    editButton.innerHTML = '<i class="fas fa-edit"></i>';
    editButton.addEventListener("click", function () {
        editRow(this);
    });

    // Add an 'Delete' button
    const deleteButton = document.createElement("button");
    deleteButton.innerHTML = '<i class="fas fa-trash"></i>';
    deleteButton.addEventListener("click", function () {
        deleteRow(this);
    });

    const actionCell = document.createElement("td");
    actionCell.classList.add("edit-delete-column");
    actionCell.appendChild(editButton);  // Add the 'Edit' button
    actionCell.appendChild(deleteButton); // Add the 'Delete' button
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

// Function to edit an existing row
function editRow(button) {
    const row = button.parentNode.parentNode;
    const cells = row.querySelectorAll("td");

    // Skip the 'Action' and 'Id' cells, which are not editable
    for (let i = 2; i < cells.length - 1; i++) {
        const input = document.querySelectorAll("input")[i - 2]; // -2 to adjust for the 'Action' and 'Id' cells
        input.value = cells[i].textContent;
    }

    // Remove the current row from the table and save the updated data
    row.parentNode.removeChild(row);
    saveDataToLocalStorage();
}

// Function to delete a row
function deleteRow(button) {
    const row = button.parentNode.parentNode;
    row.parentNode.removeChild(row);

    // Save the table data to localStorage after deleting a row
    saveDataToLocalStorage();
}

// Add event listeners for 'Edit' buttons
document.querySelectorAll("table tbody tr button:first-child").forEach((button) => {
    button.addEventListener("click", function () {
        editRow(this);
    });
});

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

function loadSavedData() {
    const table = document.querySelector("table tbody");
    const savedData = JSON.parse(localStorage.getItem("tableData"));

    if (savedData) {
        savedData.forEach((rowData) => {
            const newRow = document.createElement("tr");
            rowData.forEach((cellData, index) => {
                const cell = document.createElement("td");
                if (index === 0) {
                    const editButton = document.createElement("button");
                    editButton.innerHTML = '<i class="fas fa-edit"></i>';
                    editButton.addEventListener("click", function () {
                        editRow(this);
                    });
                    cell.appendChild(editButton);
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

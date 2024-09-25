const entryForm = document.getElementById("entry-form");
const descriptionInput = document.getElementById("description");
const amountInput = document.getElementById("amount");
const typeInput = document.getElementById("type");
const entryList = document.getElementById("entry-list");
const totalIncome = document.getElementById("total-income");
const totalExpense = document.getElementById("total-expense");
const netBalance = document.getElementById("net-balance");
const filters = document.querySelectorAll('input[name="filter"]');

let entries = JSON.parse(localStorage.getItem("entries")) || [];

function updateTotals() {
    const income = entries
        .filter(entry => entry.type === "income")
        .reduce((sum, entry) => sum + entry.amount, 0);
    const expense = entries
        .filter(entry => entry.type === "expense")
        .reduce((sum, entry) => sum + entry.amount, 0);
    const balance = income - expense;

    totalIncome.textContent = income.toFixed(2);
    totalExpense.textContent = expense.toFixed(2);
    netBalance.textContent = balance.toFixed(2);
}

function displayEntries(filteredEntries = entries) {
    entryList.innerHTML = "";
    filteredEntries.forEach((entry, index) => {
        const li = document.createElement("li");
        li.classList.add(entry.type);
        li.innerHTML = `
            ${entry.description}: $${entry.amount.toFixed(2)}
            <button class="edit" onclick="editEntry(${index})">Edit</button>
            <button class="delete" onclick="deleteEntry(${index})">Delete</button>
        `;
        entryList.appendChild(li);
    });
    updateTotals();
}

function filterEntries() {
    const filter = document.querySelector('input[name="filter"]:checked').value;
    if (filter === "all") {
        displayEntries();
    } else {
        const filtered = entries.filter(entry => entry.type === filter);
        displayEntries(filtered);
    }
}

function addEntry(e) {
    e.preventDefault();

    const newEntry = {
        description: descriptionInput.value,
        amount: parseFloat(amountInput.value),
        type: typeInput.value,
    };

    entries.push(newEntry);
    localStorage.setItem("entries", JSON.stringify(entries));
    filterEntries();
    entryForm.reset();
}

function editEntry(index) {
    const entry = entries[index];
    descriptionInput.value = entry.description;
    amountInput.value = entry.amount;
    typeInput.value = entry.type;
    deleteEntry(index); // Remove the old entry
}

function deleteEntry(index) {
    entries.splice(index, 1);
    localStorage.setItem("entries", JSON.stringify(entries));
    filterEntries();
}

// Event Listeners
entryForm.addEventListener("submit", addEntry);
filters.forEach(filter => filter.addEventListener("change", filterEntries));

// Initial Display
filterEntries();
// ***** SELECT ELEMENTS *******
const advice = document.querySelector('.alert');
const form = document.getElementById('form');
const textItem = form.querySelector('#text-item');
const submitBtn = form.querySelector('#submit-btn');
const list = document.querySelector('.body-table');
const clearBtn = document.querySelector('.clear-items');

// Edit option
let editElement;
let editFlag = false;
let editID = '';

// ******* EVENT LISTENERS ******
// Submit form
form.addEventListener('submit', addItem);

// Clear all items from the list
clearBtn.addEventListener('click', clearItems);

// Click on the list
list.addEventListener('click', dltOrEdit);

// Load the items from the Local Storage
window.addEventListener('DOMContentLoaded', loadLocalStorage);


// ***** FUNCTIONS ******
function addItem(e) {
    e.preventDefault();
    const value = textItem.value;
    const id = new Date().getTime().toString();
    
    if (value && !editFlag) {
        // Create item of the list
        createListItem(id, value);
        
        // Show alert
        showAlert('Item added to the list', 'success');
        
        // Add to local storage
        addToLocalStorage(id, value);
        
        // Set back to default
        setBackToDefault();
        
    } else if (value && editFlag) {
        editElement.innerHTML = textItem.value;
        showAlert('Item edited', 'success');
        
        // Edit local storage
        editLocalStorage(editID, value);
        
        // Set back to default
        setBackToDefault();
        
    } else {
        showAlert('Please, enter a value', 'warning');
    }
}


// Show alert
function showAlert(text, className) {
    advice.textContent = text;
        advice.classList.add(className);
        
    setTimeout(function () {
        advice.textContent = '';
        advice.classList.remove(className);
    }, 1000);
}


// Clear items
function clearItems() {
    // Delete all the items
    while(list.contains(list.firstChild)) {
        list.removeChild(list.firstChild);
    }
    
    // Hide clear items button
    clearBtn.classList.remove('show-clear-items');
    
    showAlert('Empty list', 'warning');
    
    setBackToDefault();
    
    localStorage.removeItem('table-items');
}

// Delete or edit buttons
function dltOrEdit(e) {
    const target = e.target;
    const parent = target.parentElement.parentElement.parentElement;
    
    if (target.classList.contains('fa-trash')) {
        // Delete item
        list.removeChild(parent);
        
        const id = parent.dataset.id;
        
        // If the list does not already have any item
        if (list.children.length === 0) {
            clearBtn.classList.remove('show-clear-items');
            showAlert('Empty list', 'warning');
        } else {
            showAlert('Item removed', 'warning');
        }
        
        // Set back to default
        setBackToDefault();
        
        // Remove from local storage
        removeFromLocalStorage(id);
        
    } else if (target.classList.contains('fa-edit')) {
        // Set edit variables
        editElement = target.parentElement.previousElementSibling;
        editFlag = true;
        editID = parent.dataset.id;
        
        // Set form value
        textItem.value = editElement.innerHTML;
        submitBtn.textContent = 'edit';
    }
}

// Set back to default
function setBackToDefault() {
    textItem.value = '';
    editFlag = false;
    editID = '';
    submitBtn.textContent = 'submit';
}

// ***** LOCAL STORAGE *****
function addToLocalStorage(id, value) {
    // Object that represents an item of the list
    const item = { id, value };
    const arrItems = getLocalStorage();
    // Push the new item into the array
    arrItems.push(item);
    // Set the array of items in the Local Storage
    localStorage.setItem('table-items', JSON.stringify(arrItems));
}

function removeFromLocalStorage(id) {
    // Get the value from the Local Storage
    let arrItems = getLocalStorage();
    
    // Filter the items that does not match with the id
    arrItems = arrItems.filter(item => {
        if (item.id !== id) {
            return item;
        }
    });
    
    // Overwrite value in the Local Storage
    localStorage.setItem('table-items', JSON.stringify(arrItems));
}

function editLocalStorage(id, value) {
    let arrItems = getLocalStorage();
    
    arrItems = arrItems.map(item => {
        if (item.id === id) {
            item.value = value;
        }
        
        return item;
    });
    
    localStorage.setItem('table-items', JSON.stringify(arrItems));
}

function getLocalStorage() {
    // If the key with the array items already exists in Local Storage  or not
    return localStorage.getItem('table-items') ? JSON.parse(localStorage.getItem('table-items')) : [];
}


// ***** SETUP ITEMS *****

// Load items from the LocalStorage
function loadLocalStorage() {
    let arrItems = getLocalStorage();
    
    if (arrItems.length > 0) {
        arrItems.forEach(item => {
            createListItem(item.id, item.value);
        });
    }
}

function createListItem(id, value) {
    // Create and set attribute of unique value
    const attr = document.createAttribute('data-id');
    attr.value = id;
        
    const row = document.createElement('tr');
    row.setAttributeNode(attr);
    row.innerHTML = `<td><span class="title">${value}</span> <span class="icons-span"><i class="far fa-edit icon"></i> <i class="fas fa-trash icon"></i></span></td>`;
        
    // Append child
    list.appendChild(row);
        
    // Show clear items button
    clearBtn.classList.add('show-clear-items');
}
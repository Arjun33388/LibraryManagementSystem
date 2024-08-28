const apiUrl = 'http://localhost:3000/data'; // URL to the Node.js server

let currentAction = '';
let bookData = {}; // Object to store book data

// Load existing book data from server
function loadBookData() {
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            bookData = data;
            updateTable();
        })
        .catch(error => console.error('Error loading data:', error));
}

// Save book data to server
function saveBookData() {
    fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(bookData)
    })
    .then(response => response.text())
    .then(message => console.log(message))
    .catch(error => console.error('Error saving data:', error));
}

// Function to activate the input container based on the button clicked
function activateInput(action) {
    currentAction = action;
    document.getElementById('inputContainer').style.display = 'block';

    // Always show both title and author input fields
    document.getElementById('authorContainer').style.display = 'block';
}

// Function to handle 'Enter' key press for submission
function handleEnter(event) {
    if (event.key === 'Enter') {
        submitData();
    }
}

// Function to submit data based on the current action
function submitData() {
    const title = document.getElementById('bookTitle').value.trim();
    const author = document.getElementById('authorName').value.trim();

    if (!title || !author) {
        alert('Please enter both book title and author name.');
        return;
    }

    if (currentAction === 'addBook') {
        addBookToList(title, author);
    } else if (currentAction === 'checkOutBook') {
        updateBookStatus(title, author, 'Checked Out');
    } else if (currentAction === 'returnBook') {
        updateBookStatus(title, author, 'Available');
    }

    // Clear inputs and hide the container
    document.getElementById('bookTitle').value = '';
    document.getElementById('authorName').value = '';
    document.getElementById('inputContainer').style.display = 'none';

    saveBookData(); // Save data after performing the action
}

// Function to add a book to the list
function addBookToList(title, author) {
    const key = `${title} by ${author}`;
    
    if (!bookData[key]) {
        bookData[key] = {
            title: title,
            author: author,
            status: 'Available',
            totalBooks: 0,
            checkedOutBooks: 0
        };
    }
    
    bookData[key].totalBooks++;
    updateBookStatus(title, author, bookData[key].checkedOutBooks === bookData[key].totalBooks ? 'Unavailable' : 'Available');
}

// Function to update the status of a book
function updateBookStatus(title, author, status) {
    const key = `${title} by ${author}`;
    
    if (bookData[key]) {
        if (status === 'Checked Out') {
            if (bookData[key].totalBooks > bookData[key].checkedOutBooks) {
                bookData[key].checkedOutBooks++;
            }
        } else if (status === 'Available') {
            if (bookData[key].checkedOutBooks > 0) {
                bookData[key].checkedOutBooks--;
            }
        }
        
        bookData[key].status = bookData[key].totalBooks === bookData[key].checkedOutBooks ? 'Unavailable' : 'Available';

        updateTable();
    } else {
        alert('Book not found in the list.');
    }
}

// Function to update the table with current book data
function updateTable() {
    const tableBody = document.getElementById('bookList');
    tableBody.innerHTML = ''; // Clear existing table rows

    let serialNumber = 1;
    for (const key in bookData) {
        const book = bookData[key];
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td>${serialNumber}</td>
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td>${book.status}</td>
            <td>${book.totalBooks}</td>
            <td>${book.checkedOutBooks}</td>
        `;
        
        tableBody.appendChild(row);
        serialNumber++;
    }
}

// Load data on page load
window.onload = function() {
    loadBookData();
};

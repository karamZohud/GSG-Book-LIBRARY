let books = [];
let readingList = [];

// Load books from localStorage
function loadBooks() {
    const storedBooks = localStorage.getItem("books");
    if (storedBooks) {
        books = JSON.parse(storedBooks);
    }

    const storedReadingList = localStorage.getItem("readingList");
    if (storedReadingList) {
        readingList = JSON.parse(storedReadingList);
        renderReadingList();
    }
}

// Save books to localStorage
function saveBooks() {
    localStorage.setItem("books", JSON.stringify(books));
}

// Save reading list to localStorage
function saveReadingList() {
    localStorage.setItem("readingList", JSON.stringify(readingList));
}

// Function to fetch books from Open Library (optional, as we will primarily use local storage)
async function fetchBook(query = "king") {
    const catalog = document.getElementById("book-catalog");
    catalog.innerHTML = `<p>Loading...</p>`; // Show loading message

    try {
        const response = await fetch(`https://openlibrary.org/search.json?q=${query}`);
        const data = await response.json();

        // Extract relevant book details from the response
        books = data.docs.map(book => ({
            title: book.title,
            author: book.author_name ? book.author_name.join(', ') : 'Unknown',
            cover: book.cover_i ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg` : 'placeholder.jpg',
            genre: book.subject ? book.subject.join(', ') : 'N/A',
            first_publish_year: book.first_publish_year || 'N/A',
            key: book.key // This is used for the details page
        }));

        renderBooks();
    } catch (error) {
        console.error("Error fetching books:", error);
        catalog.innerHTML = `<p class="error-message">Failed to load books. Please try again later.</p>`;
    }
}
function toggleReadStatus(index) {
    books[index].read = !books[index].read; // Toggle read status
    saveBooks(); // Save changes to localStorage
    renderBooks(); // Re-render to reflect changes
}
// Function to render the book catalog
function renderBooks() {
    const catalog = document.getElementById("book-catalog");
    catalog.innerHTML = ""; // Clear the catalog

    if (books.length === 0) {
        catalog.innerHTML = `<p class="no-books-message">No books found matching your search criteria.</p>`;
        return;
    }

    const bookNum = books.slice(0, 10); // Limit the number of books displayed

    bookNum.forEach((book, index) => {
        const bookItem = document.createElement("div");
        bookItem.className = "book-item";

        const coverImage = document.createElement("img");
        coverImage.src = book.cover;
        coverImage.alt = `${book.title} Cover`;
        coverImage.style.width = "100px";
        coverImage.style.height = "auto";

        bookItem.appendChild(coverImage);
        bookItem.innerHTML += `
            <h2>${book.title}</h2>
            <p>${book.author}</p>
            <p>First published: ${book.first_publish_year}</p>
            <button onclick="openBookDetails('${book.key}')">More Details</button>
            <button onclick="addToReadingList(${index})">Add to Reading List</button>
            <button onclick="toggleReadStatus(${index})">${book.read ? "Mark as Unread" : "Mark as Read"}</button>

            `;

        catalog.appendChild(bookItem);
    });
}

function openBookDetails(bookKey) {
    window.location.href = `./bookdetails/bookDetails.html?key=${bookKey}`;
}

// Function to add a book to the reading list
function addToReadingList(index) {
    const bookItem = books[index];

    // Avoid duplicate entries in the reading list
    if (!readingList.some(item => item.key === bookItem.key)) {
        readingList.push(bookItem);
        saveReadingList();
        renderReadingList();
    }
}

// Function to render the reading list
function renderReadingList() {
    const readingListContainer = document.getElementById("reading-list-items");
    readingListContainer.innerHTML = ""; // Clear the reading list

    readingList.forEach((book) => {
        const listItem = document.createElement("div");
        listItem.className = "reading-list-item";
        listItem.dataset.key = book.key;
        listItem.innerHTML = `
            <h3>${book.title}</h3>
            <p>${book.author}</p>
            <button onclick="removeFromReadingList('${book.key}')">Remove</button>
        `;
        readingListContainer.appendChild(listItem);
    });
}

// Function to remove a book from the reading list
function removeFromReadingList(bookKey) {
    readingList = readingList.filter(book => book.key !== bookKey);
    saveReadingList();
    renderReadingList();
}

// Function to search for books
document.getElementById("search-button").addEventListener("click", () => {
    const searchInput = document.getElementById("search-input").value.toLowerCase();
    const filteredBooks = books.filter(
        (book) =>
            book.title.toLowerCase().includes(searchInput) ||
            book.author.toLowerCase().includes(searchInput)
    );

    const catalog = document.getElementById("book-catalog");
    catalog.innerHTML = ""; // Clear the catalog

    if (filteredBooks.length === 0) {
        catalog.innerHTML = `<p class="no-books-message">No books match your search criteria.</p>`;
        return;
    }

    filteredBooks.forEach((book, index) => {
        const bookItem = document.createElement("div");
        bookItem.className = "book-item";
        const coverImage = document.createElement("img");
        coverImage.src = book.cover;
        coverImage.alt = `${book.title} Cover`;
        coverImage.style.width = "100px";
        coverImage.style.height = "auto";

        bookItem.appendChild(coverImage);
        bookItem.innerHTML += `
            <h2>${book.title}</h2>
            <p>${book.author}</p>
            
            <p>First published: ${book.first_publish_year}</p>
            <button onclick="toggleReadStatus(${index})">${book.read ? "Mark as Unread" : "Mark as Read"}</button>
            <button onclick="addToReadingList(${index})">Add to Reading List</button>
        `;
        catalog.appendChild(bookItem);
    });
});
document.getElementById("add-button").addEventListener("click", () => {
    const title = document.getElementById("title").value.trim();
    const author = document.getElementById("author").value.trim();
    const genre = document.getElementById("genre").value.trim();
    const cover = document.getElementById("cover").value.trim();

    if (title && author && genre && cover) {
        // Create a new book object
        const newBook = {
            title,
            author,
            genre,
            cover,
            first_publish_year: 'N/A', // You can update this later if needed
            key: `newBook-${Date.now()}` // Unique key for the book
        };

        // Add new book to the books array
        books.push(newBook);
        saveBooks(); // Save updated books array to localStorage
        renderBooks(); // Re-render the book catalog

        // Clear input fields
        document.getElementById("title").value = "";
        document.getElementById("author").value = "";
        document.getElementById("genre").value = "";
        document.getElementById("cover").value = "";
    } else {
        alert("Please fill in all fields.");
    }
});
// Load books and reading list from localStorage on page load
loadBooks();

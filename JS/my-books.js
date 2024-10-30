let books = [];
let readingList = [];
document
  .getElementById("countToDisplay")
  .addEventListener("input", renderBooks);
let loading = false;
// Load books from localStorage
function loadBooks() {
  const catalog = document.getElementById("book-catalog");

  const storedBooks = localStorage.getItem("books");
  console.log(storedBooks);

  if (storedBooks) {
    books = JSON.parse(storedBooks);
    if (books.length > 0) {
      catalog.style.display = "grid";
    }

    renderBooks(); // Render immediately if books are found in localStorage
  } else {
    // Only fetch from API if no books in localStorage
    fetchBook();
  }

  const storedReadingList = localStorage.getItem("readingList");
  if (storedReadingList) {
    readingList = JSON.parse(storedReadingList);
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
  const loading = document.getElementById("loading");
  loading.style.display = "flex";
  try {
    const response = await fetch(
      `https://openlibrary.org/search.json?q=${query}`
    );
    const data = await response.json();
    catalog.style.display = "none";

    // Extract relevant book details from the response
    books = data.docs.map((book) => ({
      title: book.title,
      author: book.author_name ? book.author_name.join(", ") : "Unknown",
      cover: book.cover_i
        ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`
        : "placeholder.jpg",
      genre: book.subject ? book.subject.join(", ") : "N/A",
      first_publish_year: book.first_publish_year || "N/A",
      key: book.key,
    }));

    // Save books to localStorage and render if books were fetched
    if (books.length > 0) {
      catalog.style.display = "grid";

      saveBooks();
      renderBooks();
    } else {
      catalog.style.display = "block";

      catalog.innerHTML = `<p class="no-books-message">No books found matching your search criteria.</p>`;
    }
  } catch (error) {
    console.error("Error fetching books:", error);
    catalog.style.display = "block";
    catalog.innerHTML = `<p class="error-message">Failed to load books. Please try again later.</p>`;
  } finally {
    loading.style.display = "none";
  }
}

// Render books only if they are available in localStorage or after a successful API fetch
async function renderBooks() {
  // Check if there are books in localStorage before fetching
  if (!localStorage.getItem("books") && books.length === 0) {
    await fetchBook();
    return;
  }

  const catalog = document.getElementById("book-catalog");
  catalog.innerHTML = ""; // Clear catalog

  const countInput = document.getElementById("countToDisplay");
  const countToDisplay = parseInt(countInput.value) || books.length;
  const bookNum = books.slice(0, countToDisplay);

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
            <button onclick="openBookDetails('${
              book.key
            }')">More Details</button>
            <button onclick="addToReadingList(${index})">Add to Reading List</button>
            <button onclick="toggleReadStatus(${index})">${
      book.read ? "Mark as Unread" : "Mark as Read"
    }</button>
        `;
    catalog.appendChild(bookItem);
  });
}

function toggleReadStatus(index) {
  books[index].read = !books[index].read; // Toggle read status
  saveBooks(); // Save changes to localStorage
  renderBooks(); // Re-render to reflect changes
}
// Function to render the book catalog

function openBookDetails(bookKey) {
  window.location.href = `../HTML/bookDetails.html?key=${bookKey}`;
}

// Function to add a book to the reading list
function addToReadingList(index) {
  const bookItem = books[index];

  // Avoid duplicate entries in the reading list
  if (!readingList.some((item) => item.key === bookItem.key)) {
    readingList.push(bookItem);
    alert("Book add successfully to Reading List");
    saveReadingList();
  } else alert("Book Already added");
}

// Function to search for books
document.getElementById("search-button").addEventListener("click", () => {
  const searchInput = document
    .getElementById("search-input")
    .value.toLowerCase();
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
          <button onclick="openBookDetails('${book.key}')">More Details</button>

            <button onclick="toggleReadStatus(${index})">${
      book.read ? "Mark as Unread" : "Mark as Read"
    }</button>
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
      first_publish_year: "N/A", // You can update this later if needed
      key: `newBook-${Date.now()}`, // Unique key for the book
    };

    // Add new book to the books array
    books.unshift(newBook);

    saveBooks(); // Save updated books array to localStorage
    alert("New Book Added Successfully");
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
// Load books from localStorage on page load
loadBooks();

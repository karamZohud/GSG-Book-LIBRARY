let readingList = [];

function loadReadingList() {
  const storedReadingList = localStorage.getItem("readingList");
  
  if (storedReadingList) {
    readingList = JSON.parse(storedReadingList);
  }
 
  renderReadingList();
}

function saveReadingList() {
  localStorage.setItem("readingList", JSON.stringify(readingList));
}

// Function to render the reading list
function renderReadingList() {
  const readingListContainer = document.getElementById("reading-list-items");
  readingListContainer.innerHTML = ""; // Clear the reading list
  if (readingList.length === 0) {
    const empty = document.createElement("p");
    empty.textContent = "No books added";
    readingListContainer.appendChild(empty);
    empty.style.backgroundColor = "rgba(255, 255, 255, 0.9)";
  } else {
    readingList.forEach((book) => {
      const listItem = document.createElement("div");
      listItem.className = "reading-list-item";
      listItem.dataset.key = book.key;
      listItem.innerHTML = `
       <img src="${book.cover}" alt="Book cover"/>
          <h3>${book.title}</h3>
          <p>${book.author}</p>
          <button onclick="removeFromReadingList('${book.key}')">Remove</button>
        `;
      readingListContainer.appendChild(listItem);
    });
  }
}

// Function to remove a book from the reading list
function removeFromReadingList(bookKey) {
  readingList = readingList.filter((book) => book.key !== bookKey);
  saveReadingList();
  renderReadingList();
}

loadReadingList();

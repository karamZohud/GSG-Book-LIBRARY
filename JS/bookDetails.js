function getQueryParameter(name) {
    const urlParams = new URLSearchParams(window.location.search);
    console.log(urlParams.getAll);
    
    return urlParams.get(name);
}

// Function to fetch book details using the book key
async function fetchBookDetails(bookKey) {
    const response = await fetch(`https://openlibrary.org${bookKey}.json`);
    const data = await response.json();
    return data;
}

// Function to render book details
function renderBookDetails(book) {
    const detailContainer = document.getElementById('book-detail');

    // Use the first cover ID from the book.covers array if available
    const coverId = book.covers ? book.covers[0] : null;

    detailContainer.innerHTML = `
        <h2>${book.title}</h2>
        <h3>${book.authors ? book.authors.map(author => author.name).join(', ') : 'Unknown'}</h3>
        <img src="${coverId ? `https://covers.openlibrary.org/b/id/${coverId}-L.jpg` : 'placeholder.jpg'}" alt="${book.title} Cover" />
        <p><strong>First Published:</strong> ${book.first_publish_year || 'N/A'}</p>
        <p><strong>Genres:</strong> ${book.subjects ? book.subjects.join(', ') : 'N/A'}</p>
        <p>${book.description ? (book.description.value || book.description) : 'No description available.'}</p>
    `;
}

// Load book details when the page is loaded
window.onload = async () => {
    const bookKey = getQueryParameter('key');
    console.log(bookKey);
    
    const bookDetails = await fetchBookDetails(bookKey);
    console.log(bookDetails);
    
    renderBookDetails(bookDetails);
};
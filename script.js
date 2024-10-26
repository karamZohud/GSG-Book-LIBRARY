// Function to display text letter by letter
function displayTextLetterByLetter(element, text, speed) {
  let i = 0;
  element.textContent = ""; // Clear existing text
  function typeLetter() {
    if (i < text.length) {
      element.textContent += text.charAt(i); // Add each character to the text content
      i++;
      setTimeout(typeLetter, speed); // Wait for 'speed' milliseconds before adding next character
    }
  }
  typeLetter();
}

// Apply the letter-by-letter effect to the hero header on page load
window.addEventListener("load", function () {
  const headerText = document.querySelector(".hero h2"); // Target the header text element
  const textToDisplay = headerText.textContent; // Get the existing text
  const typingSpeed = 150; // Speed in milliseconds between each character

  displayTextLetterByLetter(headerText, textToDisplay, typingSpeed);
});

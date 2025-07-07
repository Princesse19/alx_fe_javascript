let quotes = [
  { text: "Believe in yourself.", category: "Motivation" },
  { text: "Stay strong and never give up.", category: "Inspiration" },
  { text: "Kindness is a powerful force.", category: "Wisdom" }
];

const quoteDisplay = document.getElementById("quoteDisplay");
const newQuoteBtn = document.getElementById("newQuote");

function showRandomQuote() {
  if (quotes.length === 0) {
    quoteDisplay.textContent = "No quotes available.";
    return;
  }
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[randomIndex];
  quoteDisplay.innerHTML = `"${quote.text}" — <strong>${quote.category}</strong>`;
}

function createAddQuoteForm() {
  // Empty function as form is in HTML
}

function addQuote() {
  const textInput = document.getElementById("newQuoteText");
  const categoryInput = document.getElementById("newQuoteCategory");

  const newText = textInput.value.trim();
  const newCategory = categoryInput.value.trim();

  if (newText === "" || newCategory === "") {
    alert("Please fill in both fields.");
    return;
  }

  // Add new quote to array
  quotes.push({ text: newText, category: newCategory });

  // Create a new paragraph element for the new quote
  const newQuoteElem = document.createElement("p");
  newQuoteElem.textContent = `"${newText}" — ${newCategory}`;

  // Append the new quote to the quoteDisplay area
  quoteDisplay.appendChild(newQuoteElem);

  // Clear input fields
  textInput.value = "";
  categoryInput.value = "";

  alert("New quote added!");
}

newQuoteBtn.addEventListener("click", showRandomQuote);


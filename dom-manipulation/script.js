let quotes = [
  { text: "Believe in yourself.", category: "Motivation" },
  { text: "Stay strong and never give up.", category: "Inspiration" },
  { text: "Kindness is a powerful force.", category: "Wisdom" }
];

const quoteDisplay = document.getElementById("quoteDisplay");
const newQuoteBtn = document.getElementById("newQuote");

// Load quotes from local storage if available
function loadQuotes() {
  const storedQuotes = localStorage.getItem("quotes");
  if (storedQuotes) {
    quotes = JSON.parse(storedQuotes);
  }
}

// Save quotes to local storage
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

// Show a random quote
function showRandomQuote() {
  if (quotes.length === 0) {
    quoteDisplay.textContent = "No quotes available.";
    return;
  }

  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[randomIndex];
  quoteDisplay.innerHTML = `"${quote.text}" — <strong>${quote.category}</strong>`;

  // Save last quote in session storage
  sessionStorage.setItem("lastQuote", `"${quote.text}" — ${quote.category}`);
}

// Empty function as required
function createAddQuoteForm() {}

// Add a new quote and show it on the page
function addQuote() {
  const textInput = document.getElementById("newQuoteText");
  const categoryInput = document.getElementById("newQuoteCategory");

  const newText = textInput.value.trim();
  const newCategory = categoryInput.value.trim();

  if (newText === "" || newCategory === "") {
    alert("Please fill in both fields.");
    return;
  }

  quotes.push({ text: newText, category: newCategory });
  saveQuotes();

  const newQuoteElem = document.createElement("p");
  newQuoteElem.textContent = `"${newText}" — ${newCategory}`;
  quoteDisplay.appendChild(newQuoteElem);

  textInput.value = "";
  categoryInput.value = "";

  alert("New quote added!");
}

// Export quotes as a downloadable JSON file
function exportQuotesToJson() {
  const dataStr = JSON.stringify(quotes, null, 2);
  const blob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "quotes.json";
  a.click();

  URL.revokeObjectURL(url);
}

// Import quotes from uploaded JSON file
function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function(event) {
    const importedQuotes = JSON.parse(event.target.result);
    quotes.push(...importedQuotes);
    saveQuotes();
    alert('Quotes imported successfully!');
  };
  fileReader.readAsText(event.target.files[0]);
}

// Event listener for the "Show New Quote" button
newQuoteBtn.addEventListener("click", showRandomQuote);

// Load quotes and last viewed quote when the page starts
loadQuotes();
quoteDisplay.textContent = sessionStorage.getItem("lastQuote") || "Click the button to see a quote.";

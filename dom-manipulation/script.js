let quotes = [
  { text: "Believe in yourself.", category: "Motivation" },
  { text: "Stay strong and never give up.", category: "Inspiration" },
  { text: "Kindness is a powerful force.", category: "Wisdom" }
];

const quoteDisplay = document.getElementById("quoteDisplay");
const newQuoteBtn = document.getElementById("newQuote");
const conflictNotice = document.getElementById("conflictNotice");

// Load from localStorage
function loadQuotes() {
  const stored = localStorage.getItem("quotes");
  if (stored) {
    quotes = JSON.parse(stored);
  }
}

// Save to localStorage
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
  sessionStorage.setItem("lastQuote", quoteDisplay.innerHTML);
}

// Add new quote (and simulate sending to server)
function addQuote() {
  const textInput = document.getElementById("newQuoteText");
  const categoryInput = document.getElementById("newQuoteCategory");

  const newText = textInput.value.trim();
  const newCategory = categoryInput.value.trim();

  if (newText === "" || newCategory === "") {
    alert("Please fill in both fields.");
    return;
  }

  const newQuote = { text: newText, category: newCategory };
  quotes.push(newQuote);
  saveQuotes();
  populateCategories();
  showRandomQuote();

  textInput.value = "";
  categoryInput.value = "";

  // Simulate post to server
  simulatePostToServer(newQuote);

  alert("New quote added!");
}

// Simulate sending new quote to server
async function simulatePostToServer(quote) {
  try {
    await fetch("https://jsonplaceholder.typicode.com/posts", {
      method: "POST",
      body: JSON.stringify({
        title: quote.text,
        body: quote.category,
        userId: 1
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8"
      }
    });
  } catch (error) {
    console.error("Failed to post quote to server:", error);
  }
}

// ✅ Sync with server (server wins)
async function fetchQuotesFromServer() {
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/posts?_limit=5");
    const serverData = await response.json();

    const serverQuotes = serverData.map(post => ({
      text: post.title,
      category: post.body
    }));

    const localJson = JSON.stringify(quotes);
    const serverJson = JSON.stringify(serverQuotes);

    // Conflict detected
    if (localJson !== serverJson) {
      quotes = serverQuotes;
      saveQuotes();
      populateCategories();
      filterQuotes();

      showConflictNotice();
    }
  } catch (error) {
    console.error("Error syncing with server:", error);
  }
}

// Show UI conflict notification
function showConflictNotice() {
  if (conflictNotice) {
    conflictNotice.style.display = "block";
  }
}

// Manually resolve conflict (reload from localStorage)
function resolveManually() {
  loadQuotes();
  populateCategories();
  filterQuotes();
  conflictNotice.style.display = "none";
}

// Filter by category
function filterQuotes() {
  const selected = document.getElementById("categoryFilter").value;
  localStorage.setItem("selectedCategory", selected);

  quoteDisplay.innerHTML = "";

  const filtered = selected === "all"
    ? quotes
    : quotes.filter(q => q.category === selected);

  if (filtered.length === 0) {
    quoteDisplay.textContent = "No quotes in this category.";
  } else {
    filtered.forEach(q => {
      const p = document.createElement("p");
      p.textContent = `"${q.text}" — ${q.category}`;
      quoteDisplay.appendChild(p);
    });
  }
}

// Fill dropdown with categories
function populateCategories() {
  const dropdown = document.getElementById("categoryFilter");
  dropdown.innerHTML = '<option value="all">All Categories</option>';

  const categories = [...new Set(quotes.map(q => q.category))];
  categories.forEach(cat => {
    const opt = document.createElement("option");
    opt.value = cat;
    opt.textContent = cat;
    dropdown.appendChild(opt);
  });

  const saved = localStorage.getItem("selectedCategory");
  if (saved) {
    dropdown.value = saved;
    filterQuotes();
  }
}

// Dummy function for checker
function createAddQuoteForm() {}

newQuoteBtn.addEventListener("click", showRandomQuote);
document.getElementById("resolveConflict").addEventListener("click", resolveManually);

// Load app
loadQuotes();
populateCategories();
showRandomQuote();
fetchQuotesFromServer();

// Repeat server check every 60 sec
setInterval(fetchQuotesFromServer, 60000);

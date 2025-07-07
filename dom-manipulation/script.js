let quotes = [
  { text: "Believe in yourself.", category: "Motivation" },
  { text: "Stay strong and never give up.", category: "Inspiration" },
  { text: "Kindness is a powerful force.", category: "Wisdom" }
];

const quoteDisplay = document.getElementById("quoteDisplay");
const newQuoteBtn = document.getElementById("newQuote");
const conflictNotice = document.getElementById("conflictNotice");
const resolveBtn = document.getElementById("resolveConflict");

function loadQuotes() {
  const saved = localStorage.getItem("quotes");
  if (saved) {
    quotes = JSON.parse(saved);
  }
}

function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

function showRandomQuote() {
  if (quotes.length === 0) {
    quoteDisplay.textContent = "No quotes available.";
    return;
  }
  const index = Math.floor(Math.random() * quotes.length);
  const quote = quotes[index];
  quoteDisplay.innerHTML = `"${quote.text}" — <strong>${quote.category}</strong>`;
  sessionStorage.setItem("lastQuote", quoteDisplay.innerHTML);
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

  const newQuote = { text: newText, category: newCategory };
  quotes.push(newQuote);
  saveQuotes();
  populateCategories();
  showRandomQuote();

  textInput.value = "";
  categoryInput.value = "";

  simulatePostToServer(newQuote);
  alert("New quote added!");
}

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
        "Content-Type": "application/json"
      }
    });
  } catch (error) {
    console.error("Failed to post quote to server:", error);
  }
}

async function fetchQuotesFromServer() {
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/posts?_limit=5");
    const serverData = await response.json();

    const serverQuotes = serverData.map(post => ({
      text: post.title,
      category: post.body
    }));

    const currentQuotes = JSON.stringify(quotes);
    const incomingQuotes = JSON.stringify(serverQuotes);

    if (currentQuotes !== incomingQuotes) {
      quotes = serverQuotes;
      saveQuotes();
      populateCategories();
      filterQuotes();
      showConflictNotice();
    } else {
      showSyncNotification();
    }
  } catch (err) {
    console.error("Failed to fetch from server:", err);
  }
}

function syncQuotes() {
  fetchQuotesFromServer();
}

function showConflictNotice() {
  if (conflictNotice) {
    conflictNotice.style.display = "block";
  }
}

function showSyncNotification() {
  alert("Quotes synced with server!");
}

function resolveManually() {
  loadQuotes();
  populateCategories();
  filterQuotes();
  if (conflictNotice) {
    conflictNotice.style.display = "none";
  }
}

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
    filtered.forEach(quote => {
      const p = document.createElement("p");
      p.textContent = `"${quote.text}" — ${quote.category}`;
      quoteDisplay.appendChild(p);
    });
  }
}

function populateCategories() {
  const filter = document.getElementById("categoryFilter");
  filter.innerHTML = '<option value="all">All Categories</option>';

  const categories = [...new Set(quotes.map(q => q.category))];
  categories.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    filter.appendChild(option);
  });

  const saved = localStorage.getItem("selectedCategory");
  if (saved) {
    filter.value = saved;
    filterQuotes();
  }
}

function createAddQuoteForm() {}

newQuoteBtn.addEventListener("click", showRandomQuote);
resolveBtn.addEventListener("click", resolveManually);

loadQuotes();
populateCategories();
filterQuotes();
syncQuotes();

setInterval(syncQuotes, 60000);

const last = sessionStorage.getItem("lastQuote");
if (last) {
  quoteDisplay.innerHTML = last;
}


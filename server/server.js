const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3001;

const DB_PATH = path.join(__dirname, "books.json");

function readBooks() {
  return JSON.parse(fs.readFileSync(DB_PATH, "utf-8"));
}

function writeBooks(books) {
  fs.writeFileSync(DB_PATH, JSON.stringify(books, null, 2));
}

app.use(cors());
app.use(express.json());app.get("/api/books", (req, res) => {
  res.json(readBooks());
});

app.get("/api/books/:id", (req, res) => {
  const books = readBooks();
  const book = books.find((b) => b.id === Number(req.params.id));
  if (!book) return res.status(404).json({ message: "Book not found" });
  res.json(book);
});

app.post("/api/books", (req, res) => {
  const { title, author, price, description, excerpt, year, cover, genre } = req.body;

  if (!title || !author || price === undefined) {
    return res.status(400).json({ message: "title, author and price are required" });
  }

  const books = readBooks();

  const newId = books.length ? Math.max(...books.map((b) => b.id)) + 1 : 1;

  const newBook = {
    id: newId,
    title,
    author,
    price: Number(price),
    year: year || "",
    cover: cover || "",
    genre: genre || "",
    description: description || "",
    excerpt: excerpt || "",
  };
  books.push(newBook);
  writeBooks(books);

  res.status(201).json(newBook);
});

app.put("/api/books/:id", (req, res) => {
  const { price } = req.body;
  const books = readBooks();
  const index = books.findIndex((b) => b.id === Number(req.params.id));
  if (index === -1) return res.status(404).json({ message: "Book not found" });

  books[index] = { ...books[index], ...req.body, id: books[index].id };
  if (price !== undefined) books[index].price = Number(price);
  writeBooks(books);

  res.json(books[index]);
});

app.delete("/api/books/:id", (req, res) => {
  const books = readBooks();
  const exists = books.some((b) => b.id === Number(req.params.id));
  if (!exists) return res.status(404).json({ message: "Book not found" });

  const remaining = books.filter((b) => b.id !== Number(req.params.id));
  writeBooks(remaining);

  res.json({ message: "Book deleted" });
});

app.use(express.static(path.join(__dirname, "public")));

app.use((req, res) => {
  if (req.path.startsWith("/api")) {
    return res.status(404).json({ message: "Route not found" });
  }
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => {
  console.log(`✅ Server running: http://localhost:${PORT}`);
});
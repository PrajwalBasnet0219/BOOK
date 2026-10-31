const BASE_URL = import.meta.env.DEV
  ? "http://localhost:3001/api/books"
  : "/api/books";

export async function getBooks() {
  const res = await fetch(BASE_URL);
  if (!res.ok) throw new Error("Failed to load books");
  return res.json();
}

export async function addBook(book) {
  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(book),
  });
  if (!res.ok) throw new Error("Failed to add book");
  return res.json();
}

export async function updateBook(id, book) {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(book),
  });
  if (!res.ok) throw new Error("Failed to update book");
  return res.json();
}

export async function deleteBook(id) {
  const res = await fetch(`${BASE_URL}/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete book");
}

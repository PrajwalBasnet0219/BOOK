export interface Book {
  id: number;
  title: string;
  author: string;
  price: number;
  year?: number;
  genre?: string;
  cover?: string;
  description?: string;
  excerpt?: string;
}

const BASE_URL = import.meta.env.DEV
  ? "http://localhost:3001/api/books"
  : "/api/books";

export async function getBooks(): Promise<Book[]> {
  const res = await fetch(BASE_URL);
  if (!res.ok) throw new Error("Failed to load books");
  return res.json() as Promise<Book[]>;
}

export async function addBook(book: Omit<Book, "id">): Promise<Book> {
  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(book),
  });
  if (!res.ok) throw new Error("Failed to add book");
  return res.json() as Promise<Book>;
}

export async function updateBook(id: number, book: Partial<Book>): Promise<Book> {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(book),
  });
  if (!res.ok) throw new Error("Failed to update book");
  return res.json() as Promise<Book>;
}

export async function deleteBook(id: number): Promise<void> {
  const res = await fetch(`${BASE_URL}/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete book");
}

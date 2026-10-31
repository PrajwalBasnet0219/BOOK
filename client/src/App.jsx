import { useEffect, useState } from "react";
import { getBooks, addBook, updateBook, deleteBook } from "./api.js";
import Preview from "./Preview.jsx";

const EMPTY_FORM = { title: "", author: "", price: "", description: "", excerpt: "" };
const TAPE_COLORS = ["#e07a5f", "#3d5a80", "#81b29a", "#f2cc8f", "#9b5de5", "#e63946"];

function tapeColor(id) {
  return TAPE_COLORS[id % TAPE_COLORS.length];
}

function tapeCSSVar(id) {
  return { "--tape": tapeColor(id) };
}

function Pin({ light }) {
  return <span className={`pin ${light ? "pin-light" : ""}`} aria-hidden="true" />;
}

function Paperclip({ flip }) {
  return <span className={`paperclip ${flip ? "flip" : ""}`} aria-hidden="true" />;
}

function Doodles() {
  return (
    <svg className="doodles" viewBox="0 0 120 60" aria-hidden="true">
      <path d="M4 42 C 14 18, 26 18, 34 40 M 22 24 l -5 4 M 22 24 l 2 6" />
      <path d="M58 34 l 40 -6 M 84 18 l 14 10 l -14 10" fill="none" />
      <path d="M100 12 l 3 6 l -6 3 z" fill="none" />
    </svg>
  );
}

export default function App() {
  const [books, setBooks] = useState([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [previewBook, setPreviewBook] = useState(null);

  useEffect(() => {
    loadBooks();
    const onKey = (e) => {
      if (e.key === "Escape") setPreviewBook(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  async function loadBooks() {
    try {
      setLoading(true);
      setBooks(await getBooks());
      setError("");
    } catch {
      setError("The server is not answering… try: cd server && npm start");
    } finally {
      setLoading(false);
    }
  }

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      if (editingId === null) {
        await addBook(form);
      } else {
        await updateBook(editingId, form);
      }
      setForm(EMPTY_FORM);
      setEditingId(null);
      await loadBooks();
    } catch {
      setError("Something went wrong. Check the server.");
    }
  }

  function startEdit(book) {
    setForm({
      title: book.title,
      author: book.author,
      price: book.price,
      description: book.description || "",
      excerpt: book.excerpt || "",
    });
    setEditingId(book.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function cancelEdit() {
    setForm(EMPTY_FORM);
    setEditingId(null);
  }

  async function handleDelete(id) {
    try {
      await deleteBook(id);
      await loadBooks();
    } catch {
      setError("Failed to delete book.");
    }
  }

  const total = books.reduce((sum, b) => sum + Number(b.price || 0), 0);

  return (
    <div className="desk">
      <span className="coffee-stain" aria-hidden="true" />
      <span className="coffee-stain stain-two" aria-hidden="true" />

      <header className="board-header">
        <h1 className="ransom" aria-label="Book Store">
          {"BOOK STORE".split("").map((ch, i) =>
            ch === " " ? (
              <span key={i} className="ransom-gap" />
            ) : (
              <span key={i} className="ransom-letter" style={tapeCSSVar(i + 1)}>
                {ch}
              </span>
            )
          )}
        </h1>
        <p className="tagline">vibes &amp; paperbacks — est. 2026</p>

        <span className="badge-open">
          <span className="badge-ring">OPEN</span>
        </span>

        <Doodles />
      </header>

      {error && <div className="sticky-note error-note">{error}</div>}

      <section className="add-section">
        <form
          className={editingId !== null ? "catalog-card is-editing" : "catalog-card"}
          onSubmit={handleSubmit}
        >
          <span className="punch punch-left" aria-hidden="true" />
          <span className="punch punch-right" aria-hidden="true" />
          {(editingId !== null) && (
            <span className="correction-slip">amended ✓</span>
          )}

          <header className="catalog-head">
            <div className="catalog-title-row">
              <h2 className="catalog-title">
                {(editingId === null) ? "NEW ENTRY" : "AMENDED ENTRY"}
              </h2>
              <span className="entry-no">no. {(editingId ?? books.length + 1)}</span>
            </div>
            <p className="catalog-sub">GRITFEAT PUBLIC LIBRARY · ACQUISITIONS DESK</p>
          </header>

          <div className="catalog-fields">
            <label className="cfield wide">
              <span>Title of work</span>
              <input
                name="title"
                placeholder="e.g. The Little Prince"
                value={form.title}
                onChange={handleChange}
                required
              />
            </label>

            <label className="cfield">
              <span>Author</span>
              <input
                name="author"
                placeholder="e.g. Antoine de Saint-Exupéry"
                value={form.author}
                onChange={handleChange}
                required
              />
            </label>

            <label className="cfield">
              <span>Price ($)</span>
              <input
                name="price"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                value={form.price}
                onChange={handleChange}
                required
              />
            </label>

            <label className="cfield wide">
              <span>Description</span>
              <textarea
                name="description"
                rows="3"
                placeholder="What is this book about?"
                value={form.description}
                onChange={handleChange}
              />
            </label>

            <label className="cfield wide">
              <span>First page — opening lines</span>
              <textarea
                name="excerpt"
                rows="3"
                placeholder="Write the first lines a reader would see…"
                value={form.excerpt}
                onChange={handleChange}
              />
            </label>
          </div>

          <div className="catalog-foot">
            <button type="submit" className="stamp-btn green">
              {(editingId === null) ? "STAMP ENTRY" : "APPROVE FIX"}
            </button>
            {(editingId !== null) && (
              <button type="button" className="stamp-btn red" onClick={cancelEdit}>
                TEAR OFF
              </button>
            )}
          </div>
        </form>

        <div className="due-note" aria-hidden="true">
          <span className="stamp-text">DUE BACK<br />NEVER</span>
        </div>
      </section>

      <section className="wall">
        <div className="wall-title">
          <span className="washi washi-small first" aria-hidden="true" />
          <h2 className="wall-heading" aria-hidden="true">
            THE BOOK WALL
          </h2>
          <p className="wall-sub">
            {books.length} books on display · total ${total.toFixed(2)}
          </p>
        </div>

        {loading ? (
          <p className="idle-note">sticking the photos on… ⏳</p>
        ) : books.length === 0 ? (
          <div className="empty-slot">
            <div className="empty-pocket">your first photo goes here</div>
            <p className="idle-note">the wall is lonely — add a book above ⬆</p>
          </div>
        ) : (
          <div className="polaroids">
            {books.map((book, idx) => (
              <article
                key={book.id}
                className="polaroid"
                style={{ ...tapeCSSVar(book.id), "--tilt": `${((idx % 3) - 1) * 1.6}deg` }}
              >
                <span className="washi" aria-hidden="true" />
                {idx % 2 === 1 && <Paperclip flip />}
                <div className="photo" onClick={() => setPreviewBook(book)}>
                  <span className="spine" aria-hidden="true" />
                  <span className="photo-heading">{book.title}</span>
                  <span className="photo-author">by {book.author}</span>
                  <span className="photo-book-emoji">📖</span>
                  <span className="peek-hint" aria-hidden="true">peek inside 👀</span>
                </div>
                <div className="caption">
                  <p className="caption-title">{book.title}</p>
                  <p className="caption-author">by {book.author}</p>
                  <div className="price-tag">
                    <span className="tag-hole" aria-hidden="true" />
                    <span className="tag-price">${Number(book.price).toFixed(2)}</span>
                  </div>
                  <div className="photo-buttons">
                    <button className="chip" onClick={() => startEdit(book)}>
                      edit ✎
                    </button>
                    <button className="chip danger" onClick={() => handleDelete(book.id)}>
                      cut ✂
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <footer className="footer">
        <span className="washi washi-small last" aria-hidden="true" />
        end of the wall — thanks for flipping through · ♡
      </footer>

      <Preview book={previewBook} onClose={() => setPreviewBook(null)} />
    </div>
  );
}

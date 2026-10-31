import { useEffect, useState } from "react";
import { getBooks, addBook, updateBook, deleteBook } from "./api.js";
import Preview from "./Preview.jsx";

const EMPTY_FORM = { title: "", author: "", price: "", description: "", excerpt: "" };

const TAPE_COLORS = ["#e07a5f", "#3d5a80", "#81b29a", "#f2cc8f", "#9b5de5", "#e63946"];
const GENRES = ["All", "Fantasy", "Romance", "Classic", "Light Novel"];

function tapeColor(id) {
  return TAPE_COLORS[id % TAPE_COLORS.length];
}

function tapeCSSVar(id) {
  return { "--tape": tapeColor(id) };
}

function Washi({ className = "", style = {}, small = false }) {
  return (
    <span
      className={`washi ${small ? "washi-sm" : ""} ${className}`}
      style={style}
      aria-hidden="true"
    />
  );
}

const chip = (active) =>
  `px-4 py-1.5 rounded-full border font-hand text-sm sm:text-base transition-all duration-150 cursor-pointer ${
    active
      ? "bg-blush border-blush text-white shadow-[0_3px_10px_rgba(255,79,110,0.35)]"
      : "border-blush/50 text-dim hover:border-blush hover:text-paper"
  }`;

export default function App() {
  const [books, setBooks] = useState([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [previewBook, setPreviewBook] = useState(null);
  const [genre, setGenre] = useState("All");

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

  const visible =
    genre === "All"
      ? books
      : books.filter((b) => (b.genre || "").toLowerCase() === genre.toLowerCase());
  const total = visible.reduce((sum, b) => sum + Number(b.price || 0), 0);

  return (
    <div className="relative max-w-[1060px] mx-auto px-5 pb-20 overflow-x-clip">
      <div className="pointer-events-none absolute -top-40 -left-44 size-[560px] rounded-full bg-[radial-gradient(closest-side,rgba(255,79,110,0.16),transparent_70%)]" />
      <div className="pointer-events-none absolute -bottom-24 -right-52 size-[640px] rounded-full bg-[radial-gradient(closest-side,rgba(214,51,82,0.12),transparent_70%)]" />

      <header className="relative flex items-center gap-5 py-4 border-b border-blush/25">
        <span className="font-big font-bold text-3xl text-paper">
          Paperbäck<span className="text-blush">.</span>shop
        </span>
        <nav className="ml-auto flex items-center gap-5">
          <a href="#wall" className="font-big text-xl text-dim hover:text-blush">
            the wall
          </a>
          <a href="#desk" className="font-big text-xl text-dim hover:text-blush">
            acquisitions
          </a>
          <span className="text-blush text-sm">♡</span>
        </nav>
        <span className="border-2 border-blush text-blush font-stamp text-[11px] tracking-[2px] px-2.5 py-1 rotate-3">
          OPEN
        </span>
      </header>

      {error && (
        <div className="max-w-[560px] mx-auto mt-4 -rotate-[1.2deg] relative px-4 py-3 pl-12 bg-gradient-to-b from-[#fff9b1] to-[#f7e98f] text-[#7c2d1e] shadow-[2px_4px_10px_rgba(0,0,0,0.4)]">
          <span className="absolute left-4 text-xl" aria-hidden="true">
            ⚠
          </span>
          {error}
        </div>
      )}

      <section className="relative grid md:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] gap-8 items-center py-14">
        <Washi style={{ left: 6, transform: "rotate(-4deg)" }} />
        <h1 className="font-big font-medium text-[clamp(40px,7.5vw,74px)] leading-[1.02] text-paper">
          B<em className="italic text-blush">rowse</em> every last
          <br />
          <strong className="font-bold text-white">BOOK</strong> on the{" "}
          <strong className="font-bold text-white">WALL</strong>
        </h1>
        <p className="mt-4 mb-7 max-w-[46ch] text-dim text-base italic">
          cut from paper · pinned with love · read by torchlight — our whole scrapbook of
          stories opens itself on one click
        </p>

        <a
          href="#wall"
          className="inline-block w-max px-6 py-3 rounded-full bg-gradient-to-b from-blush to-blushdeep text-white shadow-[3px_5px_0_rgba(0,0,0,0.35)] hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_2px_0_rgba(0,0,0,0.35)] transition-transform"
        >
          start reading <span aria-hidden="true">→</span>
        </a>
        <figure className="relative justify-self-center w-[210px] p-2.5 pb-3.5 bg-paper shadow-[4px_8px_22px_rgba(0,0,0,0.55)] rotate-3 m-0">
          <Washi small style={{ left: "50%", marginLeft: "-44px" }} />
          <img
            src={books[0]?.cover || "/covers/harrypotter.jpg"}
            alt=""
            className="block w-full aspect-[2/3] object-cover"
          />
        </figure>
      </section>

      <section className="relative flex flex-wrap justify-center gap-2.5 py-1.5 pb-9" aria-label="filter by genre">
        {GENRES.map((g) => (
          <button key={g} className={chip(genre === g)} onClick={() => setGenre(g)}>
            {g}
          </button>
        ))}
      </section>

      <section id="wall" className="relative pb-5">
        <div className="text-center mb-8">
          <h2 className="font-big font-bold text-[clamp(30px,5vw,44px)] text-white m-0">
            Paperbäck<em className="font-medium italic text-blush">&rsquo;s Categories</em>
          </h2>
          <p className="mt-1.5 text-[15px] text-dim italic">
            {visible.length} books on the shelf · {genre !== "All" ? `${genre} · ` : ""}total
            ${total.toFixed(2)}
          </p>
        </div>

        {loading ? (
          <p className="text-center text-dim text-lg">sticking the photos on… ⏳</p>
        ) : visible.length === 0 ? (
          <div className="text-center">
            <div className="inline-grid place-items-center w-[220px] h-[290px] rounded-md border-[3px] border-dashed border-blush/40 bg-blush/[0.04] text-dim text-lg -rotate-2">
              this shelf is empty
            </div>
            <p className="text-center text-dim text-lg mt-4">
              nothing under {genre} yet — stick a new one on the desk ⬆
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-[repeat(auto-fill,minmax(215px,1fr))] gap-x-6 gap-y-8">
            {visible.map((book, idx) => (
              <article
                key={book.id}
                className="polaroid group relative bg-paper border border-white/15 px-3 pt-7 pb-3.5 shadow-[4px_8px_20px_rgba(0,0,0,0.5)]"
                style={{ ...tapeCSSVar(book.id), "--tilt": `${((idx % 4) - 1.5) * 0.9}deg` }}
              >
                <Washi style={{ left: "50%", marginLeft: "-55px", transform: "rotate(-3deg)" }} />
                {book.id === 1 && (
                  <span className="absolute top-5 left-5 z-30 px-2.5 py-0.5 rounded-full bg-blush text-white text-[11px] tracking-wide shadow-[0_3px_8px_rgba(214,51,82,0.45)] -rotate-4">
                    Best Seller
                  </span>
                )}
                <div
                  className="relative aspect-[2/3] grid place-items-center overflow-hidden cursor-pointer bg-card rounded-sm shadow-[inset_0_0_0_1px_rgba(255,255,255,0.12)]"
                  onClick={() => setPreviewBook(book)}
                >
                  {book.cover ? (
                    <img
                      className="absolute inset-0 size-full object-cover transition-transform duration-200 group-hover:scale-[1.04]"
                      src={book.cover}
                      alt={book.title}
                    />
                  ) : (
                    <span className="font-big text-2xl text-white/90 text-center px-3">
                      {book.title}
                    </span>
                  )}
                  <span className="absolute top-2.5 right-2.5 z-20 px-2.5 py-0.5 rounded-full bg-blush/90 text-white text-[11.5px] opacity-0 -translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all pointer-events-none">
                    peek inside 👀
                  </span>
                </div>
                <div className="px-1 pt-3 pb-0.5 text-center">
                  <p className="m-0 font-big font-bold text-[21px] leading-[1.12] text-ink">
                    {book.title}
                  </p>
                  <p className="mt-0.5 mb-2.5 text-sm text-inksoft">
                    by {book.author} · {book.year}
                  </p>
                  <div className="price-tag -rotate-2 mb-3">
                    <span className="tag-hole" aria-hidden="true" />
                    <span className="font-bold">${Number(book.price).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-center gap-2">
                    <button
                      className="px-3 py-1 rounded-full border border-[#b7a98d] bg-[#fdf9ef] text-ink text-[13.5px] font-hand cursor-pointer hover:bg-[#ece2cd]"
                      onClick={() => startEdit(book)}
                    >
                      edit ✎
                    </button>
                    <button
                      className="px-3 py-1 rounded-full border border-[#b7a98d] bg-[#fdf9ef] text-ink text-[13.5px] font-hand cursor-pointer hover:bg-blushdeep hover:border-blushdeep hover:text-white"
                      onClick={() => handleDelete(book.id)}
                    >
                      cut ✂
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <section
        id="desk"
        className="grid md:grid-cols-[minmax(0,1.55fr)_minmax(0,1fr)] gap-7 items-start !mt-14 mb-5"
      >
        <form
          className={`relative rounded-md bg-gradient-to-b from-[#fffef8] to-[#faf3e2] pb-6 shadow-[0_12px_30px_rgba(0,0,0,0.5)] ${
            editingId !== null ? "is-editing" : ""
          }`}
          onSubmit={handleSubmit}
        >
          <span
            className={`absolute top-0 left-0 right-0 h-3 rounded-t-[5px] ${
              editingId !== null
                ? "bg-[repeating-linear-gradient(90deg,#2f6f4f_0_26px,#3d8464_26px_52px)]"
                : "bg-[repeating-linear-gradient(90deg,#9c3d2e_0_26px,#b05544_26px_52px)]"
            }`}
            aria-hidden="true"
          />
          <span
            className="absolute top-6 left-5 size-3 rounded-full bg-[#d9cbb2] shadow-[inset_1px_2px_3px_rgba(0,0,0,0.4)]"
            aria-hidden="true"
          />
          <span
            className="absolute top-6 right-5 size-3 rounded-full bg-[#d9cbb2] shadow-[inset_1px_2px_3px_rgba(0,0,0,0.4)]"
            aria-hidden="true"
          />
          {editingId !== null && (
            <span className="absolute top-7 right-10 z-20 px-3 py-1.5 bg-[#fdeaea] border-[1.5px] border-dashed border-[#c0392b] text-[#c0392b] font-stamp text-[11.5px] tracking-[1.5px] rotate-4 shadow-[2px_3px_6px_rgba(0,0,0,0.2)]">
              amended ✓
            </span>
          )}

          <header className="px-6 pt-8 pb-3 border-b-[3px] border-double border-[#9c3d2e]">
            <div className="flex justify-between items-baseline">
              <h2 className="m-0 font-stamp text-[19px] tracking-[3px] text-[#9c3d2e]">
                {editingId === null ? "NEW ENTRY" : "AMENDED ENTRY"}
              </h2>
              <span className="font-big text-[21px] text-inksoft -rotate-3 inline-block">
                no. {editingId ?? books.length + 1}
              </span>
            </div>
            <p className="mt-1 mb-0 font-stamp text-[11px] tracking-[1.6px] text-inksoft">
              GRITFEAT PUBLIC LIBRARY · ACQUISITIONS DESK
            </p>
          </header>

          <div className="px-6 pt-4 pb-1 grid grid-cols-1 sm:grid-cols-2 gap-x-6">
            <label className="block mb-3.5 sm:col-span-2">
              <span className="block mb-1 font-stamp text-[10.5px] tracking-[1.6px] uppercase text-inksoft">
                Title of work
              </span>
              <input
                className="cinput font-hand"
                name="title"
                placeholder="e.g. The Little Prince"
                value={form.title}
                onChange={handleChange}
                required
              />
            </label>

            <label className="block mb-3.5">
              <span className="block mb-1 font-stamp text-[10.5px] tracking-[1.6px] uppercase text-inksoft">
                Author
              </span>
              <input
                className="cinput"
                name="author"
                placeholder="e.g. Antoine de Saint-Exupéry"
                value={form.author}
                onChange={handleChange}
                required
              />
            </label>

            <label className="block mb-3.5">
              <span className="block mb-1 font-stamp text-[10.5px] tracking-[1.6px] uppercase text-inksoft">
                Price ($)
              </span>
              <input
                className="cinput"
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

            <label className="block mb-3.5 sm:col-span-2">
              <span className="block mb-1 font-stamp text-[10.5px] tracking-[1.6px] uppercase text-inksoft">
                Description
              </span>
              <textarea
                className="ctextarea"
                name="description"
                rows="3"
                placeholder="What is this book about?"
                value={form.description}
                onChange={handleChange}
              />
            </label>

            <label className="block mb-3.5 sm:col-span-2">
              <span className="block mb-1 font-stamp text-[10.5px] tracking-[1.6px] uppercase text-inksoft">
                First page — opening lines
              </span>
              <textarea
                className="ctextarea"
                name="excerpt"
                rows="3"
                placeholder="Write the first lines a reader would see…"
                value={form.excerpt}
                onChange={handleChange}
              />
            </label>
          </div>

          <div className="px-6 pt-1.5 flex gap-3.5 justify-end items-center">
            <button
              type="submit"
              className="px-4 py-2.5 border-[3px] border-double border-[#2f6f4f] rounded-md text-[#2f6f4f] font-stamp text-[13.5px] tracking-[2px] -rotate-2 opacity-90 hover:opacity-100 hover:scale-[1.04] active:scale-95 transition-transform cursor-pointer bg-transparent"
            >
              {editingId === null ? "STAMP ENTRY" : "APPROVE FIX"}
            </button>
            {editingId !== null && (
              <button
                type="button"
                className="px-4 py-2.5 border-[3px] border-double border-[#c0392b] rounded-md text-[#c0392b] font-stamp text-[13.5px] tracking-[2px] -rotate-2 opacity-90 hover:opacity-100 hover:scale-[1.04] active:scale-95 transition-transform cursor-pointer bg-transparent"
                onClick={cancelEdit}
              >
                TEAR OFF
              </button>
            )}
          </div>
        </form>

        <div
          className="self-center bg-[repeating-linear-gradient(-45deg,#fff6e3_0,#fff6e3_10px,#f8ecd2_10px,#f8ecd2_20px)] border border-[#d9c194] px-3.5 py-8 text-center shadow-[0_12px_30px_rgba(0,0,0,0.45)] rotate-[2.2deg]"
          aria-hidden="true"
        >
          <span className="inline-block px-4 py-2.5 border-[3px] border-double border-[#c0392b] text-[#c0392b] font-stamp text-xl leading-[1.35] tracking-[2px] opacity-85 -rotate-6 rounded-sm">
            DUE BACK
            <br />
            NEVER
          </span>
        </div>
      </section>

      <footer className="relative mx-auto mt-14 pt-6 w-max text-center text-dim text-[15px]">
        <Washi
          small
          style={{ left: "50%", marginLeft: "-44px", transform: "rotate(3deg)" }}
        />
        end of the shelf — thanks for flipping through · Paperbäck · ♡
      </footer>

      <Preview book={previewBook} onClose={() => setPreviewBook(null)} />
    </div>
  );
}

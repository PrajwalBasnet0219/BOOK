import { useEffect, useState, type ChangeEvent, type CSSProperties, type FormEvent } from "react";
import { getBooks, addBook, updateBook, deleteBook } from "./api";
import type { Book } from "./api";
import Preview from "./Preview";

interface FormState {
  title: string;
  author: string;
  price: string;
  description: string;
  excerpt: string;
}

type Page = "shop" | "entry";

const EMPTY_FORM: FormState = { title: "", author: "", price: "", description: "", excerpt: "" };

const TAPE_COLORS = ["#e07a5f", "#3d5a80", "#81b29a", "#f2cc8f", "#9b5de5", "#e63946"];
const GENRES = ["All", "Fantasy", "Romance", "Classic", "Light Novel"];

function cardStyle(id: number, tilt: string): CSSProperties {
  return {
    "--tape": TAPE_COLORS[id % TAPE_COLORS.length],
    "--tilt": tilt,
  } as CSSProperties;
}

function Washi({ className = "", style, small = false }: { className?: string; style?: CSSProperties; small?: boolean }) {
  return (
    <span
      className={`absolute -top-3 ${
        small ? "w-[88px] h-5" : "w-[110px] h-[26px]"
      } bg-[color:var(--tape,#ff4f6e)] bg-[image:repeating-linear-gradient(45deg,rgba(255,255,255,0.4)_0_6px,transparent_6px_12px)] opacity-95 shadow-[0_1px_3px_rgba(0,0,0,0.35)] ${className}`}
      style={style}
      aria-hidden="true"
    />
  );
}

const INPUT =
  "w-full px-0.5 py-1.5 bg-transparent font-stamp text-[15px] text-ink focus:outline-none border-0 border-b-[1.6px] border-[#3c2814]/35 focus:border-[#2f6f4f] focus:bg-[#2f6f4f]/5 transition-colors";

const AREA =
  "w-full px-0.5 pt-0.5 pb-1.5 bg-transparent font-stamp text-[13.5px] leading-6 text-ink focus:outline-none border-0 border-b-[1.6px] border-[#3c2814]/35 focus:border-[#2f6f4f] focus:bg-[#2f6f4f]/5 resize-y transition-colors";

const TAG =
  "relative inline-flex items-center gap-2 px-3 py-1 bg-[#fff3c4] border-[1.5px] border-dashed border-[#c9a227] text-[#7a5c00] text-[15px] rounded-[3px] [clip-path:polygon(0_50%,8px_0,100%_0,100%_100%,8px_100%)]";

const HOLE =
  "inline-block size-1.5 rounded-full bg-[#f6ecd7] shadow-[inset_0_0_2px_rgba(0,0,0,0.45)]";

const POLA =
  "relative bg-paper border border-white/15 px-3 pt-7 pb-3.5 transition-[transform,box-shadow] duration-150 hover:z-10 [transform:rotate(var(--tilt,0deg))] hover:[transform:rotate(0deg)_translateY(-6px)_scale(1.02)] hover:[box-shadow:5px_12px_26px_rgba(255,79,110,0.22)]";

const LABEL =
  "block mb-1 font-stamp text-[10.5px] tracking-[1.6px] uppercase text-inksoft";

const chip = (active: boolean) =>
  `px-4 py-1.5 rounded-full border font-hand text-sm sm:text-base transition-all duration-150 cursor-pointer ${
    active
      ? "bg-blush border-blush text-white shadow-[0_3px_10px_rgba(255,79,110,0.35)]"
      : "border-blush/50 text-dim hover:border-blush hover:text-paper"
  }`;

function initialsOf(title: string): string {
  return (
    title
      .split(" ")
      .filter((w) => w.length > 1)
      .slice(0, 2)
      .map((w) => w[0].toUpperCase())
      .join("") || "?"
  );
}

export default function App() {
  const [page, setPage] = useState<Page>("shop");
  const [flash, setFlash] = useState("");
  const [books, setBooks] = useState<Book[]>([]);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [previewBook, setPreviewBook] = useState<Book | null>(null);
  const [genre, setGenre] = useState("All");

  useEffect(() => {
    loadBooks();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setPreviewBook(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [page]);

  async function loadBooks(): Promise<void> {
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

  function goEntry(): void {
    setFlash("");
    setPage("entry");
  }

  function goShop(): void {
    setPage("shop");
  }

  function handleChange(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void {
    setForm({ ...form, [e.target.name]: e.target.value } as FormState);
  }

  async function handleSubmit(e: FormEvent): Promise<void> {
    e.preventDefault();
    const draft = { ...form, price: Number(form.price) };
    try {
      if (editingId !== null) {
        await updateBook(editingId, draft);
      } else {
        await addBook(draft);
      }
      setForm(EMPTY_FORM);
      setEditingId(null);
      await loadBooks();
      goShop();
      setFlash(
        editingId !== null
          ? "changes saved and pinned back on the wall"
          : "stamped into the catalogue - it is on the wall now"
      );
      setTimeout(() => setFlash(""), 4000);
    } catch {
      setError("Something went wrong. Check the server.");
    }
  }

  function startEdit(book: Book): void {
    setForm({
      title: book.title,
      author: book.author,
      price: String(book.price),
      description: book.description || "",
      excerpt: book.excerpt || "",
    });
    setEditingId(book.id);
    goEntry();
  }

  function cancelEntry(): void {
    setForm(EMPTY_FORM);
    setEditingId(null);
    goShop();
  }

  async function handleDelete(id: number): Promise<void> {
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
  const total = visible.reduce((sum: number, b) => sum + Number(b.price || 0), 0);

  const proofTitle = form.title.trim() || "Untitled entry";
  const proofAuthor = form.author.trim() || "an unknown author";
  const proofPrice = form.price ? `$${Number(form.price).toFixed(2)}` : "$-.--";
  const proofNo = editingId ?? books.filter((b) => b.id !== editingId).length + 1;

  return (
    <div className="relative max-w-[1060px] mx-auto px-5 pb-20 overflow-x-clip min-h-screen">
      <div className="pointer-events-none absolute -top-40 -left-44 size-[560px] rounded-full bg-[radial-gradient(closest-side,rgba(255,79,110,0.16),transparent_70%)]" />
      <div className="pointer-events-none absolute -bottom-24 -right-52 size-[640px] rounded-full bg-[radial-gradient(closest-side,rgba(214,51,82,0.12),transparent_70%)]" />

      <header className="relative flex items-center gap-5 py-4 border-b border-blush/25">
        <button
          className="font-big font-bold text-3xl text-paper cursor-pointer bg-transparent border-0"
          onClick={goShop}
        >
          Paperbäck<span className="text-blush">.</span>shop
        </button>
        <nav className="ml-auto flex items-center gap-5">
          <button
            className="font-big text-xl text-dim hover:text-blush cursor-pointer bg-transparent border-0"
            onClick={
              page === "entry" ? goShop : () => window.scrollTo({ top: 0, behavior: "smooth" })
            }
          >
            {page === "entry" ? "back to the wall" : "the wall"}
          </button>
          {page === "shop" && (
            <button
              className="px-4 py-1.5 rounded-full bg-blush text-white font-hand text-sm sm:text-base shadow-[0_3px_10px_rgba(255,79,110,0.35)] hover:-translate-y-0.5 hover:bg-blushdeep transition-all cursor-pointer border-0"
              onClick={goEntry}
            >
              new entry
            </button>
          )}
        </nav>
        <span className="border-2 border-blush text-blush font-stamp text-[11px] tracking-[2px] px-2.5 py-1 rotate-3">
          OPEN
        </span>
      </header>

      {flash && (
        <div className="max-w-[560px] mx-auto mt-4 -rotate-[1.2deg] px-4 py-3 bg-gradient-to-b from-[#e7f6ec] to-[#cdead5] text-[#1e5c3a] shadow-[2px_4px_10px_rgba(0,0,0,0.4)]">
          {flash}
        </div>
      )}
      {error && (
        <div className="max-w-[560px] mx-auto mt-4 -rotate-[1.2deg] px-4 py-3 bg-gradient-to-b from-[#fff9b1] to-[#f7e98f] text-[#7c2d1e] shadow-[2px_4px_10px_rgba(0,0,0,0.4)]">
          {error}
        </div>
      )}

      {page === "entry" ? (
        <section className="relative pt-10 pb-8 grid lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)] gap-8 items-start">
          <Washi style={{ left: 6, transform: "rotate(-4deg)" }} />
          <form
            className="relative rounded-md bg-gradient-to-b from-[#fffef8] to-[#faf3e2] pb-7 shadow-[0_14px_34px_rgba(0,0,0,0.5)]"
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
                amended
              </span>
            )}

            <header className="px-8 pt-9 pb-4 border-b-[3px] border-double border-[#9c3d2e]">
              <h2 className="m-0 font-stamp text-[22px] tracking-[4px] text-[#9c3d2e]">
                {editingId === null ? "NEW ENTRY" : "AMENDED ENTRY"}
              </h2>
              <p className="mt-2 mb-0 font-stamp text-[11px] tracking-[1.6px] text-inksoft">
                GRITFEAT PUBLIC LIBRARY · ACQUISITIONS DESK · FILL THE LINES, THE STAMP DOES
                THE REST
              </p>
            </header>

            <div className="px-8 pt-6 pb-2">
              <fieldset className="border-0 p-0 m-0">
                <legend className="font-big text-xl text-[#35591f] pb-1">the book</legend>
                <div className="grid sm:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] gap-x-6">
                  <label className="block mb-4">
                    <span className={LABEL}>Title of work</span>
                    <input
                      className={INPUT}
                      name="title"
                      placeholder="e.g. To Kill a Mockingbird"
                      value={form.title}
                      onChange={handleChange}
                      required
                    />
                  </label>
                  <label className="block mb-4">
                    <span className={LABEL}>Author</span>
                    <input
                      className={INPUT}
                      name="author"
                      placeholder="e.g. Harper Lee"
                      value={form.author}
                      onChange={handleChange}
                      required
                    />
                  </label>
                </div>
              </fieldset>

              <fieldset className="border-0 p-0 m-0 mt-2">
                <legend className="font-big text-xl text-[#35591f] pb-1">the details</legend>
                <div className="grid sm:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] gap-x-6">
                  <label className="block mb-4">
                    <span className={LABEL}>Price ($)</span>
                    <input
                      className={INPUT}
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
                  <label className="block mb-4">
                    <span className={LABEL}>Description — what's inside</span>
                    <textarea
                      className={AREA}
                      name="description"
                      rows={4}
                      placeholder="Two honest sentences beat five fancy ones."
                      value={form.description}
                      onChange={handleChange}
                    />
                  </label>
                </div>
                <label className="block mb-2">
                  <span className={LABEL}>First page — opening lines</span>
                  <textarea
                    className={AREA}
                    name="excerpt"
                    rows={4}
                    placeholder="The first lines a reader would see when the book opens…"
                    value={form.excerpt}
                    onChange={handleChange}
                  />
                </label>
              </fieldset>
            </div>

            <div className="px-8 pt-2 flex flex-wrap gap-3.5 justify-between items-center">
              <button
                type="button"
                className="px-4 py-2.5 border-0 bg-transparent font-big text-xl text-inksoft hover:text-blush cursor-pointer"
                onClick={cancelEntry}
              >
                back to the wall
              </button>
              <button
                type="submit"
                className="px-5 py-3 border-[3px] border-double border-[#2f6f4f] rounded-md text-[#2f6f4f] font-stamp text-sm tracking-[2px] -rotate-2 opacity-90 hover:opacity-100 hover:scale-[1.04] active:scale-95 transition-transform cursor-pointer bg-transparent"
              >
                {editingId === null ? "STAMP ENTRY" : "APPROVE FIX"}
              </button>
            </div>
          </form>

          <aside className="space-y-6">
            <div
              className={`${POLA} mx-auto w-full max-w-[280px] shadow-[0_16px_36px_rgba(0,0,0,0.55)]`}
              style={cardStyle(editingId ?? proofNo, "2deg")}
            >
              <Washi style={{ left: "50%", marginLeft: "-55px", transform: "rotate(-3deg)" }} />
              {editingId !== null && (
                <span className="absolute top-5 left-5 z-30 px-2.5 py-0.5 rounded-full bg-[#2f6f4f] text-white text-[11px] -rotate-4">
                  amending
                </span>
              )}
              <div className="relative aspect-[2/3] rounded-sm bg-card grid place-items-center overflow-hidden shadow-[inset_0_0_0_1px_rgba(255,255,255,0.12)]">
                <span className="font-big font-bold text-5xl text-white/95 [text-shadow:2px_2px_3px_rgba(0,0,0,0.4)] px-4 text-center break-words">
                  {initialsOf(proofTitle)}
                </span>
                <span className="absolute left-2 right-2 bottom-2 font-stamp text-[10px] tracking-widest text-white/90 bg-black/45 py-1 px-1.5 text-center whitespace-nowrap overflow-hidden text-ellipsis">
                  {proofTitle}
                </span>
              </div>
              <div className="px-1 pt-3 pb-0.5 text-center">
                <p className="m-0 font-big font-bold text-[21px] leading-[1.12] text-ink break-words">
                  {proofTitle}
                </p>
                <p className="mt-0.5 mb-2.5 text-sm text-inksoft">by {proofAuthor}</p>
                <div className={`${TAG} -rotate-2 mb-3`}>
                  <span className={HOLE} aria-hidden="true" />
                  <span className="font-bold">{proofPrice}</span>
                </div>
                <p className="m-0 text-[12.5px] text-inksoft italic leading-snug">
                  {form.description
                    ? form.description.slice(0, 110) + (form.description.length > 110 ? "…" : "")
                    : "your description will appear here as you type…"}
                </p>
                <p className="m-0 mt-2.5 font-stamp text-[10px] tracking-[1.5px] text-inksoft">
                  THE PROOF SHEET · UPDATES WHILE YOU TYPE
                </p>
              </div>
            </div>

            <div className="rounded-md bg-blush/[0.05] border border-dashed border-blush/40 p-5 text-dim text-sm italic leading-relaxed">
              <p className="m-0 mb-1.5 font-big text-xl text-blush not-italic">
                tips from the desk
              </p>
              <p className="m-0">
                opening lines sell the book — write them like the author just finished the page.
              </p>
              <p className="m-0 mt-1">
                honest beats fancy in the description. two clear sentences are enough.
              </p>
            </div>

            <div className="bg-[#fff6e3] bg-[image:repeating-linear-gradient(-45deg,#fff6e3_0,#fff6e3_10px,#f8ecd2_10px,#f8ecd2_20px)] border border-[#d9c194] px-3.5 py-8 text-center shadow-[0_12px_30px_rgba(0,0,0,0.45)] rotate-[2.2deg]">
              <span className="inline-block px-4 py-2.5 border-[3px] border-double border-[#c0392b] text-[#c0392b] font-stamp text-xl leading-[1.35] tracking-[2px] opacity-85 -rotate-6 rounded-sm">
                DUE BACK
                <br />
                NEVER
              </span>
            </div>
          </aside>
        </section>
      ) : (
        <>
          <section className="relative grid md:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] gap-8 items-center py-14">
            <Washi style={{ left: 6, transform: "rotate(-4deg)" }} />
            <h1 className="font-big font-medium text-[clamp(40px,7.5vw,74px)] leading-[1.02] text-paper">
              B<em className="italic text-blush">rowse</em> every last
              <br />
              <strong className="font-bold text-white">BOOK</strong> on the{" "}
              <strong className="font-bold text-white">WALL</strong>
            </h1>
            <p className="mt-4 mb-7 max-w-[46ch] text-dim text-base italic">
              a shelf of stories sorted by mood, priced honestly and open to a first-page peek
              before you decide
            </p>

            <a
              href="#wall"
              className="inline-block w-max px-6 py-3 rounded-full bg-gradient-to-b from-blush to-blushdeep text-white shadow-[3px_5px_0_rgba(0,0,0,0.35)] hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_2px_0_rgba(0,0,0,0.35)] transition-transform no-underline"
            >
              start reading
            </a>
            <figure className="relative justify-self-center w-[210px] p-2.5 pb-3.5 m-0 bg-paper shadow-[4px_8px_22px_rgba(0,0,0,0.55)] rotate-3">
              <Washi small style={{ left: "50%", marginLeft: "-44px" }} />
              <img
                src={books[0]?.cover || "/covers/harry-potter.jpg"}
                alt=""
                className="block w-full aspect-[2/3] object-cover"
              />
            </figure>
          </section>

          <section
            className="relative flex flex-wrap justify-center gap-2.5 py-1.5 pb-9"
            aria-label="filter by genre"
          >
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
                {visible.length} books on the shelf · {genre !== "All" ? `${genre} · ` : ""}
                total ${total.toFixed(2)}
              </p>
            </div>

            {loading ? (
              <p className="text-center text-dim text-lg">stacking the shelf…</p>
            ) : visible.length === 0 ? (
              <div className="text-center">
                <div className="inline-grid place-items-center w-[220px] h-[290px] rounded-md border-[3px] border-dashed border-blush/40 bg-blush/[0.04] text-dim text-lg -rotate-2">
                  this shelf is empty
                </div>
                <p className="text-center text-dim text-lg mt-4">
                  nothing under {genre} yet — use the new entry button in the top bar
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-[repeat(auto-fill,minmax(215px,1fr))] gap-x-6 gap-y-8">
                {visible.map((book, idx) => (
                  <article
                    key={book.id}
                    className={`${POLA} shadow-[4px_8px_20px_rgba(0,0,0,0.5)] group`}
                    style={cardStyle(book.id, `${((idx % 4) - 1.5) * 0.9}deg`)}
                  >
                    <Washi
                      style={{ left: "50%", marginLeft: "-55px", transform: "rotate(-3deg)" }}
                    />
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
                        take a first look
                      </span>
                    </div>
                    <div className="px-1 pt-3 pb-0.5 text-center">
                      <p className="m-0 font-big font-bold text-[21px] leading-[1.12] text-ink">
                        {book.title}
                      </p>
                      <p className="mt-0.5 mb-2.5 text-sm text-inksoft">
                        by {book.author} · {book.year}
                      </p>
                      <div className={`${TAG} -rotate-2 mb-3`}>
                        <span className={HOLE} aria-hidden="true" />
                        <span className="font-bold">${Number(book.price).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-center gap-2">
                        <button
                          className="px-3 py-1 rounded-full border border-[#b7a98d] bg-[#fdf9ef] text-ink text-[13.5px] font-hand cursor-pointer hover:bg-[#ece2cd]"
                          onClick={() => startEdit(book)}
                        >
                          edit
                        </button>
                        <button
                          className="px-3 py-1 rounded-full border border-[#b7a98d] bg-[#fdf9ef] text-ink text-[13.5px] font-hand cursor-pointer hover:bg-blushdeep hover:border-blushdeep hover:text-white"
                          onClick={() => handleDelete(book.id)}
                        >
                          cut
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>

          <footer className="relative mx-auto mt-14 pt-6 w-max text-center text-dim text-[15px]">
            <Washi small style={{ left: "50%", marginLeft: "-44px", transform: "rotate(3deg)" }} />
            end of the shelf — thanks for flipping through · Paperbäck
          </footer>
        </>
      )}

      <Preview book={page === "shop" ? previewBook : null} onClose={() => setPreviewBook(null)} />
    </div>
  );
}

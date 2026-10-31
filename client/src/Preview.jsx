export default function Preview({ book, onClose }) {
  if (!book) return null;
  const excerpt = book.excerpt;
  const about = book.description || book.about;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="open-book" onClick={(e) => e.stopPropagation()}>
        <span className="page-block" aria-hidden="true" />

        <div className="page page-left">
          <h3 className="page-heading">about this book</h3>
          <p className="page-about">{about}</p>
          <div className="page-meta">
            <p>
              <span className="meta-label">title</span>
              {book.title}
            </p>
            <p>
              <span className="meta-label">author</span>
              {book.author}
            </p>
            <p>
              <span className="meta-label">year</span>
              {book.year || "—"}
            </p>
          </div>
        </div>

        <div className="page page-right">
          <h3 className="page-heading">first page</h3>
          {excerpt ? (
            <p className="page-excerpt">{excerpt}</p>
          ) : (
            <p className="page-excerpt page-excerpt-empty">
              this book has not been opened yet — its pages are still blank…
            </p>
          )}
          <p className="page-flourish">— opening lines ·{book.year ? ` ${book.year}` : ""}</p>
        </div>

        <div className="cover-flop">
          <span className="face-front">
            <span className="front-frame" aria-hidden="true" />
            <span className="front-initials">{initialsOf(book.title)}</span>
            <span className="front-title">{book.title}</span>
            <span className="cover-ribbon" aria-hidden="true" />
          </span>
          <span className="face-back">
            <h3 className="page-heading">about this book</h3>
            <p className="page-about">{about}</p>
            <div className="page-meta">
              <p>
                <span className="meta-label">title</span>
                {book.title}
              </p>
              <p>
                <span className="meta-label">author</span>
                {book.author}
              </p>
              <p>
                <span className="meta-label">year</span>
                {book.year || "—"}
              </p>
              <p className="meta-price-tag">
                <span className="tag-hole" aria-hidden="true" />
                ${Number(book.price).toFixed(2)}
              </p>
            </div>
            <span className="ex-libris">ex libris · my book store ♡</span>
          </span>
        </div>

        <button className="chip modal-close" onClick={onClose}>
          close the book ✕
        </button>
      </div>
    </div>
  );
}

function initialsOf(title) {
  return title
    .split(" ")
    .filter((w) => w.length > 1)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");
}

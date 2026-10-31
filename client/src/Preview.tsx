import type { Book } from "./api";

const PAGE =
  "text-ink bg-[#fffdf4] bg-[image:repeating-linear-gradient(0deg,transparent_0_26px,rgba(110,97,87,0.16)_26px_27px)]";

export default function Preview({ book, onClose }: { book: Book | null; onClose: () => void }) {
  if (!book) return null;
  const excerpt = book.excerpt;

  return (
    <div
      className="fixed inset-0 z-20 grid place-items-center p-6 bg-black/80 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative grid grid-cols-1 sm:grid-cols-2 w-[min(680px,100%)] min-h-[460px] font-hand [perspective:1600px]"
        onClick={(e) => e.stopPropagation()}
      >
        <span
          className="absolute top-3.5 bottom-3.5 right-2 rounded-r-lg hidden sm:block bg-[#fbf5e4] bg-[image:repeating-linear-gradient(180deg,#fbf5e4_0_3px,#dccfa9_3px_5px)] shadow-[0_4px_10px_rgba(0,0,0,0.35),inset_2px_0_5px_rgba(0,0,0,0.15)]"
          aria-hidden="true"
        />

        <div
          className={`${PAGE} relative z-10 rounded-[10px_6px_6px_10px] p-7 pb-5 overflow-hidden shadow-[0_8px_24px_rgba(0,0,0,0.35)] max-sm:mb-3.5 max-sm:rounded-lg`}
        >
          <h3 className="m-0 mb-3 font-big text-2xl text-[#35591f]">about this book</h3>
          <p className="m-0 mb-3.5 text-[17px] leading-relaxed">{book.description}</p>
          <div className="text-[15px]">
            <p className="my-1">
              <span className="inline-block w-14 text-xs tracking-widest text-inksoft">
                title
              </span>
              {book.title}
            </p>
            <p className="my-1">
              <span className="inline-block w-14 text-xs tracking-widest text-inksoft">
                author
              </span>
              {book.author}
            </p>
            <p className="my-1">
              <span className="inline-block w-14 text-xs tracking-widest text-inksoft">
                year
              </span>
              {book.year || "—"}
            </p>
          </div>
        </div>

        <div
          className={`${PAGE} relative z-10 rounded-[6px_10px_10px_6px] px-7 py-7 overflow-hidden shadow-[inset_14px_0_18px_-12px_rgba(90,60,30,0.55),0_8px_24px_rgba(0,0,0,0.35)] max-sm:rounded-lg animate-page-in`}
        >
          <h3 className="m-0 mb-3 font-big text-2xl text-[#35591f]">first page</h3>
          {excerpt ? (
            <p className="m-0 mb-6 text-[17px] leading-[1.6] italic text-[#4a3c31] first-letter:float-left first-letter:mr-2 first-letter:mt-0.5 first-letter:font-big first-letter:font-bold first-letter:text-[46px] first-letter:leading-[0.85] first-letter:text-[#6d4405]">
              {excerpt}
            </p>
          ) : (
            <p className="m-0 mb-6 text-[17px] leading-[1.6] italic text-inksoft">
              this book has not been opened yet — its pages are still blank…
            </p>
          )}
          <p className="absolute right-7 bottom-5 m-0 pt-2 border-t border-inksoft/40 text-[12.5px] tracking-wide text-inksoft">
            — opening lines{book.year ? ` · ${book.year}` : ""}
          </p>
        </div>

        <div className="absolute inset-y-0 right-0 w-1/2 max-sm:hidden pointer-events-none [transform-origin:left_center] [transform-style:preserve-3d] animate-swing-open">
          <div className="absolute inset-0 overflow-hidden [backface-visibility:hidden] rounded-[6px_10px_10px_6px] grid place-items-center bg-card shadow-[inset_0_0_0_4px_rgba(255,255,255,0.25),6px_10px_22px_rgba(0,0,0,0.4)]">
            {book.cover && (
              <img src={book.cover} alt="" className="absolute inset-0 size-full object-cover" />
            )}
            <span
              className="absolute inset-[13px] border-2 border-white/70 rounded pointer-events-none z-[2]"
              aria-hidden="true"
            />
            <span className="relative z-[2] font-big font-bold text-[88px] text-white/95 [text-shadow:3px_3px_4px_rgba(0,0,0,0.4)]">
              {initialsOf(book.title)}
            </span>
            <span
              className="absolute left-5 right-5 bottom-5 z-[2] font-stamp text-[11px] tracking-widest text-white bg-black/45 py-1 px-2 text-center whitespace-nowrap overflow-hidden text-ellipsis"
              aria-hidden="true"
            >
              {book.title}
            </span>
            <span
              className="absolute top-0 left-7 w-4 h-[54px] bg-[#e63946] shadow-[1px_2px_3px_rgba(0,0,0,0.35)] z-[3] [clip-path:polygon(0_0,100%_0,100%_100%,50%_80%,0_100%)]"
              aria-hidden="true"
            />
          </div>
          <div
            className={`${PAGE} absolute inset-0 overflow-hidden [backface-visibility:hidden] rounded-lg [transform:rotateY(180deg)] p-7 pb-14 shadow-[inset_-14px_0_22px_rgba(90,60,30,0.3)]!`}
          >
            <h3 className="m-0 mb-3 font-big text-2xl text-[#35591f]">about this book</h3>
            <p className="m-0 mb-3.5 text-[17px] leading-relaxed">{book.description}</p>
            <div className="text-[15px]">
              <p className="my-1">
                <span className="inline-block w-14 text-xs tracking-widest text-inksoft">
                  title
                </span>
                {book.title}
              </p>
              <p className="my-1">
                <span className="inline-block w-14 text-xs tracking-widest text-inksoft">
                  author
                </span>
                {book.author}
              </p>
              <p className="my-1">
                <span className="inline-block w-14 text-xs tracking-widest text-inksoft">
                  year
                </span>
                {book.year || "—"}
              </p>
              <p className="inline-flex items-center gap-2 mt-1 px-3 py-1 bg-[#fff3c4] border-[1.5px] border-dashed border-[#c9a227] text-[#7a5c00] [clip-path:polygon(0_50%,8px_0,100%_0,100%_100%,8px_100%)]">
                <span
                  className="inline-block size-1.5 rounded-full bg-[#f6ecd7] shadow-[inset_0_0_2px_rgba(0,0,0,0.45)]"
                  aria-hidden="true"
                />
                ${Number(book.price).toFixed(2)}
              </p>
            </div>
            <span className="absolute left-1/2 -translate-x-1/2 bottom-4 -rotate-[1.5deg] pt-2 border-t border-inksoft/40 text-[12.5px] tracking-wide text-inksoft whitespace-nowrap">
              ex libris · Paperbäck
            </span>
          </div>
        </div>

        <button
          className="absolute -bottom-14 left-1/2 -translate-x-1/2 max-sm:static max-sm:translate-x-0 max-sm:mt-4 px-4 py-1.5 bg-[#fff3c4] border-[1.5px] border-dashed border-[#c9a227] text-[#7a5c00] rounded-full font-hand text-sm cursor-pointer hover:bg-[#fbe89a] z-30"
          onClick={onClose}
        >
          close the book
        </button>

        <span
          className="absolute left-[4%] right-[4%] -bottom-6 h-8 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0.6),transparent_70%)] blur-[5px] pointer-events-none max-sm:hidden"
          aria-hidden="true"
        />
      </div>
    </div>
  );
}

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

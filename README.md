# 📚 Book Store — Internship Task (React + Node.js + JSON)

Dear Intern,

Welcome to Gritfeat Solution! For your first task you will build a simple full-stack **Book Store** application. The tech is **React** on the frontend, **Node.js (Express)** on the backend, and all data is stored in a plain **JSON file** (`server/books.json`) — no real database yet.

Please work through the task list below, in order, and tick each item as you finish it. Bring the finished list to your mentor for review.

Warm regards,
**The Team — Gritfeat Solution**

---

## ✅ Task List

### 0. Setup
From the **project root** you can either use the shortcut:

```bash
npm run setup    # installs both server and client (once)
npm run server   # backend  → http://localhost:3001
npm run client   # frontend → http://localhost:5173
```

or the classic way:

- [ ] Install Node.js if you don't have it.
- [ ] Run the backend: `cd server && npm install && npm start` (port 3001).
- [ ] Run the frontend: `cd client && npm install && npm run dev` (port 5173).
- [ ] Open the app in the browser and confirm the 3 starter books appear.

### 1. Backend — CRUD routes in `server/server.js`
- [ ] `GET /api/books` — return all books from `books.json`.
- [ ] `GET /api/books/:id` — return one book, or `404` if it doesn't exist.
- [ ] `POST /api/books` — add a new book with a new `id`, save the file, return `201`.
- [ ] `PUT /api/books/:id` — update one book, or `404` if it doesn't exist.
- [ ] `DELETE /api/books/:id` — remove one book, or `404` if it doesn't exist.
- [ ] Test every route with the app or with an API tool (Postman/Thunder).

### 2. Frontend — connect the UI in `client/src/App.jsx` and `client/src/api.js`
- [ ] `api.js` — write functions that call each backend route with `fetch`.
- [ ] Load and show all books on the page (Read).
- [ ] Add a book from the form (Create).
- [ ] Add an "Edit" button that fills the form with a book's data and saves the change (Update).
- [ ] Add a "Delete" button that removes a book (Delete).
- [ ] Confirm the screen updates after every action, without a page reload.

### 3. Validation
- [ ] Backend: reject books with a missing title, author, or non-number price (`400`).
- [ ] Backend: reject negative prices.
- [ ] Frontend: show a simple error message when input is invalid.

### 4. Extra features (bonus)
- [ ] Search box that filters the list by title or author.
- [ ] Show the total number of books and the total price on the page.

### 5. Submission
- [ ] Write a short summary (5–10 lines) of what you built, in your own words.
- [ ] Include screenshots of the app working (add, edit, delete).
- [ ] Send everything to your mentor or reply to the task email.

---

## 📁 Project structure

| File | What it does |
|------|--------------|
| `server/server.js` | Express API — all CRUD routes |
| `server/books.json` | The "database" (3 starter books) |
| `client/src/App.jsx` | React UI — form + book list |
| `client/src/api.js` | All fetch calls to the backend in one place |
| `client/src/styles.css` | Scrapbook theme (paper, tape, polaroids, stickers) |

> 📌 **Note:** a working reference version is already included in this folder. Try to implement each task yourself first (in an empty copy or from scratch files), then compare your solution against the reference to see what you missed.

**Rules:** use only the libraries already listed in the two `package.json` files; keep the scrapbook design; and test after every change.

---

## 🚀 Publishing the app (after you finish the tasks)

This section is the mentor-approved way to put the app online with **one free server** (Render).

### How it works

In production we don't run two servers. We build the React app into plain files (`client/dist`)
and copy them into `server/public`; then Express serves **both the page and the API** on one URL:

```
visitor → https://your-app.onrender.com → Express
                                        ├── /api/books  → the CRUD API
                                        └── anything else → client/dist (the React app)
```

That's why `client/src/api.js` uses `http://localhost:3001/api/books` **only in dev**, and
the relative `/api/books` in production.

### Step 1 — try it locally first

```bash
npm run setup          # install both packages (once)
npm run build:client   # build React → copies it to server/public
npm run server         # open http://localhost:3001 — full app, one server!
```

### Step 2 — put the code on GitHub

```bash
git init
git add .
git commit -m "Book store CRUD app"
```

Then create an empty repository on github.com (name it e.g. `book-store`) and:

```bash
git remote add origin https://github.com/YOUR-USERNAME/book-store.git
git push -u origin main
```

(`node_modules` never gets pushed — it's ignored via `.gitignore`.)

### Step 3 — deploy on Render (free)

1. Sign up at [render.com](https://render.com) with your GitHub account.
2. **New → Web Service** → pick your `book-store` repository.
3. Settings:
   - **Build command:** `npm install --prefix server && npm run build:client`
   - **Start command:** `npm start --prefix server`
4. Click **Create Web Service** → wait a few minutes → open your URL. 🎉

### ⚠️ The one catch: your data

On Render's free plan the disk is **temporary** — every restart or redeploy resets
`server/books.json` back to the starter books. That's fine for a demo. Removing this
limit is the perfect "next task": migrate from JSON to a real database
(e.g. MongoDB Atlas or Supabase) in a later lesson.

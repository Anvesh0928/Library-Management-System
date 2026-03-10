## Library Management System

Full-stack Library Management System with role-based access (Admin, Student).  
Currently the backend runs in **in-memory mode** (no MongoDB / real JWT required) so you can develop and test quickly. A MongoDB + JWT implementation can be plugged back in later using the existing models and config.

### Tech Stack

- **Frontend**: React 18, Vite, React Router, Axios, Tailwind CSS  
- **Backend**: Node.js, Express.js, **in-memory data store** (no DB required right now)

---

### Folder Structure

- `backend/`
  - `src/`
    - `dataStore.js` (in-memory users, books, issues)
    - `config/db.js` (Mongo connection – **currently unused**, for future DB mode)
    - `models/` (Mongoose models – **currently unused**)
      - `User.js`
      - `Book.js`
      - `IssueRecord.js`
    - `middleware/`
      - `auth.js` (simple token + role guard backed by `dataStore`)
    - `controllers/`
      - `authController.js`
      - `bookController.js`
      - `issueController.js`
      - `userController.js`
    - `routes/`
      - `authRoutes.js`
      - `bookRoutes.js`
      - `issueRoutes.js`
      - `userRoutes.js`
    - `seed/seed.js` (sample data seeder for future Mongo mode)
    - `server.js` (Express entrypoint; starts in-memory mode)
  - `.env.example`
  - `sample-data.json`
- `frontend/`
  - `src/`
    - `main.jsx`
    - `App.jsx`
    - `index.css`
    - `context/AuthContext.jsx`
    - `components/`
      - `Navbar.jsx`
      - `ProtectedRoute.jsx`
      - `Toast.jsx`
    - `pages/`
      - `LoginPage.jsx`
      - `RegisterPage.jsx`
      - `Dashboard.jsx`
      - `BooksList.jsx`
      - `BookDetails.jsx`
      - `AdminPanel.jsx`
      - `IssueHistory.jsx`
  - `index.html`
  - `vite.config.js`
  - `tailwind.config.js`
  - `postcss.config.js`

---

### Backend Setup (In-Memory Mode – no DB/JWT)

1. **Install dependencies**

```bash
cd backend
npm install
```

2. **Run backend**

```bash
npm run start
```

Backend will start on `http://localhost:5000` (or `PORT` env if set) and store all data in memory.  
You do **not** need MongoDB or any DB running for this mode.

> To switch to a real MongoDB + JWT setup in the future, wire `server.js` back to `connectDB` from `config/db.js`, restore JWT usage in `authController` / `middleware/auth`, and replace `dataStore` usages with the Mongoose models in `models/`.

---

### Backend API Overview

- **Auth**
  - `POST /api/auth/register` – register user (name, email, password, role)
  - `POST /api/auth/login` – login, returns `{ token, user }` where `token` is a simple user-id string
- **Books** (auth required)
  - `GET /api/books` – list books, optional `?search=term`
  - `GET /api/books/:id` – get single book
  - `POST /api/books` – **admin** create book
  - `PUT /api/books/:id` – **admin** update book
  - `DELETE /api/books/:id` – **admin** delete book
- **Issues** (auth required)
  - `POST /api/issues/issue` – issue a book `{ bookId }`
  - `POST /api/issues/return` – return a book `{ issueId }`
  - `GET /api/issues/me` – current user issue history
  - `GET /api/issues` – **admin** view all issues
- **Users** (admin only)
  - `GET /api/users` – list users
  - `PUT /api/users/:id/role` – change user role
  - `DELETE /api/users/:id` – delete user

All protected routes expect `Authorization: Bearer <token>`, where `<token>` is the simple user-id string returned by login/register in this in-memory mode.

---

### Frontend Setup

1. **Install dependencies**

```bash
cd frontend
npm install
```

2. **Run frontend**

```bash
npm run dev
```

Frontend runs on `http://localhost:5173` and expects backend at `http://localhost:5000`.
If your backend URL is different, update `baseURL` in `frontend/src/services/api.js`.

---

### Frontend Pages & Features

- **Login Page**
  - Email/password login
  - Validates required fields
  - Stores JWT and user in localStorage and context
  - Shows toast messages on success/error

- **Register Page**
  - Name, email, password, role (Admin/Student)
  - Auto-login after registration

- **Dashboard**
  - Greets user by name
  - Shows user role
  - Quick cards for Books, Issue History, and Admin (if admin)

- **Books List**
  - Displays all books in responsive cards
  - Search by title or author (`?search=` backend query)

- **Book Details**
  - Shows full book information
  - Allows logged-in user to issue book (if available)

- **Issue History**
  - Shows user’s issue/return history
  - Allows returning currently issued books

- **Admin Panel** (Admin only)
  - Add/update/delete books
  - View and edit user roles
  - View all issue records

---

### Authentication & Authorization

- Token stored in `localStorage` under key `library_auth`.
- Axios interceptor (`src/services/api.js`) attaches token via `Authorization` header.
- `AuthContext` keeps `user`, `token`, and exposes `login`/`logout`.
- `ProtectedRoute`:
  - Redirects unauthenticated users to `/login`.
  - Optional `roles` prop restricts access to specific roles (e.g. admin).

---

### UI/UX Notes

- Tailwind CSS for styling, dark theme by default.
- Responsive layout for mobile and desktop.
- Reusable `Navbar` with navigation links depending on auth state.
- Global `Toast` component for success/error/info notifications.
- Loading states on lists, detail pages, and form submissions.


import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api.js";

const BooksList = ({ showToast }) => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const res = await api.get("/books", {
        params: search ? { search } : {}
      });
      setBooks(res.data);
    } catch (error) {
      showToast("Failed to load books", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchBooks();
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
        <h1 className="text-xl font-semibold">Books</h1>
        <form
          onSubmit={handleSearch}
          className="flex items-center gap-2 w-full md:w-auto"
        >
          <input
            type="text"
            placeholder="Search by title or author"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 px-3 py-2 rounded bg-slate-900 border border-slate-700 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <button
            type="submit"
            className="px-3 py-2 rounded bg-emerald-600 text-xs font-medium"
          >
            Search
          </button>
        </form>
      </div>
      {loading ? (
        <p className="text-sm text-slate-400">Loading books...</p>
      ) : books.length === 0 ? (
        <p className="text-sm text-slate-400">No books found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {books.map((book) => (
            <Link
              key={book._id}
              to={`/books/${book._id}`}
              className="bg-slate-900 border border-slate-800 rounded-xl p-4 hover:border-emerald-500 transition"
            >
              <h2 className="text-sm font-semibold mb-1">{book.title}</h2>
              <p className="text-xs text-slate-400 mb-1">{book.author}</p>
              <p className="text-[11px] text-slate-500 mb-2">
                Category: {book.category}
              </p>
              <p className="text-[11px] text-slate-400">
                Available: {book.quantity}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default BooksList;


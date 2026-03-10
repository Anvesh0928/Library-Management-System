import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api.js";
import { useAuth } from "../context/AuthContext.jsx";

const BookDetails = ({ showToast }) => {
  const { id } = useParams();
  const { user } = useAuth();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [issuing, setIssuing] = useState(false);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const res = await api.get(`/books/${id}`);
        setBook(res.data);
      } catch (error) {
        showToast("Failed to load book", "error");
      } finally {
        setLoading(false);
      }
    };
    fetchBook();
  }, [id, showToast]);

  const handleIssue = async () => {
    if (!book) return;
    try {
      setIssuing(true);
      await api.post("/issues/issue", { bookId: book._id });
      showToast("Book issued successfully", "success");
    } catch (error) {
      showToast(
        error.response?.data?.message || "Failed to issue book",
        "error"
      );
    } finally {
      setIssuing(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-6">
        <p className="text-sm text-slate-400">Loading book...</p>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-6">
        <p className="text-sm text-slate-400">Book not found.</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <h1 className="text-xl font-semibold mb-1">{book.title}</h1>
        <p className="text-sm text-slate-400 mb-1">{book.author}</p>
        <p className="text-xs text-slate-500 mb-2">
          Category: {book.category} · ISBN: {book.isbn}
        </p>
        <p className="text-xs text-slate-400 mb-4">
          Available quantity: {book.quantity}
        </p>
        <p className="text-sm text-slate-200 mb-6">
          {book.description || "No description provided."}
        </p>
        {user && (
          <button
            onClick={handleIssue}
            disabled={issuing || book.quantity <= 0}
            className="px-4 py-2 rounded bg-emerald-600 hover:bg-emerald-500 text-sm font-medium disabled:opacity-60"
          >
            {issuing
              ? "Issuing..."
              : book.quantity > 0
              ? "Issue Book"
              : "Not Available"}
          </button>
        )}
      </div>
    </div>
  );
};

export default BookDetails;


import React, { useEffect, useState } from "react";
import api from "../services/api.js";

const emptyBook = {
  title: "",
  author: "",
  category: "",
  isbn: "",
  quantity: 1,
  description: ""
};

const AdminPanel = ({ showToast }) => {
  const [books, setBooks] = useState([]);
  const [users, setUsers] = useState([]);
  const [issues, setIssues] = useState([]);
  const [bookForm, setBookForm] = useState(emptyBook);
  const [editingId, setEditingId] = useState(null);

  const fetchAll = async () => {
    try {
      const [booksRes, usersRes, issuesRes] = await Promise.all([
        api.get("/books"),
        api.get("/users"),
        api.get("/issues")
      ]);
      setBooks(booksRes.data);
      setUsers(usersRes.data);
      setIssues(issuesRes.data);
    } catch (error) {
      showToast("Failed to load admin data", "error");
    }
  };

  useEffect(() => {
    fetchAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleBookChange = (e) => {
    const value =
      e.target.name === "quantity" ? Number(e.target.value) : e.target.value;
    setBookForm({ ...bookForm, [e.target.name]: value });
  };

  const handleBookSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/books/${editingId}`, bookForm);
        showToast("Book updated", "success");
      } else {
        await api.post("/books", bookForm);
        showToast("Book added", "success");
      }
      setBookForm(emptyBook);
      setEditingId(null);
      fetchAll();
    } catch (error) {
      showToast(
        error.response?.data?.message || "Failed to save book",
        "error"
      );
    }
  };

  const handleEditBook = (book) => {
    setEditingId(book._id);
    setBookForm({
      title: book.title,
      author: book.author,
      category: book.category,
      isbn: book.isbn,
      quantity: book.quantity,
      description: book.description || ""
    });
  };

  const handleDeleteBook = async (id) => {
    try {
      await api.delete(`/books/${id}`);
      showToast("Book deleted", "success");
      fetchAll();
    } catch (error) {
      showToast("Failed to delete book", "error");
    }
  };

  const handleUserRoleChange = async (id, role) => {
    try {
      await api.put(`/users/${id}/role`, { role });
      showToast("User role updated", "success");
      fetchAll();
    } catch (error) {
      showToast("Failed to update role", "error");
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
      <h1 className="text-xl font-semibold">Admin Panel</h1>

      <section className="bg-slate-900 border border-slate-800 rounded-xl p-4">
        <h2 className="text-sm font-semibold mb-3">
          {editingId ? "Edit Book" : "Add New Book"}
        </h2>
        <form
          onSubmit={handleBookSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs"
        >
          <input
            type="text"
            name="title"
            placeholder="Title"
            value={bookForm.title}
            onChange={handleBookChange}
            className="px-3 py-2 rounded bg-slate-950 border border-slate-700"
          />
          <input
            type="text"
            name="author"
            placeholder="Author"
            value={bookForm.author}
            onChange={handleBookChange}
            className="px-3 py-2 rounded bg-slate-950 border border-slate-700"
          />
          <input
            type="text"
            name="category"
            placeholder="Category"
            value={bookForm.category}
            onChange={handleBookChange}
            className="px-3 py-2 rounded bg-slate-950 border border-slate-700"
          />
          <input
            type="text"
            name="isbn"
            placeholder="ISBN"
            value={bookForm.isbn}
            onChange={handleBookChange}
            className="px-3 py-2 rounded bg-slate-950 border border-slate-700"
          />
          <input
            type="number"
            name="quantity"
            placeholder="Quantity"
            value={bookForm.quantity}
            onChange={handleBookChange}
            className="px-3 py-2 rounded bg-slate-950 border border-slate-700"
          />
          <textarea
            name="description"
            placeholder="Description"
            value={bookForm.description}
            onChange={handleBookChange}
            className="px-3 py-2 rounded bg-slate-950 border border-slate-700 md:col-span-2"
          />
          <div className="flex gap-2 md:col-span-2">
            <button
              type="submit"
              className="px-4 py-2 rounded bg-emerald-600 text-xs font-medium"
            >
              {editingId ? "Update Book" : "Add Book"}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={() => {
                  setEditingId(null);
                  setBookForm(emptyBook);
                }}
                className="px-4 py-2 rounded bg-slate-700 text-xs"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </section>

      <section className="bg-slate-900 border border-slate-800 rounded-xl p-4">
        <h2 className="text-sm font-semibold mb-3">Books</h2>
        <div className="space-y-2 text-xs max-h-64 overflow-y-auto pr-2">
          {books.map((book) => (
            <div
              key={book._id}
              className="flex items-center justify-between gap-2"
            >
              <div>
                <p className="font-medium">{book.title}</p>
                <p className="text-slate-400">
                  {book.author} · {book.category} · Qty: {book.quantity}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEditBook(book)}
                  className="px-2 py-1 rounded bg-slate-700"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteBook(book._id)}
                  className="px-2 py-1 rounded bg-rose-600"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-slate-900 border border-slate-800 rounded-xl p-4">
        <h2 className="text-sm font-semibold mb-3">Users</h2>
        <div className="space-y-2 text-xs max-h-48 overflow-y-auto pr-2">
          {users.map((user) => (
            <div
              key={user._id}
              className="flex items-center justify-between gap-2"
            >
              <div>
                <p className="font-medium">{user.name}</p>
                <p className="text-slate-400">
                  {user.email} · Role: {user.role}
                </p>
              </div>
              <select
                value={user.role}
                onChange={(e) =>
                  handleUserRoleChange(user._id, e.target.value)
                }
                className="px-2 py-1 rounded bg-slate-950 border border-slate-700"
              >
                <option value="student">Student</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-slate-900 border border-slate-800 rounded-xl p-4">
        <h2 className="text-sm font-semibold mb-3">All Issued Books</h2>
        <div className="space-y-2 text-xs max-h-48 overflow-y-auto pr-2">
          {issues.map((issue) => (
            <div
              key={issue._id}
              className="flex items-center justify-between gap-2"
            >
              <div>
                <p className="font-medium">
                  {issue.book?.title || "Unknown Book"}
                </p>
                <p className="text-slate-400">
                  {issue.user?.name || "Unknown User"} ·{" "}
                  <span className="capitalize">{issue.status}</span>
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default AdminPanel;


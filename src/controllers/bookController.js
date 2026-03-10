import { books, createBook as createBookInStore } from "../dataStore.js";

export const createBook = async (req, res) => {
  try {
    const book = createBookInStore(req.body);
    return res.status(201).json(book);
  } catch (error) {
    console.error("Create book error:", error);
    return res.status(400).json({ message: "Invalid book data" });
  }
};

export const getBooks = async (req, res) => {
  try {
    const { search } = req.query;
    let result = [...books];
    if (search) {
      const term = String(search).toLowerCase();
      result = result.filter(
        (b) =>
          b.title.toLowerCase().includes(term) ||
          b.author.toLowerCase().includes(term)
      );
    }
    // Sort newest first by createdAt
    result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return res.json(result);
  } catch (error) {
    console.error("Get books error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const getBookById = async (req, res) => {
  try {
    const book = books.find((b) => String(b._id) === String(req.params.id));
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }
    return res.json(book);
  } catch (error) {
    console.error("Get book error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const updateBook = async (req, res) => {
  try {
    const idx = books.findIndex((b) => String(b._id) === String(req.params.id));
    if (idx === -1) {
      return res.status(404).json({ message: "Book not found" });
    }
    const existing = books[idx];
    const updated = {
      ...existing,
      ...req.body,
      quantity:
        req.body.quantity !== undefined
          ? Number(req.body.quantity)
          : existing.quantity,
      updatedAt: new Date()
    };
    books[idx] = updated;
    return res.json(updated);
  } catch (error) {
    console.error("Update book error:", error);
    return res.status(400).json({ message: "Invalid book data" });
  }
};

export const deleteBook = async (req, res) => {
  try {
    const idx = books.findIndex((b) => String(b._id) === String(req.params.id));
    if (idx === -1) {
      return res.status(404).json({ message: "Book not found" });
    }
    books.splice(idx, 1);
    return res.json({ message: "Book deleted" });
  } catch (error) {
    console.error("Delete book error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};


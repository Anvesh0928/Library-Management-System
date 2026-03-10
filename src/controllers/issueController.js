import { books, issues, createIssue, users } from "../dataStore.js";

export const issueBook = async (req, res) => {
  try {
    const { bookId } = req.body;
    const userId = req.user._id;

    const book = books.find((b) => String(b._id) === String(bookId));
    if (!book || book.quantity <= 0) {
      return res.status(400).json({ message: "Book not available" });
    }

    const activeIssue = issues.find(
      (i) =>
        String(i.user) === String(userId) &&
        String(i.book) === String(bookId) &&
        i.status === "issued"
    );
    if (activeIssue) {
      return res
        .status(400)
        .json({ message: "Book already issued to this user" });
    }

    const issue = createIssue({ userId, bookId });

    book.quantity -= 1;
    book.updatedAt = new Date();

    return res.status(201).json(issue);
  } catch (error) {
    console.error("Issue book error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const returnBook = async (req, res) => {
  try {
    const { issueId } = req.body;
    const userId = req.user._id;

    const issue = issues.find(
      (i) =>
        String(i._id) === String(issueId) &&
        String(i.user) === String(userId) &&
        i.status === "issued"
    );
    if (!issue) {
      return res
        .status(400)
        .json({ message: "Active issue record not found" });
    }

    issue.status = "returned";
    issue.returnedAt = new Date();
    issue.updatedAt = new Date();

    const book = books.find((b) => String(b._id) === String(issue.book));
    if (book) {
      book.quantity += 1;
      book.updatedAt = new Date();
    }

    return res.json(issue);
  } catch (error) {
    console.error("Return book error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const getUserIssues = async (req, res) => {
  try {
    const userId = req.user._id;
    const userIssues = issues
      .filter((i) => String(i.user) === String(userId))
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .map((i) => ({
        ...i,
        book: books.find((b) => String(b._id) === String(i.book)) || null
      }));
    return res.json(userIssues);
  } catch (error) {
    console.error("Get user issues error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const getAllIssues = async (req, res) => {
  try {
    const all = issues
      .slice()
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .map((i) => ({
        ...i,
        book: books.find((b) => String(b._id) === String(i.book)) || null,
        user:
          users
            .map((u) => ({ ...u, password: undefined }))
            .find((u) => String(u._id) === String(i.user)) || null
      }));
    return res.json(all);
  } catch (error) {
    console.error("Get all issues error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};


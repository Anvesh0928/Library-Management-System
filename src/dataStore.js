// Simple in-memory data store used instead of MongoDB.

let userIdCounter = 1;
let bookIdCounter = 1;
let issueIdCounter = 1;

export const users = [];
export const books = [];
export const issues = [];

export const createUser = ({ name, email, password, role }) => {
  const now = new Date();
  const user = {
    _id: String(userIdCounter++),
    name,
    email,
    password,
    role,
    createdAt: now,
    updatedAt: now
  };
  users.push(user);
  return user;
};

export const createBook = (data) => {
  const now = new Date();
  const book = {
    _id: String(bookIdCounter++),
    title: data.title,
    author: data.author,
    category: data.category,
    isbn: data.isbn,
    quantity: Number.isFinite(data.quantity) ? data.quantity : 0,
    description: data.description || "",
    createdAt: now,
    updatedAt: now
  };
  books.push(book);
  return book;
};

export const createIssue = ({ userId, bookId }) => {
  const now = new Date();
  const issue = {
    _id: String(issueIdCounter++),
    user: userId,
    book: bookId,
    issuedAt: now,
    returnedAt: null,
    status: "issued",
    createdAt: now,
    updatedAt: now
  };
  issues.push(issue);
  return issue;
};


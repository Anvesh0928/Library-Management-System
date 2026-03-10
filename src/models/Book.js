import mongoose from "mongoose";

const bookSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    author: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    isbn: { type: String, required: true, unique: true, trim: true },
    quantity: { type: Number, required: true, min: 0 },
    description: { type: String, trim: true }
  },
  { timestamps: true }
);

export const Book = mongoose.model("Book", bookSchema);


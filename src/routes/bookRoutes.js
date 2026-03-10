import express from "express";
import {
  createBook,
  getBooks,
  getBookById,
  updateBook,
  deleteBook
} from "../controllers/bookController.js";
import { authMiddleware, requireRole } from "../middleware/auth.js";

const router = express.Router();

router.get("/", authMiddleware, getBooks);
router.get("/:id", authMiddleware, getBookById);
router.post("/", authMiddleware, requireRole("admin"), createBook);
router.put("/:id", authMiddleware, requireRole("admin"), updateBook);
router.delete("/:id", authMiddleware, requireRole("admin"), deleteBook);

export default router;


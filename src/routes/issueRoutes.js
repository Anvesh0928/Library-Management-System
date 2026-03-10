import express from "express";
import {
  issueBook,
  returnBook,
  getUserIssues,
  getAllIssues
} from "../controllers/issueController.js";
import { authMiddleware, requireRole } from "../middleware/auth.js";

const router = express.Router();

router.post("/issue", authMiddleware, issueBook);
router.post("/return", authMiddleware, returnBook);
router.get("/me", authMiddleware, getUserIssues);
router.get("/", authMiddleware, requireRole("admin"), getAllIssues);

export default router;


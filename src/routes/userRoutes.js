import express from "express";
import {
  getUsers,
  updateUserRole,
  deleteUser
} from "../controllers/userController.js";
import { authMiddleware, requireRole } from "../middleware/auth.js";

const router = express.Router();

router.get("/", authMiddleware, requireRole("admin"), getUsers);
router.put("/:id/role", authMiddleware, requireRole("admin"), updateUserRole);
router.delete("/:id", authMiddleware, requireRole("admin"), deleteUser);

export default router;


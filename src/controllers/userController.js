import { users } from "../dataStore.js";

export const getUsers = async (req, res) => {
  try {
    const result = users
      .slice()
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .map((u) => ({ ...u, password: undefined }));
    return res.json(result);
  } catch (error) {
    console.error("Get users error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    const idx = users.findIndex((u) => String(u._id) === String(req.params.id));
    if (idx === -1) {
      return res.status(404).json({ message: "User not found" });
    }
    users[idx] = {
      ...users[idx],
      role,
      updatedAt: new Date()
    };
    const { password, ...safeUser } = users[idx];
    return res.json(safeUser);
  } catch (error) {
    console.error("Update user role error:", error);
    return res.status(400).json({ message: "Invalid data" });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const idx = users.findIndex((u) => String(u._id) === String(req.params.id));
    if (idx === -1) {
      return res.status(404).json({ message: "User not found" });
    }
    users.splice(idx, 1);
    return res.json({ message: "User deleted" });
  } catch (error) {
    console.error("Delete user error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};


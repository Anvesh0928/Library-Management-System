import { users } from "../dataStore.js";

export const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  // In this simplified implementation the token is just the user id string.
  const user = users.find((u) => String(u._id) === String(token));
  if (!user) {
    return res.status(401).json({ message: "User not found" });
  }

  req.user = { ...user, password: undefined };
  return next();
};

export const requireRole = (roles = []) => {
  const roleArray = Array.isArray(roles) ? roles : [roles];
  return (req, res, next) => {
    if (!req.user || !roleArray.includes(req.user.role)) {
      return res.status(403).json({ message: "Forbidden: insufficient role" });
    }
    return next();
  };
};


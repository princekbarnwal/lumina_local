import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

export const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ message: "No token provided" });
    }

    // Format: Bearer TOKEN
    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Invalid token format" });
    }

    const decoded = jwt.verify(token, JWT_SECRET);

    req.user = decoded; // attach user info

    next();
  } catch (err) {
    return res.status(401).json({ message: "Unauthorized" });
  }
};
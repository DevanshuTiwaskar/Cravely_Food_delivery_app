// middleware/auth.js
import jwt from "jsonwebtoken";
import redis from "../services/redisClient.js";
import User from "../models/user.model.js";

export const authMiddleware = async (req, res, next) => {
  try {
    // Extract token from Authorization header
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "No token provided" });

    // Check Redis first (faster than DB)
    const cachedUser = await redis.get(`session:${token}`);
    if (cachedUser) {
      req.user = JSON.parse(cachedUser);
      return next();
    }

    // If not cached → verify & fetch from DB
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) return res.status(401).json({ message: "Invalid token" });

    req.user = user;

    // Cache session in Redis (expires in 1 hour)
    // ioredis supports set with expiration in seconds
    await redis.set(`session:${token}`, JSON.stringify(user), "EX", 3600);

    next();
  } catch (err) {
    return res.status(401).json({ message: "Unauthorized", error: err.message });
  }
};

// Role check middleware
export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Forbidden: Access denied" });
    }
    next();
  };
};

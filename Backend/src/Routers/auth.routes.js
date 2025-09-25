import express from "express";
import {
  registerUser,
  registerSeller,
  registerAdmin,
  login,
  getCurrentUser,
  logout,
} from "../controllers/authController.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

// Register
router.post("/register", registerUser);
router.post("/register/seller", registerSeller);
router.post("/register/admin", registerAdmin);

// Login
router.post("/login", login);

// Profile (requires login)
router.get("/me", authMiddleware, getCurrentUser);

// Logout
router.post("/logout", logout);

export default router;




// POST /auth/register → registers a normal user.

// POST /auth/register/seller → registers seller with extra fields (shopName, gstNumber).

// POST /auth/register/admin → registers admin with permissions.

// POST /auth/login → logs in any role (since all are in users collection).

// GET /auth/me → returns the logged-in user from req.user.

// POST /auth/logout → clears token.
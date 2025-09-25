import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import Seller from "../models/sellerModel.js";
import Admin from "../models/adminModel.js";

// ---------- Utility ----------
async function createUser({ username, email, fullName, password, role, extraData }) {
  // check if username or email exists
  const isUserAlreadyExists = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (isUserAlreadyExists) {
    throw new Error("User already exists");
  }

  const hash = await bcrypt.hash(password, 10);

  let user;
  if (role === "seller") {
    user = await Seller.create({
      username,
      email,
      fullName,
      password: hash,
      ...extraData,
    });
  } else if (role === "admin") {
    user = await Admin.create({
      username,
      email,
      fullName,
      password: hash,
      ...extraData,
    });
  } else {
    user = await User.create({
      username,
      email,
      fullName,
      password: hash,
    });
  }

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });

  return { user, token };
}

// ---------- Register ----------
export async function registerUser(req, res) {
  const { username, email, password, fullName } = req.body;
  try {
    const { user, token } = await createUser({
      username,
      email,
      password,
      fullName,
      role: "user",
    });

    res.cookie("token", token, { httpOnly: true, sameSite: "Lax" });
    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
      },
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

export async function registerSeller(req, res) {
  const { username, email, password, fullName, shopName, gstNumber } = req.body;
  try {
    const { user, token } = await createUser({
      username,
      email,
      password,
      fullName,
      role: "seller",
      extraData: { shopName, gstNumber },
    });

    res.cookie("token", token, { httpOnly: true, sameSite: "Lax" });
    res.status(201).json({
      message: "Seller registered successfully",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        shopName: user.shopName,
        gstNumber: user.gstNumber,
      },
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

export async function registerAdmin(req, res) {
  const { username, email, password, fullName, permissions } = req.body;
  try {
    const { user, token } = await createUser({
      username,
      email,
      password,
      fullName,
      role: "admin",
      extraData: { permissions },
    });

    res.cookie("token", token, { httpOnly: true, sameSite: "Lax" });
    res.status(201).json({
      message: "Admin registered successfully",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        permissions: user.permissions,
      },
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

// ---------- Login ----------
export async function login(req, res) {
  const { email, username, password } = req.body;

  try {
    const user = await User.findOne({
      $or: [{ username }, { email }],
    }).select("+password");

    if (!user) {
      return res.status(400).json({ message: "Invalid username or email" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid password" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Lax",
      maxAge: 1000 * 60 * 60 * 24,
    });

    res.status(200).json({
      message: "Login successful",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
}

// ---------- Current User ----------
export async function getCurrentUser(req, res) {
  if (!req.user) return res.status(401).json({ message: "Unauthorized" });
  res.status(200).json({
    message: "Current user fetched successfully",
    user: {
      id: req.user._id,
      username: req.user.username,
      email: req.user.email,
      fullName: req.user.fullName,
      role: req.user.role,
    },
  });
}

// ---------- Logout ----------
export function logout(req, res) {
  res.cookie("token", "", { maxAge: 0 });
  res.status(200).json({ message: "Logged out" });
}

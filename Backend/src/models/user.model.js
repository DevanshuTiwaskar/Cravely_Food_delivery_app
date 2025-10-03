// models/userModel.js
import mongoose from "mongoose";

const options = { discriminatorKey: "role", timestamps: true };

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true, select: false },
    fullName: {
      firstName: { type: String },
      lastName: { type: String },
    },
    cartData: { type: Object, default: {} },
  },
  options
);

// Base model
const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;






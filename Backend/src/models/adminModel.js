// models/adminModel.js
import User from "./user.model.js";
import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
  permissions: [{ type: String }], // e.g., ["manage_users", "manage_products"]
  accessLogs: [{ type: Date }],
});

const Admin =
  mongoose.models.Admin || User.discriminator("admin", adminSchema);

export default Admin;

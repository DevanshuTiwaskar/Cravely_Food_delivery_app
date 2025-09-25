// models/sellerModel.js
import User from "./user.model.js";
import mongoose from "mongoose";

const sellerSchema = new mongoose.Schema({
  shopName: { type: String, required: true },
  gstNumber: { type: String },
  businessLicense: { type: String },
});

// Create Seller as a discriminator of User
const Seller =
  mongoose.models.Seller || User.discriminator("seller", sellerSchema);

export default Seller;

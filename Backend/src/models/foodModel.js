import mongoose from "mongoose";

const foodSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    category: {
      type: String,
      enum: ["Pizza", "Burger", "Biryani", "Drinks", "Dessert", "Other"], 
      required: true,
    },



    // 📌 Who is selling this food? (Restaurant / Seller)
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // seller or restaurant owner
      required: true,
    },


    // 📌 Images (support multiple in future)
    images: [
      {
        url: { type: String, required: true },  // CDN URL
        fileId: { type: String }, // ImageKit/Cloudinary fileId
      },
    ],
    isAvailable: {
      type: Boolean,
      default: true,
    },
    rating: {
      average: { type: Number, default: 0 },
      count: { type: Number, default: 0 },
    },


    // 📌 For future scaling: variations (e.g., size, addons)
    variants: [
      {
        name: String, // e.g., "Small", "Large", "Extra Cheese"
        price: Number,
      },
    ],

    
    // 📌 Audit fields
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const FoodModel = mongoose.models.Food || mongoose.model("Food", foodSchema);

export default FoodModel;

import foodModel from "../models/foodModel.js";
import imagekit from "../utils/imagekit.js";

// ✅ List all foods
const listFood = async (req, res) => {
  try {
    const foods = await foodModel.find({});
    res.json({ success: true, data: foods });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error fetching foods" });
  }
};

// ✅ Add food with ImageKit upload
const addFood = async (req, res) => {
  try {
    if (!req.file) {
      return res.json({ success: false, message: "Image is required" });
    }

    // Upload image to ImageKit
    const uploadResponse = await imagekit.upload({
      file: req.file.buffer,
      fileName: req.file.originalname,
    });
  console.log(uploadResponse)
   
    const food = new foodModel({
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      category: req.body.category,
      image: uploadResponse.url,       // ✅ CDN URL
      imageFileId: uploadResponse.fileId, // ✅ Needed for deletion
    });

    await food.save();
    res.json({ success: true, message: "Food Added", food });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Error adding food" });
  }
};



// ✅ Delete food (also delete from ImageKit)
const removeFood = async (req, res) => {
  try {
    const food = await foodModel.findById(req.body.id);

    if (!food) {
      return res.json({ success: false, message: "Food not found" });
    }

    // Delete image from ImageKit if fileId exists
    if (food.imageFileId) {
      await imagekit.deleteFile(food.imageFileId);
    }

    await foodModel.findByIdAndDelete(req.body.id);
    res.json({ success: true, message: "Food Removed" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error removing food" });
  }
};


export { listFood, addFood, removeFood };

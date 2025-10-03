import express from "express";
import { addFood, listFood, removeFood } from "../controllers/foodController.js";
import multer from "multer";

const foodRouter = express.Router();

// Multer in-memory storage (no local uploads)
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

foodRouter.get("/list", listFood);
foodRouter.post("/add", upload.single("image"), addFood);
foodRouter.post("/remove", removeFood);

export default foodRouter;

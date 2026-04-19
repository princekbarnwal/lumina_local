import express from "express";
import { createProduct, getProductsByShop, bulkUpload } from "../controllers/product.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/", authMiddleware, createProduct);
router.get("/", getProductsByShop);
router.post("/bulk", authMiddleware, bulkUpload);
export default router;

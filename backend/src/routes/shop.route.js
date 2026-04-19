import express from "express";
import { createShop, getMyShops } from "../controllers/shop.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/", authMiddleware, createShop);
router.get("/", authMiddleware, getMyShops);

export default router;
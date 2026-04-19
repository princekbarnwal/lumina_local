import express from "express";
import { getPublicShopProducts } from "../controllers/shop.controller.js";

const router = express.Router();

router.get("/:shopId/products", getPublicShopProducts);

export default router;

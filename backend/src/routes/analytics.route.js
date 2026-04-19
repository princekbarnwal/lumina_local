import express from "express";
import {
  getProductAnalytics,
  getProductReviews,
  getShopAnalytics,
} from "../controllers/analytics.controller.js";

const router = express.Router();

router.get("/products/:productId/reviews", getProductReviews);
router.get("/products/:productId/analytics", getProductAnalytics);
router.get("/shops/:shopId/analytics", getShopAnalytics);

export default router;

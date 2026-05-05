import express from "express";
import {
  getProductAnalytics,
  getProductReviews,
  getProductSentimentAnalytics,
  getShopAnalytics,
} from "../controllers/analytics.controller.js";
import {
  getProductReport,
  getShopReport,
} from "../controllers/report.controller.js";
import {
  getProductTrends,
  getShopTrends,
} from "../controllers/trend.controller.js";

const router = express.Router();

router.get("/products/:productId/reviews", getProductReviews);
router.get("/products/:productId/analytics", getProductAnalytics);
router.get("/products/:productId/sentiment", getProductSentimentAnalytics);
router.get("/products/:productId/report", getProductReport);
router.get("/products/:productId/trends", getProductTrends);
router.get("/shops/:shopId/analytics", getShopAnalytics);
router.get("/shops/:shopId/report", getShopReport);
router.get("/shops/:shopId/trends", getShopTrends);

export default router;

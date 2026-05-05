import express from "express";
import {
  createReview,
  getReviewInsights,
} from "../controllers/review.controller.js";

const router = express.Router();

router.get("/:productId/insights", getReviewInsights);
router.post("/", createReview);

export default router;

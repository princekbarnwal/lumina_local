import prisma from "../config/prisma.js";
import {
  calculateReviewTrust,
  calculateWeightedRating,
} from "../services/trustScore.service.js";
import { analyzeSentiment } from "../services/sentiment.service.js";
import { updateDailyMetricsForReview } from "../services/metrics.service.js";

export const createReview = async (req, res) => {
  try {
    const { productId, rating, comment } = req.body;
    const userIdentifier = req.body.userIdentifier || req.body.user_identifier;
    const parsedProductId = Number(productId);
    const parsedRating = Number(rating);

    if (!parsedProductId) {
      return res.status(400).json({ error: "Product id is required" });
    }

    if (!userIdentifier) {
      return res.status(400).json({ error: "User identifier is required" });
    }

    if (!Number.isInteger(parsedRating) || parsedRating < 1 || parsedRating > 5) {
      return res.status(400).json({ error: "Rating must be between 1 and 5" });
    }

    const product = await prisma.product.findUnique({
      where: { id: parsedProductId },
    });

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    const existingReview = await prisma.review.findFirst({
      where: {
        productId: parsedProductId,
        userIdentifier,
      },
    });

    if (existingReview) {
      return res.status(409).json({ error: "Review already submitted for this product" });
    }

    const trustResult = await calculateReviewTrust({
      userIdentifier,
      shopId: product.shopId,
      comment,
    });
    const sentiment = await analyzeSentiment(comment);

    const review = await prisma.review.create({
      data: {
        productId: parsedProductId,
        userIdentifier,
        rating: parsedRating,
        comment,
        sentiment,
        trustScore: trustResult.trustScore,
        isSpam: trustResult.isSpam,
      },
    });

    await updateDailyMetricsForReview({
      productId: parsedProductId,
      shopId: product.shopId,
      date: review.createdAt,
    }).catch((metricsErr) => {
      console.warn("Daily metrics update failed:", metricsErr.message);
    });

    res.status(201).json(review);
  } catch (err) {
    if (err.code === "P2002") {
      return res.status(409).json({ error: "Review already submitted for this product" });
    }

    res.status(500).json({ error: "Failed to create review" });
  }
};

export const getReviewInsights = async (req, res) => {
  try {
    const productId = Number(req.params.productId);

    if (!Number.isInteger(productId) || productId <= 0) {
      return res.status(400).json({ error: "Invalid product id" });
    }

    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    const [reviewStats, spamCount, trustedReviews] = await Promise.all([
      prisma.review.aggregate({
        where: { productId },
        _count: {
          id: true,
        },
        _avg: {
          trustScore: true,
        },
      }),
      prisma.review.count({
        where: {
          productId,
          isSpam: true,
        },
      }),
      prisma.review.findMany({
        where: {
          productId,
          isSpam: false,
        },
        select: {
          rating: true,
          trustScore: true,
        },
      }),
    ]);

    res.json({
      productId,
      totalReviews: reviewStats._count.id,
      spamCount,
      averageTrustScore: reviewStats._avg.trustScore
        ? Number(reviewStats._avg.trustScore.toFixed(2))
        : 0,
      weightedRating: calculateWeightedRating(trustedReviews),
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch review insights" });
  }
};

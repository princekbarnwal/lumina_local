import prisma from "../config/prisma.js";
import { calculateWeightedRating } from "../services/trustScore.service.js";

const buildRatingDistribution = (ratings) => {
  const distribution = {
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
  };

  ratings.forEach((item) => {
    distribution[item.rating] = item._count.rating;
  });

  return distribution;
};

const buildSentimentBreakdown = (sentiments) => {
  const breakdown = {
    positive: 0,
    neutral: 0,
    negative: 0,
  };

  sentiments.forEach((item) => {
    if (item.sentiment) {
      breakdown[item.sentiment] = item._count.sentiment;
    }
  });

  return breakdown;
};

export const getProductReviews = async (req, res) => {
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

    const reviews = await prisma.review.findMany({
      where: { productId },
      select: {
        rating: true,
        comment: true,
        sentiment: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json({
      productId,
      reviews,
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch reviews" });
  }
};

export const getProductSentimentAnalytics = async (req, res) => {
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

    const sentimentGroups = await prisma.review.groupBy({
      by: ["sentiment"],
      where: {
        productId,
        isSpam: false,
        sentiment: {
          in: ["positive", "neutral", "negative"],
        },
      },
      _count: {
        sentiment: true,
      },
    });

    res.json(buildSentimentBreakdown(sentimentGroups));
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch sentiment analytics" });
  }
};

export const getProductAnalytics = async (req, res) => {
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

    const [reviewStats, ratingGroups, trustedReviews] = await Promise.all([
      prisma.review.aggregate({
        where: { productId },
        _count: {
          id: true,
        },
      }),
      prisma.review.groupBy({
        by: ["rating"],
        where: {
          productId,
          isSpam: false,
        },
        _count: {
          rating: true,
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
      averageRating: calculateWeightedRating(trustedReviews),
      totalReviews: reviewStats._count.id,
      ratingDistribution: buildRatingDistribution(ratingGroups),
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch product analytics" });
  }
};

export const getShopAnalytics = async (req, res) => {
  try {
    const shopId = Number(req.params.shopId);

    if (!Number.isInteger(shopId) || shopId <= 0) {
      return res.status(400).json({ error: "Invalid shop id" });
    }

    const shop = await prisma.shop.findUnique({
      where: { id: shopId },
    });

    if (!shop) {
      return res.status(404).json({ error: "Shop not found" });
    }

    const [
      totalProducts,
      reviewStats,
      trustedReviews,
      topReviewedProductGroups,
      sentimentGroups,
    ] = await Promise.all([
      prisma.product.count({
        where: { shopId },
      }),
      prisma.review.aggregate({
        where: {
          product: {
            shopId,
          },
        },
        _count: {
          id: true,
        },
      }),
      prisma.review.findMany({
        where: {
          isSpam: false,
          product: {
            shopId,
          },
        },
        select: {
          rating: true,
          trustScore: true,
        },
      }),
      prisma.review.groupBy({
        by: ["productId"],
        where: {
          isSpam: false,
          product: {
            shopId,
          },
        },
        _count: {
          productId: true,
        },
        orderBy: {
          _count: {
            productId: "desc",
          },
        },
        take: 3,
      }),
      prisma.review.groupBy({
        by: ["sentiment"],
        where: {
          isSpam: false,
          sentiment: {
            in: ["positive", "neutral", "negative"],
          },
          product: {
            shopId,
          },
        },
        _count: {
          sentiment: true,
        },
      }),
    ]);

    const topProductIds = topReviewedProductGroups.map((item) => item.productId);
    const topProducts = topProductIds.length
      ? await prisma.product.findMany({
          where: {
            id: {
              in: topProductIds,
            },
          },
          select: {
            id: true,
            name: true,
          },
        })
      : [];
    const topProductsById = new Map(topProducts.map((product) => [product.id, product]));

    res.json({
      shopId,
      totalProducts,
      totalReviews: reviewStats._count.id,
      averageRating: calculateWeightedRating(trustedReviews),
      sentimentBreakdown: buildSentimentBreakdown(sentimentGroups),
      topReviewedProducts: topReviewedProductGroups.map((item) => ({
        id: item.productId,
        name: topProductsById.get(item.productId)?.name,
        reviewsCount: item._count.productId,
      })),
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch shop analytics" });
  }
};

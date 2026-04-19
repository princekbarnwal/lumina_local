import prisma from "../config/prisma.js";

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

const roundRating = (rating) => {
  if (!rating) {
    return 0;
  }

  return Number(rating.toFixed(2));
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

    const [reviewStats, ratingGroups] = await Promise.all([
      prisma.review.aggregate({
        where: { productId },
        _avg: {
          rating: true,
        },
        _count: {
          id: true,
        },
      }),
      prisma.review.groupBy({
        by: ["rating"],
        where: { productId },
        _count: {
          rating: true,
        },
      }),
    ]);

    res.json({
      productId,
      averageRating: roundRating(reviewStats._avg.rating),
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

    const [totalProducts, reviewStats, topReviewedProducts] = await Promise.all([
      prisma.product.count({
        where: { shopId },
      }),
      prisma.review.aggregate({
        where: {
          product: {
            shopId,
          },
        },
        _avg: {
          rating: true,
        },
        _count: {
          id: true,
        },
      }),
      prisma.product.findMany({
        where: { shopId },
        select: {
          id: true,
          name: true,
          _count: {
            select: {
              reviews: true,
            },
          },
        },
        orderBy: {
          reviews: {
            _count: "desc",
          },
        },
        take: 3,
      }),
    ]);

    res.json({
      shopId,
      totalProducts,
      totalReviews: reviewStats._count.id,
      averageRating: roundRating(reviewStats._avg.rating),
      topReviewedProducts: topReviewedProducts.map((product) => ({
        id: product.id,
        name: product.name,
        reviewsCount: product._count.reviews,
      })),
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch shop analytics" });
  }
};

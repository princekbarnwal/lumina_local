import prisma from "../config/prisma.js";
import { generateInsightReport } from "../services/insight.service.js";
import { analyzeTrends } from "../services/trend.service.js";

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

const buildSentimentDistribution = (sentiments) => {
  const distribution = {
    positive: 0,
    neutral: 0,
    negative: 0,
  };

  sentiments.forEach((item) => {
    if (item.sentiment) {
      distribution[item.sentiment] = item._count.sentiment;
    }
  });

  return distribution;
};

const isCacheFresh = (cachedReport, fingerprint) => {
  if (!cachedReport) {
    return false;
  }

  const cachedLatest = cachedReport.latestReviewAt?.getTime() || null;
  const currentLatest = fingerprint.latestReviewAt?.getTime() || null;

  const hasTrendInsights = Boolean(cachedReport.report?.trendInsights);

  return cachedReport.reviewCount === fingerprint.reviewCount && cachedLatest === currentLatest && hasTrendInsights;
};

const upsertReportCache = async ({
  scope,
  scopeId,
  fingerprint,
  generated,
}) => {
  return prisma.insightReport.upsert({
    where: {
      scope_scopeId: {
        scope,
        scopeId,
      },
    },
    update: {
      reviewCount: fingerprint.reviewCount,
      latestReviewAt: fingerprint.latestReviewAt,
      report: generated.report,
      source: generated.source,
      prompt: generated.prompt,
      model: generated.model,
    },
    create: {
      scope,
      scopeId,
      reviewCount: fingerprint.reviewCount,
      latestReviewAt: fingerprint.latestReviewAt,
      report: generated.report,
      source: generated.source,
      prompt: generated.prompt,
      model: generated.model,
    },
  });
};

const buildFingerprint = (reviewStats) => ({
  reviewCount: reviewStats._count.id,
  latestReviewAt: reviewStats._max.createdAt,
});

export const getProductReport = async (req, res) => {
  try {
    const productId = Number(req.params.productId);

    if (!Number.isInteger(productId) || productId <= 0) {
      return res.status(400).json({ error: "Invalid product id" });
    }

    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: {
        shop: {
          select: {
            name: true,
          },
        },
      },
    });

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    const [reviewStats, cachedReport, reviews, sentimentGroups, ratingGroups] = await Promise.all([
      prisma.review.aggregate({
        where: { productId },
        _count: { id: true },
        _max: { createdAt: true },
      }),
      prisma.insightReport.findUnique({
        where: {
          scope_scopeId: {
            scope: "product",
            scopeId: productId,
          },
        },
      }),
      prisma.review.findMany({
        where: {
          productId,
          isSpam: false,
        },
        select: {
          comment: true,
          trustScore: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      }),
      prisma.review.groupBy({
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
    ]);

    const fingerprint = buildFingerprint(reviewStats);

    if (isCacheFresh(cachedReport, fingerprint)) {
      return res.json({
        productId,
        productName: product.name,
        cached: true,
        source: cachedReport.source,
        generatedAt: cachedReport.updatedAt,
        report: cachedReport.report,
      });
    }

    const trendInsights = await analyzeTrends({
      scope: "product",
      scopeId: productId,
    });
    const generated = await generateInsightReport({
      scope: "product",
      productName: product.name,
      shopName: product.shop.name,
      reviews: reviews.map((review) => review.comment).filter(Boolean),
      sentimentDistribution: buildSentimentDistribution(sentimentGroups),
      ratingDistribution: buildRatingDistribution(ratingGroups),
      trustScores: reviews.map((review) => review.trustScore),
      trendInsights,
    });
    const generatedProductReport = {
      ...generated,
      report: {
        ...generated.report,
        trendInsights: {
          ratingChange: trendInsights.ratingChange,
          negativeTrend: trendInsights.negativeTrend,
          positiveTrend: trendInsights.positiveTrend,
          reviewSpike: trendInsights.reviewSpike,
          alerts: trendInsights.alerts,
        },
      },
    };

    const savedReport = await upsertReportCache({
      scope: "product",
      scopeId: productId,
      fingerprint,
      generated: generatedProductReport,
    });

    res.json({
      productId,
      productName: product.name,
      cached: false,
      source: savedReport.source,
      generatedAt: savedReport.updatedAt,
      report: savedReport.report,
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to generate product report" });
  }
};

export const getShopReport = async (req, res) => {
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
      reviewStats,
      cachedReport,
      reviews,
      sentimentGroups,
      ratingGroups,
      productReviewGroups,
      topRatedProducts,
    ] = await Promise.all([
      prisma.review.aggregate({
        where: {
          product: {
            shopId,
          },
        },
        _count: { id: true },
        _max: { createdAt: true },
      }),
      prisma.insightReport.findUnique({
        where: {
          scope_scopeId: {
            scope: "shop",
            scopeId: shopId,
          },
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
          comment: true,
          trustScore: true,
          product: {
            select: {
              name: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
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
      prisma.review.groupBy({
        by: ["rating"],
        where: {
          isSpam: false,
          product: {
            shopId,
          },
        },
        _count: {
          rating: true,
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
        take: 5,
      }),
      prisma.product.findMany({
        where: {
          shopId,
          reviews: {
            some: {
              isSpam: false,
            },
          },
        },
        select: {
          id: true,
          name: true,
          reviews: {
            where: {
              isSpam: false,
            },
            select: {
              rating: true,
            },
          },
        },
      }),
    ]);

    const fingerprint = buildFingerprint(reviewStats);

    if (isCacheFresh(cachedReport, fingerprint)) {
      return res.json({
        shopId,
        shopName: shop.name,
        cached: true,
        source: cachedReport.source,
        generatedAt: cachedReport.updatedAt,
        report: cachedReport.report,
      });
    }

    const productIds = productReviewGroups.map((item) => item.productId);
    const reviewedProducts = productIds.length
      ? await prisma.product.findMany({
          where: {
            id: {
              in: productIds,
            },
          },
          select: {
            id: true,
            name: true,
          },
        })
      : [];
    const reviewedProductsById = new Map(reviewedProducts.map((product) => [product.id, product]));
    const topReviewedProducts = productReviewGroups.map((item) => ({
      id: item.productId,
      name: reviewedProductsById.get(item.productId)?.name,
      reviewsCount: item._count.productId,
    }));
    const topProducts = topRatedProducts
      .map((product) => {
        const reviewCount = product.reviews.length;
        const averageRating = reviewCount
          ? product.reviews.reduce((total, review) => total + review.rating, 0) / reviewCount
          : 0;

        return {
          id: product.id,
          name: product.name,
          averageRating: Number(averageRating.toFixed(2)),
          reviewCount,
        };
      })
      .sort((a, b) => b.averageRating - a.averageRating || b.reviewCount - a.reviewCount)
      .slice(0, 5);

    const trendInsights = await analyzeTrends({
      scope: "shop",
      scopeId: shopId,
    });
    const generated = await generateInsightReport({
      scope: "shop",
      shopName: shop.name,
      reviews: reviews
        .map((review) => {
          if (!review.comment) {
            return null;
          }

          return `${review.product.name}: ${review.comment}`;
        })
        .filter(Boolean),
      sentimentDistribution: buildSentimentDistribution(sentimentGroups),
      ratingDistribution: buildRatingDistribution(ratingGroups),
      trustScores: reviews.map((review) => review.trustScore),
      topProducts,
      topReviewedProducts,
      trendInsights,
    });
    const generatedShopReport = {
      ...generated,
      report: {
        ...generated.report,
        topIssues: generated.report.negatives,
        topPerformingProducts: topProducts,
        topReviewedProducts,
        trendInsights: {
          ratingChange: trendInsights.ratingChange,
          negativeTrend: trendInsights.negativeTrend,
          positiveTrend: trendInsights.positiveTrend,
          reviewSpike: trendInsights.reviewSpike,
          alerts: trendInsights.alerts,
        },
      },
    };

    const savedReport = await upsertReportCache({
      scope: "shop",
      scopeId: shopId,
      fingerprint,
      generated: generatedShopReport,
    });

    res.json({
      shopId,
      shopName: shop.name,
      cached: false,
      source: savedReport.source,
      generatedAt: savedReport.updatedAt,
      report: savedReport.report,
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to generate shop report" });
  }
};

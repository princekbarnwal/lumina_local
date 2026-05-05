import prisma from "../config/prisma.js";
import { calculateWeightedRating } from "./trustScore.service.js";

const startOfUtcDay = (date = new Date()) => {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
};

const nextUtcDay = (date) => {
  const next = new Date(date);
  next.setUTCDate(next.getUTCDate() + 1);
  return next;
};

const buildSentimentCounts = (reviews) => {
  return reviews.reduce(
    (counts, review) => {
      if (review.sentiment === "positive") {
        counts.positiveCount += 1;
      } else if (review.sentiment === "negative") {
        counts.negativeCount += 1;
      } else if (review.sentiment === "neutral") {
        counts.neutralCount += 1;
      }

      return counts;
    },
    {
      positiveCount: 0,
      neutralCount: 0,
      negativeCount: 0,
    }
  );
};

const upsertDailyMetrics = async ({ scope, scopeId, date, reviews }) => {
  const sentimentCounts = buildSentimentCounts(reviews);

  return prisma.dailyMetrics.upsert({
    where: {
      scope_scopeId_date: {
        scope,
        scopeId,
        date,
      },
    },
    update: {
      avgRating: calculateWeightedRating(reviews),
      reviewCount: reviews.length,
      ...sentimentCounts,
    },
    create: {
      scope,
      scopeId,
      date,
      avgRating: calculateWeightedRating(reviews),
      reviewCount: reviews.length,
      ...sentimentCounts,
    },
  });
};

const trustedReviewSelect = {
  rating: true,
  trustScore: true,
  sentiment: true,
};

const findReviewsForMetrics = async ({ scope, scopeId, dayStart, dayEnd }) => {
  const scopeWhere =
    scope === "shop"
      ? {
          product: {
            shopId: scopeId,
          },
        }
      : {
          productId: scopeId,
        };

  return prisma.review.findMany({
    where: {
      ...scopeWhere,
      isSpam: false,
      createdAt: {
        gte: dayStart,
        lt: dayEnd,
      },
    },
    select: trustedReviewSelect,
  });
};

export const updateDailyMetricsForReview = async ({ productId, shopId, date = new Date() }) => {
  const dayStart = startOfUtcDay(date);
  const dayEnd = nextUtcDay(dayStart);

  const [productReviews, shopReviews] = await Promise.all([
    findReviewsForMetrics({
      scope: "product",
      scopeId: productId,
      dayStart,
      dayEnd,
    }),
    findReviewsForMetrics({
      scope: "shop",
      scopeId: shopId,
      dayStart,
      dayEnd,
    }),
  ]);

  await Promise.all([
    upsertDailyMetrics({
      scope: "product",
      scopeId: productId,
      date: dayStart,
      reviews: productReviews,
    }),
    upsertDailyMetrics({
      scope: "shop",
      scopeId: shopId,
      date: dayStart,
      reviews: shopReviews,
    }),
  ]);
};

export const refreshDailyMetricsForRange = async ({ scope, scopeId, startDate, endDate }) => {
  let cursor = startOfUtcDay(startDate);
  const finalDate = startOfUtcDay(endDate);

  while (cursor <= finalDate) {
    const dayStart = cursor;
    const dayEnd = nextUtcDay(dayStart);
    const reviews = await findReviewsForMetrics({
      scope,
      scopeId,
      dayStart,
      dayEnd,
    });

    await upsertDailyMetrics({
      scope,
      scopeId,
      date: dayStart,
      reviews,
    });

    cursor = dayEnd;
  }
};

export const startOfMetricsDay = startOfUtcDay;

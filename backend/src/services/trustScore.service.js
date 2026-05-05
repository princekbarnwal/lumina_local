import prisma from "../config/prisma.js";

const RECENT_REVIEW_WINDOW_MS = 10 * 60 * 1000;
const RAPID_REVIEW_WINDOW_MS = 15 * 1000;
const MIN_TRUST_SCORE = 0.1;

const roundScore = (score) => Number(score.toFixed(2));

const clampTrustScore = (score) => {
  if (score < MIN_TRUST_SCORE) {
    return MIN_TRUST_SCORE;
  }

  if (score > 1) {
    return 1;
  }

  return score;
};

export const calculateReviewTrust = async ({
  userIdentifier,
  shopId,
  comment,
  now = new Date(),
}) => {
  const recentWindowStart = new Date(now.getTime() - RECENT_REVIEW_WINDOW_MS);
  const rapidWindowStart = new Date(now.getTime() - RAPID_REVIEW_WINDOW_MS);

  const [recentReviewCount, sameShopReviewCount, rapidReviewCount] = await Promise.all([
    prisma.review.count({
      where: {
        userIdentifier,
        createdAt: {
          gte: recentWindowStart,
        },
      },
    }),
    prisma.review.count({
      where: {
        userIdentifier,
        product: {
          shopId,
        },
      },
    }),
    prisma.review.count({
      where: {
        userIdentifier,
        createdAt: {
          gte: rapidWindowStart,
        },
      },
    }),
  ]);

  let trustScore = 1.0;
  const signals = [];
  const isSpam = recentReviewCount >= 5;

  if (isSpam) {
    trustScore -= 0.7;
    signals.push("high_recent_review_volume");
  }

  if (sameShopReviewCount >= 3) {
    trustScore -= 0.25;
    signals.push("many_reviews_for_same_shop");
  }

  if (!comment || !comment.trim()) {
    trustScore -= 0.1;
    signals.push("empty_comment");
  }

  if (rapidReviewCount > 0) {
    trustScore -= 0.2;
    signals.push("rapid_review_submission");
  }

  return {
    trustScore: roundScore(clampTrustScore(trustScore)),
    isSpam,
    signals,
  };
};

export const calculateWeightedRating = (reviews) => {
  const totals = reviews.reduce(
    (acc, review) => {
      acc.weightedRating += review.rating * review.trustScore;
      acc.weight += review.trustScore;
      return acc;
    },
    {
      weightedRating: 0,
      weight: 0,
    }
  );

  if (!totals.weight) {
    return 0;
  }

  return roundScore(totals.weightedRating / totals.weight);
};

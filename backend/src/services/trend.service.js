import prisma from "../config/prisma.js";
import {
  refreshDailyMetricsForRange,
  startOfMetricsDay,
} from "./metrics.service.js";

const WINDOW_DAYS = 7;
const RATING_DROP_THRESHOLD = -15;
const RATING_INCREASE_THRESHOLD = 15;
const NEGATIVE_SHIFT_THRESHOLD = 15;
const POSITIVE_DROP_THRESHOLD = -15;
const REVIEW_SPIKE_THRESHOLD = 100;

const round = (value) => Number(value.toFixed(2));

const addDays = (date, days) => {
  const next = new Date(date);
  next.setUTCDate(next.getUTCDate() + days);
  return next;
};

const percentChange = (current, previous) => {
  if (!previous && !current) {
    return 0;
  }

  if (!previous) {
    return current > 0 ? 100 : 0;
  }

  return round(((current - previous) / previous) * 100);
};

const weightedAverageFromDailyMetrics = (metrics) => {
  const totals = metrics.reduce(
    (acc, metric) => {
      acc.score += metric.avgRating * metric.reviewCount;
      acc.count += metric.reviewCount;
      return acc;
    },
    { score: 0, count: 0 }
  );

  return totals.count ? totals.score / totals.count : 0;
};

const summarizeWindow = (metrics) => {
  return metrics.reduce(
    (summary, metric) => {
      summary.reviewCount += metric.reviewCount;
      summary.positiveCount += metric.positiveCount;
      summary.neutralCount += metric.neutralCount;
      summary.negativeCount += metric.negativeCount;
      return summary;
    },
    {
      avgRating: weightedAverageFromDailyMetrics(metrics),
      reviewCount: 0,
      positiveCount: 0,
      neutralCount: 0,
      negativeCount: 0,
    }
  );
};

const sentimentRate = (count, total) => {
  return total ? (count / total) * 100 : 0;
};

const buildAlerts = ({
  ratingChange,
  ratingDirection,
  negativeTrend,
  positiveTrend,
  reviewSpike,
}) => {
  const alerts = [];

  if (ratingChange <= RATING_DROP_THRESHOLD) {
    alerts.push("Customer satisfaction is decreasing");
  } else if (ratingChange >= RATING_INCREASE_THRESHOLD) {
    alerts.push("Customer satisfaction is improving");
  }

  if (negativeTrend >= NEGATIVE_SHIFT_THRESHOLD) {
    alerts.push("Negative feedback is rising");
  }

  if (positiveTrend <= POSITIVE_DROP_THRESHOLD) {
    alerts.push("Positive sentiment is declining");
  }

  if (reviewSpike) {
    alerts.push("Review volume has spiked unusually");
  }

  if (!alerts.length && ratingDirection === "stable") {
    alerts.push("No major trend alerts detected");
  }

  return alerts;
};

export const analyzeTrends = async ({ scope, scopeId, now = new Date() }) => {
  const today = startOfMetricsDay(now);
  const currentStart = addDays(today, -6);
  const previousStart = addDays(currentStart, -WINDOW_DAYS);

  await refreshDailyMetricsForRange({
    scope,
    scopeId,
    startDate: previousStart,
    endDate: today,
  });

  const metrics = await prisma.dailyMetrics.findMany({
    where: {
      scope,
      scopeId,
      date: {
        gte: previousStart,
        lte: today,
      },
    },
    orderBy: {
      date: "asc",
    },
  });

  const previousMetrics = metrics.filter((metric) => metric.date >= previousStart && metric.date < currentStart);
  const currentMetrics = metrics.filter((metric) => metric.date >= currentStart && metric.date <= today);
  const previous = summarizeWindow(previousMetrics);
  const current = summarizeWindow(currentMetrics);

  const ratingChange = percentChange(current.avgRating, previous.avgRating);
  const negativeTrend = round(
    sentimentRate(current.negativeCount, current.reviewCount) -
      sentimentRate(previous.negativeCount, previous.reviewCount)
  );
  const positiveTrend = round(
    sentimentRate(current.positiveCount, current.reviewCount) -
      sentimentRate(previous.positiveCount, previous.reviewCount)
  );
  const reviewVolumeChange = percentChange(current.reviewCount, previous.reviewCount);
  const reviewSpike = reviewVolumeChange >= REVIEW_SPIKE_THRESHOLD && current.reviewCount >= 5;
  const ratingDirection =
    ratingChange <= RATING_DROP_THRESHOLD
      ? "down"
      : ratingChange >= RATING_INCREASE_THRESHOLD
        ? "up"
        : "stable";

  return {
    scope,
    scopeId,
    window: {
      current: {
        start: currentStart,
        end: today,
      },
      previous: {
        start: previousStart,
        end: addDays(currentStart, -1),
      },
    },
    ratingChange,
    ratingDirection,
    negativeTrend,
    positiveTrend,
    reviewVolumeChange,
    reviewSpike,
    alerts: buildAlerts({
      ratingChange,
      ratingDirection,
      negativeTrend,
      positiveTrend,
      reviewSpike,
    }),
    current,
    previous,
  };
};

const LLM_API_URL = process.env.LLM_API_URL || "https://api.openai.com/v1/chat/completions";
const LLM_MODEL = process.env.LLM_MODEL || "gpt-4o-mini";
const MAX_REVIEW_COMMENTS = 40;

const emptyDistribution = {
  positive: 0,
  neutral: 0,
  negative: 0,
};

const emptyRatingDistribution = {
  1: 0,
  2: 0,
  3: 0,
  4: 0,
  5: 0,
};

const normalizeList = (items, fallback) => {
  if (!Array.isArray(items)) {
    return fallback;
  }

  return items
    .filter((item) => typeof item === "string" && item.trim())
    .map((item) => item.trim())
    .slice(0, 5);
};

const normalizeReport = (report, fallback) => ({
  summary: typeof report?.summary === "string" && report.summary.trim()
    ? report.summary.trim()
    : fallback.summary,
  positives: normalizeList(report?.positives, fallback.positives),
  negatives: normalizeList(report?.negatives, fallback.negatives),
  suggestions: normalizeList(report?.suggestions, fallback.suggestions),
});

const parseJsonReport = (content) => {
  if (!content) {
    return null;
  }

  const trimmed = content.trim();
  const withoutFence = trimmed
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/```$/i, "")
    .trim();

  return JSON.parse(withoutFence);
};

const dominantSentiment = (distribution = emptyDistribution) => {
  return Object.entries(distribution).sort((a, b) => b[1] - a[1])[0]?.[0] || "neutral";
};

const averageRatingFromDistribution = (distribution = emptyRatingDistribution) => {
  const totals = Object.entries(distribution).reduce(
    (acc, [rating, count]) => {
      acc.score += Number(rating) * count;
      acc.count += count;
      return acc;
    },
    { score: 0, count: 0 }
  );

  return totals.count ? Number((totals.score / totals.count).toFixed(2)) : 0;
};

const buildFallbackReport = ({
  scope = "product",
  sentimentDistribution = emptyDistribution,
  ratingDistribution = emptyRatingDistribution,
  reviews = [],
  topProducts = [],
  trendInsights,
}) => {
  const sentiment = dominantSentiment(sentimentDistribution);
  const averageRating = averageRatingFromDistribution(ratingDistribution);
  const hasReviews = reviews.length > 0;
  const topProductNames = topProducts.map((product) => product.name).filter(Boolean).slice(0, 3);

  if (!hasReviews) {
    return {
      summary: `There are not enough trusted reviews yet to generate a reliable ${scope} insight.`,
      positives: [],
      negatives: [],
      suggestions: ["Collect more customer reviews before making business decisions."],
    };
  }

  const positives = [];
  const negatives = [];
  const suggestions = [];

  if (sentiment === "positive") {
    positives.push("Customer sentiment is mostly positive");
    suggestions.push("Highlight the strongest customer feedback in product and shop messaging.");
  } else if (sentiment === "negative") {
    negatives.push("Customer sentiment is mostly negative");
    suggestions.push("Review recent complaints and prioritize fixes for repeated customer pain points.");
  } else {
    positives.push("Customer sentiment is balanced");
    suggestions.push("Look for small experience improvements that can move neutral customers toward positive reviews.");
  }

  if (averageRating >= 4) {
    positives.push("Ratings indicate strong customer satisfaction");
  } else if (averageRating > 0 && averageRating < 3) {
    negatives.push("Ratings suggest customer satisfaction needs attention");
    suggestions.push("Investigate low-rated reviews and address the most common quality or service issues.");
  }

  if (topProductNames.length) {
    positives.push(`Top performing products include ${topProductNames.join(", ")}`);
  }

  if (trendInsights?.negativeTrend >= 15) {
    negatives.push("Negative feedback has increased in the last week");
    suggestions.push("Prioritize the issues mentioned in recent negative comments.");
  }

  if (trendInsights?.ratingChange <= -15) {
    negatives.push("Average rating has dropped compared with the previous week");
    suggestions.push("Investigate recent operational or product changes that may have affected satisfaction.");
  }

  if (trendInsights?.reviewSpike) {
    suggestions.push("Review the reason behind the sudden increase in customer feedback volume.");
  }

  return {
    summary: `Trusted reviews show ${sentiment} sentiment with an average rating of ${averageRating || "not enough data"}. Focus on patterns in recent comments to improve the customer experience.`,
    positives: positives.slice(0, 5),
    negatives: negatives.slice(0, 5),
    suggestions: suggestions.slice(0, 5),
  };
};

export const buildInsightPrompt = ({
  scope = "product",
  productName,
  shopName,
  reviews = [],
  sentimentDistribution = emptyDistribution,
  ratingDistribution = emptyRatingDistribution,
  trustScores = [],
  topProducts = [],
  trendInsights,
}) => {
  const limitedReviews = reviews
    .filter((review) => typeof review === "string" && review.trim())
    .slice(0, MAX_REVIEW_COMMENTS);

  return [
    {
      role: "system",
      content:
        "You are a business insight analyst. Generate concise, practical customer feedback insights for a shop owner. Return only valid JSON.",
    },
    {
      role: "user",
      content: JSON.stringify(
        {
          task:
            "Summarize sentiment patterns, extract common praise and complaints, use trendInsights to mention last-week changes, and generate actionable business suggestions.",
          outputFormat: {
            summary: "one concise business-friendly paragraph",
            positives: ["short theme"],
            negatives: ["short theme"],
            suggestions: ["clear action"],
          },
          rules: [
            "Use business-friendly language",
            "Do not mention raw IDs",
            "Keep each list to at most 5 items",
            "Do not invent issues that are not supported by the data",
            "If trendInsights shows rising negative sentiment, falling ratings, or review spikes, mention that clearly in the summary or suggestions",
          ],
          context: {
            scope,
            productName,
            shopName,
            sentimentDistribution,
            ratingDistribution,
            trustScores,
            topProducts,
            trendInsights,
            reviewComments: limitedReviews,
          },
        },
        null,
        2
      ),
    },
  ];
};

const callLlm = async (messages) => {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY is not configured");
  }

  const response = await fetch(LLM_API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: LLM_MODEL,
      messages,
      temperature: 0.2,
      response_format: { type: "json_object" },
    }),
  });

  if (!response.ok) {
    throw new Error(`LLM API returned ${response.status}`);
  }

  const payload = await response.json();
  return payload.choices?.[0]?.message?.content;
};

export const generateInsightReport = async (input) => {
  const fallback = buildFallbackReport(input);
  const prompt = buildInsightPrompt(input);

  try {
    const content = await callLlm(prompt);
    const parsedReport = parseJsonReport(content);

    return {
      report: normalizeReport(parsedReport, fallback),
      source: "llm",
      prompt: prompt.map((message) => `${message.role}: ${message.content}`).join("\n\n"),
      model: LLM_MODEL,
    };
  } catch (err) {
    console.warn("LLM insight generation failed:", err.message);

    return {
      report: fallback,
      source: "fallback",
      prompt: prompt.map((message) => `${message.role}: ${message.content}`).join("\n\n"),
      model: null,
    };
  }
};

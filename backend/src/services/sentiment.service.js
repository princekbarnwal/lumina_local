const ML_SERVICE_URL = process.env.ML_SERVICE_URL || "http://localhost:8000";
const VALID_SENTIMENTS = new Set(["positive", "neutral", "negative"]);

export const analyzeSentiment = async (comment) => {
  if (typeof comment !== "string" || !comment.trim()) {
    return null;
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 3000);

  try {
    const response = await fetch(`${ML_SERVICE_URL}/analyze`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ reviews: [comment] }),
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(`ML service returned ${response.status}`);
    }

    const results = await response.json();
    const sentiment = Array.isArray(results) ? results[0]?.sentiment : null;

    return VALID_SENTIMENTS.has(sentiment) ? sentiment : null;
  } catch (err) {
    console.warn("Sentiment analysis failed:", err.message);
    return null;
  } finally {
    clearTimeout(timeout);
  }
};

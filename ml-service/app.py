from flask import Flask, jsonify, request
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer

app = Flask(__name__)
analyzer = SentimentIntensityAnalyzer()


def classify_sentiment(text):
    compound = analyzer.polarity_scores(text or "")["compound"]

    if compound >= 0.05:
        return "positive"
    if compound <= -0.05:
        return "negative"

    return "neutral"


@app.post("/analyze")
def analyze_reviews():
    payload = request.get_json(silent=True) or {}
    reviews = payload.get("reviews")

    if not isinstance(reviews, list):
        return jsonify({"error": "reviews must be an array of strings"}), 400

    results = [
        {"sentiment": classify_sentiment(review)}
        for review in reviews
        if isinstance(review, str)
    ]

    if len(results) != len(reviews):
        return jsonify({"error": "reviews must be an array of strings"}), 400

    return jsonify(results)


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000)

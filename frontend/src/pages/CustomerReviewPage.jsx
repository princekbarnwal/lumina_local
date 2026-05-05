import { Send } from "lucide-react";
import { useState } from "react";
import { useParams } from "react-router-dom";
import RatingInput from "../components/RatingInput.jsx";
import { api } from "../services/api.js";

function CustomerReviewPage() {
  const { productId } = useParams();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [userIdentifier, setUserIdentifier] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const submitReview = async (event) => {
    event.preventDefault();
    setMessage("");
    setError("");

    try {
      await api.submitReview({
        productId: Number(productId),
        rating,
        comment,
        userIdentifier,
      });
      setMessage("Thank you. Your review has been submitted.");
      setComment("");
      setUserIdentifier("");
      setRating(5);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FF] px-4 py-8 text-slate-900">
      <main className="glass-panel mx-auto max-w-md p-6">
        <div className="mb-5 rounded-lg bg-slate-950 p-5 text-white">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-indigo-200">Local Sentiment</p>
          <h1 className="mt-2 text-2xl font-extrabold">Rate Your Experience</h1>
          <p className="mt-1 text-sm text-slate-300">Product #{productId}</p>
        </div>

        <form onSubmit={submitReview} className="mt-5 space-y-4">
          <label className="block">
            <span className="mb-2 block text-sm font-bold text-slate-700">Stars</span>
            <RatingInput value={rating} onChange={setRating} />
          </label>

          <label className="block">
            <span className="mb-1 block text-sm font-bold text-slate-700">Comment</span>
            <textarea
              value={comment}
              onChange={(event) => setComment(event.target.value)}
              rows="4"
              placeholder="Write a short review"
              className="field"
            />
          </label>

          <label className="block">
            <span className="mb-1 block text-sm font-bold text-slate-700">Phone or email</span>
            <input
              value={userIdentifier}
              onChange={(event) => setUserIdentifier(event.target.value)}
              placeholder="Used only to avoid duplicate reviews"
              className="field"
              required
            />
          </label>

          {message ? <div className="rounded-md bg-green-50 p-3 text-sm text-green-700">{message}</div> : null}
          {error ? <div className="rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</div> : null}

          <button
            type="submit"
            className="primary-action w-full"
          >
            <Send className="h-4 w-4" />
            Submit Review
          </button>
        </form>
      </main>
    </div>
  );
}

export default CustomerReviewPage;

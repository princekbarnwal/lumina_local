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
    <div className="min-h-screen bg-slate-50 px-4 py-8 text-slate-900">
      <main className="mx-auto max-w-md rounded-md border border-slate-200 bg-white p-5">
        <h1 className="text-xl font-semibold">Rate Your Experience</h1>
        <p className="mt-1 text-sm text-slate-500">Product #{productId}</p>

        <form onSubmit={submitReview} className="mt-5 space-y-4">
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-700">Stars</span>
            <RatingInput value={rating} onChange={setRating} />
          </label>

          <label className="block">
            <span className="mb-1 block text-sm font-medium text-slate-700">Comment</span>
            <textarea
              value={comment}
              onChange={(event) => setComment(event.target.value)}
              rows="4"
              placeholder="Write a short review"
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500"
            />
          </label>

          <label className="block">
            <span className="mb-1 block text-sm font-medium text-slate-700">Phone or email</span>
            <input
              value={userIdentifier}
              onChange={(event) => setUserIdentifier(event.target.value)}
              placeholder="Used only to avoid duplicate reviews"
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500"
              required
            />
          </label>

          {message ? <div className="rounded-md bg-green-50 p-3 text-sm text-green-700">{message}</div> : null}
          {error ? <div className="rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</div> : null}

          <button
            type="submit"
            className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
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

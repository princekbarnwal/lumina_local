import { Send } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import RatingInput from "../components/RatingInput.jsx";
import { api } from "../services/api.js";

function ProductReviewPage() {
  const params = useParams();
  const [shopId, setShopId] = useState(params.shopId || "");
  const [products, setProducts] = useState([]);
  const [productId, setProductId] = useState("");
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [userIdentifier, setUserIdentifier] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!shopId) {
      setProducts([]);
      return;
    }

    api
      .getShopProducts(shopId)
      .then(setProducts)
      .catch((err) => setError(err.message));
  }, [shopId]);

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
      setMessage("Review submitted. Thank you.");
      setComment("");
      setUserIdentifier("");
      setRating(5);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-5">
      <div>
        <h2 className="text-lg font-semibold">Product Review</h2>
        <p className="text-sm text-slate-500">Public page for QR review collection.</p>
      </div>

      <form onSubmit={submitReview} className="space-y-4 rounded-md border border-slate-200 bg-white p-4">
        <label className="block">
          <span className="mb-1 block text-sm font-medium text-slate-700">Shop ID</span>
          <input
            value={shopId}
            onChange={(event) => setShopId(event.target.value)}
            placeholder="Example: 1"
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500"
          />
        </label>

        <label className="block">
          <span className="mb-1 block text-sm font-medium text-slate-700">Product</span>
          <select
            value={productId}
            onChange={(event) => setProductId(event.target.value)}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500"
            required
          >
            <option value="">Select product</option>
            {products.map((product) => (
              <option key={product.id} value={product.id}>
                {product.name}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-medium text-slate-700">Rating</span>
          <RatingInput value={rating} onChange={setRating} />
        </label>

        <label className="block">
          <span className="mb-1 block text-sm font-medium text-slate-700">Comment</span>
          <textarea
            value={comment}
            onChange={(event) => setComment(event.target.value)}
            rows="4"
            placeholder="Tell us about your experience"
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500"
          />
        </label>

        <label className="block">
          <span className="mb-1 block text-sm font-medium text-slate-700">Your phone or email</span>
          <input
            value={userIdentifier}
            onChange={(event) => setUserIdentifier(event.target.value)}
            placeholder="Used to avoid duplicate reviews"
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
    </div>
  );
}

export default ProductReviewPage;

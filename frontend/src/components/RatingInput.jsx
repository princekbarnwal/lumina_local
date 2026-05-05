import { Star } from "lucide-react";

function RatingInput({ value, onChange }) {
  return (
    <div className="flex gap-2">
      {[1, 2, 3, 4, 5].map((rating) => (
        <button
          key={rating}
          type="button"
          onClick={() => onChange(rating)}
          className="rounded-md p-1 hover:bg-slate-100"
          aria-label={`${rating} star rating`}
        >
          <Star
            className={`h-7 w-7 ${
              rating <= value ? "fill-amber-400 text-amber-400" : "text-slate-300"
            }`}
          />
        </button>
      ))}
    </div>
  );
}

export default RatingInput;

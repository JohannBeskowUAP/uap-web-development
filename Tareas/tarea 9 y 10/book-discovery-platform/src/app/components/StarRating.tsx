"use client";

interface StarRatingProps {
  rating: number;
  onChange?: (rating: number) => void;
}

export default function StarRating({ rating, onChange }: StarRatingProps) {
  return (
    <div className="flex space-x-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange && onChange(star)}
          className={star <= rating ? "text-yellow-500" : "text-gray-400"}
        >
          ★
        </button>
      ))}
    </div>
  );
}

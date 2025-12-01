interface ReviewProps {
  review: {
    user: string;
    rating: number;
    comment: string;
    votes: number;
  };
}

export default function ReviewCard({ review }: ReviewProps) {
  return (
    <div className="bg-neutral-900 p-4 rounded-lg shadow-md space-y-2">
      <div className="flex justify-between">
        <span className="font-semibold">{review.user}</span>
        <span className="text-blue-200">⭐ {review.rating}</span>
      </div>
      <p className="text-neutral-300">{review.comment}</p>
      <div className="flex gap-3 text-sm text-neutral-400">
        <span>👍 {review.votes}</span>
      </div>
    </div>
  );
}

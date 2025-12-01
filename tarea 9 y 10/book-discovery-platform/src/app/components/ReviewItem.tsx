interface ReviewItemProps {
  user: string;
  rating: number;
  comment: string;
}

export default function ReviewItem({ user, rating, comment }: ReviewItemProps) {
  return (
    <div className="border rounded-lg p-3 shadow-sm">
      <p className="font-semibold">{user}</p>
      <p className="text-yellow-500">{"★".repeat(rating)}</p>
      <p>{comment}</p>
    </div>
  );
}

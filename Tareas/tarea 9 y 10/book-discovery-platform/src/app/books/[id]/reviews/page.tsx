'use client';
import { useState, useEffect } from "react";

interface Review {
  _id?: string;
  userName: string;
  rating: number;
  comment: string;
}

export default function BookReviewsPage({ params }: { params: { id: string } }) {
  const [review, setReview] = useState({ rating: 5, comment: "", userName: "" });
  const [reviews, setReviews] = useState<Review[]>([]);
  const [submitted, setSubmitted] = useState(false);

  const fetchReviews = async () => {
    const res = await fetch(`/api/books/${params.id}/reviews`);
    const data = await res.json();
    setReviews(data.reviews || []);
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch(`/api/books/${params.id}/reviews`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(review),
    });
    if (res.ok) {
      setSubmitted(true);
      setReview({ rating: 5, comment: "", userName: "" });
      fetchReviews();
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-10 px-4 space-y-6">
      <h1 className="text-2xl font-bold">Reseñas para el libro {params.id}</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">Nombre</label>
          <input
            type="text"
            value={review.userName}
            onChange={(e) => setReview({ ...review, userName: e.target.value })}
            className="border rounded px-2 py-1 w-full"
          />
        </div>

        <div>
          <label className="block mb-1">Calificación</label>
          <select
            value={review.rating}
            onChange={(e) =>
              setReview({ ...review, rating: Number(e.target.value) })
            }
            className="border rounded px-2 py-1"
          >
            {[5, 4, 3, 2, 1].map((r) => (
              <option key={r} value={r}>{r} ⭐</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-1">Comentario</label>
          <textarea
            value={review.comment}
            onChange={(e) => setReview({ ...review, comment: e.target.value })}
            className="w-full border rounded px-2 py-1"
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
        >
          Enviar reseña
        </button>

        {submitted && (
          <p className="text-green-600 mt-2">Reseña enviada correctamente!</p>
        )}
      </form>

      <div className="mt-8 space-y-4">
        {reviews.map((r) => (
          <div key={r._id} className="border rounded p-3 bg-gray-50">
            <p className="text-sm text-gray-700">{r.comment}</p>
            <p className="text-xs text-gray-500">
              {r.userName || "Anonymous"} - {r.rating} ⭐
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

'use client';
import { use, useState, useEffect } from 'react';
import { FaStar, FaRegStar } from 'react-icons/fa';
import { GoHeart, GoHeartFill } from 'react-icons/go';

interface Review {
  _id?: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt?: string;
}

interface BookInfo {
  title: string;
}

export default function BookReviewsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [book, setBook] = useState<BookInfo | null>(null);
  const [review, setReview] = useState<Omit<Review, '_id' | 'userName'>>({
    rating: 0,
    comment: '',
  });
  const [reviews, setReviews] = useState<Review[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [loadingFavorite, setLoadingFavorite] = useState(false);

  // Fetch book info
  const fetchBook = async () => {
    try {
      const res = await fetch(`https://www.googleapis.com/books/v1/volumes/${id}`);
      const data = await res.json();
      setBook({ title: data.volumeInfo?.title || 'Libro desconocido' });
    } catch {
      setBook({ title: 'Libro desconocido' });
    }
  };

  // Fetch reviews
  const fetchReviews = async () => {
    try {
      const res = await fetch(`/api/books/${id}/reviews`);
      const data = await res.json();
      setReviews(data.reviews || []);
    } catch (err) {
      console.error('Error fetching reviews:', err);
    }
  };

  // Check favorite status
  const fetchFavoriteStatus = async () => {
    try {
      const res = await fetch(`/api/favorites/status?bookId=${id}`);
      if (res.ok) {
        const data = await res.json();
        setIsFavorite(data.isFavorite || false);
      }
    } catch (err) {
      console.error('Error fetching favorite status:', err);
    }
  };

  useEffect(() => {
    fetchBook();
    fetchReviews();
    fetchFavoriteStatus();
  }, [id]);

  // Submit review
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!review.comment.trim() || review.rating === 0) return;

    const res = await fetch(`/api/books/${id}/reviews`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...review,
        userName: 'Anonymous',
      }),
    });

    if (res.ok) {
      setReview({ rating: 0, comment: '' });
      setSubmitted(true);
      fetchReviews();
      setTimeout(() => setSubmitted(false), 2000);
    }
  };

  // Toggle favorite
  const toggleFavorite = async () => {
    const method = isFavorite ? "DELETE" : "POST";
    const res = await fetch("/api/favorites", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ bookId: id }),
    });

    if (res.ok) {
      setIsFavorite(!isFavorite);
    }
  };


  return (
    <div className="max-w-[768px] mx-auto py-10 px-4 space-y-8">
      {/* Title and Favorite */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">
          Reseñas para <span className="text-blue-600">{book?.title || 'Cargando...'}</span>
        </h1>
        <button
          onClick={toggleFavorite}
          disabled={loadingFavorite}
          className={`flex items-center gap-2 px-3 py-1 rounded-md border transition 
            ${isFavorite ? 'bg-pink-100 border-pink-300 text-pink-600' : 'bg-gray-100 border-gray-300 text-gray-600'}
            hover:bg-opacity-80`}
        >
          {isFavorite ? <GoHeartFill size={18} /> : <GoHeart size={18} />}
          <span>{isFavorite ? 'Favorito' : 'Favorite'}</span>
        </button>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="space-y-5 bg-white p-6 rounded-xl shadow-md border border-gray-200"
      >
        <div>
          <label className="block font-semibold mb-2">Tu calificación</label>
          <div className="flex gap-2 justify-center">
            {[1, 2, 3, 4, 5].map((star) => {
              const isFilled = review.rating >= star;
              return (
                <button
                  key={star}
                  type="button"
                  onClick={() => setReview((prev) => ({ ...prev, rating: star }))}
                  className="text-3xl focus:outline-none hover:scale-110 transition-transform duration-200"
                >
                  {isFilled ? (
                    <FaStar className="text-yellow-400 transition-colors duration-200" />
                  ) : (
                    <FaRegStar className="text-gray-400 transition-colors duration-200" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <label className="block font-semibold mb-2">Comentario</label>
          <textarea
            value={review.comment}
            onChange={(e) => setReview({ ...review, comment: e.target.value })}
            className="w-full border border-gray-300 rounded-md px-3 py-2 resize-none"
            rows={3}
            placeholder="Escribí tu opinión..."
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2 rounded-lg transition-colors duration-200"
        >
          Enviar reseña
        </button>

        {submitted && (
          <p className="text-green-600 font-medium mt-2 text-center">
            ¡Reseña enviada correctamente!
          </p>
        )}
      </form>

      {/* Reviews list */}
      <div className="space-y-4">
        {reviews.length === 0 ? (
          <p className="text-gray-500 italic text-center">Todavía no hay reseñas.</p>
        ) : (
          reviews.map((r) => (
            <div key={r._id} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
              <div className="flex items-center justify-between mb-2">
                <p className="font-semibold">{r.userName || 'Anónimo'}</p>
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((s) =>
                    s <= r.rating ? (
                      <FaStar key={s} className="w-5 h-5 text-yellow-400" />
                    ) : (
                      <FaRegStar key={s} className="w-5 h-5 text-gray-300" />
                    )
                  )}
                </div>
              </div>
              <p className="text-gray-700">{r.comment}</p>
              <p className="text-xs text-gray-400 mt-1">
                {r.createdAt ? new Date(r.createdAt).toLocaleDateString() : ''}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

'use client';

import { useEffect, useState } from 'react';

interface GoogleBook {
  id: string;
  volumeInfo: {
    title: string;
    authors?: string[];
    imageLinks?: { thumbnail?: string };
  };
}

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<GoogleBook[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchFavorites = async () => {
    try {
      // 1️⃣ Get the list of favorite book IDs for the current user
      const res = await fetch('/api/favorites');
      const data = await res.json();
      const favoriteIds: string[] = data.favorites || [];

      if (favoriteIds.length === 0) {
        setFavorites([]);
        setLoading(false);
        return;
      }

      // 2️⃣ Fetch details for each book from Google Books API
      const booksData = await Promise.all(
        favoriteIds.map(async (id) => {
          const res = await fetch(`https://www.googleapis.com/books/v1/volumes/${id}`);
          const book = await res.json();
          return book;
        })
      );

      setFavorites(booksData);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching favorite books:', err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  if (loading) return <p className="p-6 text-center">Cargando favoritos...</p>;

  if (favorites.length === 0)
    return (
      <main className="p-6">
        <h1 className="text-2xl font-bold mb-4">Favoritos</h1>
        <p>No tienes libros favoritos todavía.</p>
      </main>
    );

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-6">Favoritos</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {favorites.map((book) => (
          <div
            key={book.id}
            className="border border-gray-200 rounded-lg p-4 shadow-sm flex flex-col items-center"
          >
            {book.volumeInfo.imageLinks?.thumbnail ? (
              <img
                src={book.volumeInfo.imageLinks.thumbnail}
                alt={book.volumeInfo.title}
                className="w-32 h-auto mb-3"
              />
            ) : (
              <div className="w-32 h-48 bg-gray-200 mb-3 flex items-center justify-center">
                Sin imagen
              </div>
            )}
            <h2 className="font-semibold text-center">{book.volumeInfo.title}</h2>
            {book.volumeInfo.authors && (
              <p className="text-sm text-gray-600 text-center">
                {book.volumeInfo.authors.join(', ')}
              </p>
            )}
          </div>
        ))}
      </div>
    </main>
  );
}

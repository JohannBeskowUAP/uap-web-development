'use client';

import { useState } from 'react';

export default function Home() {
  const [query, setQuery] = useState('');
  const [books, setBooks] = useState<any[]>([]);

  const handleSearch = async () => {
    const res = await fetch(`/api/books/search?q=${encodeURIComponent(query)}`);
    const data = await res.json();
    setBooks(data.books || []);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8 text-center">📚 Buscar Libros</h1>

        <div className="flex gap-3 mb-10 justify-center">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="border border-gray-300 rounded-lg p-2 w-full max-w-md shadow-sm focus:ring-2 focus:ring-blue-400 outline-none"
            placeholder="Título, autor o ISBN..."
          />
          <button
            onClick={handleSearch}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-all shadow"
          >
            Buscar
          </button>
        </div>

        {/* Books container with margins */}
        <div className="mx-6 sm:mx-10 md:mx-16 lg:mx-24 xl:mx-32">
          <div
            className="grid gap-6"
            style={{
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            }}
          >
            {books.map((book) => (
              <div
                key={book.googleId}
                className="border border-gray-200 bg-white rounded-lg p-3 shadow-sm hover:shadow-md hover:scale-[1.03] transition-all flex flex-col items-center"
                style={{ maxWidth: '200px', minWidth: '0' }}
              >
                <div className="relative w-[120px] h-[180px] mb-3 overflow-hidden rounded-md bg-gray-100 flex items-center justify-center">
                  {book.thumbnail ? (
                    <img
                      src={book.thumbnail}
                      alt={book.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-400 text-xs">
                      No Image
                    </div>
                  )}
                </div>

                <h2 className="font-semibold text-sm line-clamp-2 min-h-[2.5rem] text-center">
                  {book.title}
                </h2>
                <p className="text-xs text-gray-500 mt-1 line-clamp-1 text-center">
                  {book.authors?.join(', ') || 'Autor desconocido'}
                </p>
              </div>
            ))}
          </div>
        </div>

        {books.length === 0 && (
          <p className="text-center text-gray-400 mt-12">
            🔍 No se encontraron libros. Intenta con otro término.
          </p>
        )}
      </div>
    </div>
  );
}

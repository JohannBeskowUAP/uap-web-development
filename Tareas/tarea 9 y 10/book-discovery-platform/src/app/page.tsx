'use client';

import { useState } from 'react';

export default function Home() {
  const [query, setQuery] = useState('');
  const [books, setBooks] = useState<any[]>([]);

  const handleSearch = async () => {
    const res = await fetch(`/api/books/search?q=${encodeURIComponent(query)}`);
    const data = await res.json();
    setBooks(data.books);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Buscar Libros</h1>
      <div className="flex gap-2 mb-6">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="border p-2 flex-1"
          placeholder="Título, autor o ISBN"
        />
        <button onClick={handleSearch} className="bg-blue-500 text-white px-4 py-2 rounded">
          Buscar
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {books.map((book) => (
          <div key={book.googleId} className="border p-4 rounded">
            <img src={book.thumbnail} alt={book.title} className="mb-2 w-full h-48 object-cover"/>
            <h2 className="font-semibold">{book.title}</h2>
            <p className="text-sm text-gray-600">{book.authors.join(', ')}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

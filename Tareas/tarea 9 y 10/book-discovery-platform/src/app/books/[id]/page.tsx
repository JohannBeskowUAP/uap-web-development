// app/books/[id]/page.tsx
import Link from "next/link";

interface BookDetailProps {
  params: { id: string };
}

async function getBook(id: string) {
  const res = await fetch(`https://www.googleapis.com/books/v1/volumes/${id}`);
  if (!res.ok) throw new Error('Failed to fetch book data');
  return res.json();
}

export default async function BookDetailPage({ params }: BookDetailProps) {
  const book = await getBook(params.id);
  const info = book.volumeInfo;

  return (
    <div className="max-w-4xl mx-auto py-10 px-4 space-y-6">
      {/* Book header: portada + título */}
      <div className="flex flex-col md:flex-row gap-6">
        {info.imageLinks?.thumbnail && (
          <div className="flex-shrink-0">
            <img
              src={info.imageLinks.thumbnail.replace('http:', 'https:')}
              alt={info.title}
              className="w-48 h-64 object-cover rounded-md shadow-md"
            />
          </div>
        )}
        <div className="flex flex-col justify-between">
          <div>
            <h1 className="text-3xl font-bold">{info.title}</h1>
            <p className="text-gray-500 mt-1">{info.authors?.join(", ")}</p>
            <p className="text-gray-400 text-sm mt-1">{info.publishedDate}</p>
          </div>
          <Link
            href={`/books/${params.id}/reviews`}
            className="mt-4 inline-block bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
          >
            Ver / Escribir Reseñas
          </Link>
        </div>
      </div>

      {/* Book details */}
      <div className="space-y-2">
        {info.description && (
          <p className="text-gray-800">{info.description}</p>
        )}
        <div className="text-sm text-gray-600">
          {info.pageCount && <p>Páginas: {info.pageCount}</p>}
          {info.categories && <p>Categorías: {info.categories.join(", ")}</p>}
          {info.publisher && <p>Editorial: {info.publisher}</p>}
          {info.publishedDate && <p>Fecha de publicación: {info.publishedDate}</p>}
          {info.language && <p>Idioma: {info.language}</p>}
        </div>
      </div>
    </div>
  );
}

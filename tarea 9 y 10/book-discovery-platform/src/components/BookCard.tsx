import React from "react";
import { GoogleBook } from "@/types";

interface BookCardProps {
  book: GoogleBook;
}

const BookCard: React.FC<BookCardProps> = ({ book }) => {
  const { title, authors, description, publishedDate, categories, imageLinks, infoLink } =
    book.volumeInfo;

  return (
    <article className="flex flex-col sm:flex-row gap-4 rounded-sm bg-gray-700/60 p-4 shadow-sm hover:shadow-md transition">
      {imageLinks?.thumbnail && (
        <img
          src={imageLinks.thumbnail}
          alt={title}
          className="w-28 h-40 object-cover rounded-sm bg-gray-600 flex-shrink-0"
        />
      )}

      <div className="flex flex-col justify-between flex-1">
        <div>
          <h3 className="text-lg font-semibold text-white hover:text-blue-200">
            <a href={infoLink || "#"} target="_blank" rel="noopener noreferrer">
              {title}
            </a>
          </h3>
          <p className="mt-2 text-sm text-gray-400 line-clamp-3">
            {description || "Sin descripción disponible."}
          </p>
        </div>

        <div className="mt-3 flex justify-between text-xs text-gray-300">
          <span>{authors?.join(", ") || "Autor desconocido"}</span>
          <span>{publishedDate || ""}</span>
        </div>

        {categories && categories.length > 0 && (
          <span className="mt-2 inline-block rounded-full bg-gray-700/50 px-2 py-0.5 text-xs text-gray-300">
            {categories[0]}
          </span>
        )}
      </div>
    </article>
  );
};

export default BookCard;

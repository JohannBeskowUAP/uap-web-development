// src/components/BookCard.tsx
import React from "react";
import { GoogleBook } from "@/types";

type Props = {
  book: GoogleBook;
};

export default function BookCard({ book }: Props) {
  const { title, authors, description, imageLinks, publishedDate } = book.volumeInfo;

  return (
    <article className="flex flex-col justify-between rounded-sm border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md">
      <div className="grow">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>

        {/* description: limit to approx 3 lines using max-height */}
        <p className="mt-3 text-sm text-gray-600 leading-5 max-h-[4.5rem] overflow-hidden">
          {description ?? "No description available."}
        </p>
      </div>

      <div className="mt-4 flex items-center gap-3">
        {imageLinks?.thumbnail ? (
          <img
            src={imageLinks.thumbnail}
            alt={title}
            className="w-14 h-20 object-cover rounded-sm bg-gray-100"
            loading="lazy"
          />
        ) : (
          <div className="w-14 h-20 rounded-sm bg-gray-100" />
        )}

        <div className="text-sm">
          <p className="font-medium text-gray-900">
            {authors?.join(", ") ?? "Unknown author"}
          </p>
          <p className="text-xs text-gray-500">{publishedDate ?? "—"}</p>
        </div>
      </div>
    </article>
  );
}

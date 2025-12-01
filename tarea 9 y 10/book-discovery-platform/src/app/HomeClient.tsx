// app/HomeClient.tsx
"use client";

import { useState } from "react";
import { GoogleBook } from "@/types"; // optional type export

export default function HomeClient() {
  const [query, setQuery] = useState("");
  const [books, setBooks] = useState<GoogleBook[]>([]);

  const searchBooks = async () => {
    if (!query) return;
    try {
      const res = await fetch(
        `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}`
      );
      const data = await res.json();
      setBooks(data.items || []);
    } catch (err) {
      console.error("Error fetching books:", err);
    }
  };

  return (
    <div>
      {/* your existing input, button, and books display */}
    </div>
  );
}

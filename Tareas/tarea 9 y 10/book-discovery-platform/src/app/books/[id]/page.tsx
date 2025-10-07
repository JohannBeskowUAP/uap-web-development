import ReviewCard from "@/components/ReviewCard";
async function getBook(id: string) {
  const res = await fetch(`https://www.googleapis.com/books/v1/volumes/${id}`);
  return res.json();
}

export default async function BookDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const book = await getBook(params.id);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex gap-6">
        {book.volumeInfo.imageLinks?.thumbnail && (
          <img
            src={book.volumeInfo.imageLinks.thumbnail}
            alt={book.volumeInfo.title}
            className="w-40 h-60 rounded-lg shadow-md"
          />
        )}
        <div>
          <h1 className="text-3xl font-bold">{book.volumeInfo.title}</h1>
          <p className="text-neutral-400">{book.volumeInfo.authors?.join(", ")}</p>
          <p className="text-sm text-neutral-500">{book.volumeInfo.publishedDate}</p>
        </div>
      </div>

      <p className="text-neutral-300">{book.volumeInfo.description}</p>

      <section>
        <h2 className="text-xl font-semibold mb-3">Reseñas</h2>
        <ReviewCard
          review={{
            user: "Test User",
            rating: 5,
            comment: "Excelente libro!",
            votes: 10,
          }}
        />
      </section>
    </div>
  );
}

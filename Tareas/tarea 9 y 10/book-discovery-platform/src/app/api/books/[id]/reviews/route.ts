import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Review from "@/models/Review";

// GET /api/books/:id/reviews
export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    await dbConnect();
    const reviews = await Review.find({ bookId: params.id }).sort({ createdAt: -1 });
    return NextResponse.json({ reviews });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Error fetching reviews" }, { status: 500 });
  }
}
export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const { rating, comment, userName } = await req.json();
    if (!rating || !comment) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    await dbConnect();

    const newReview = await Review.create({
      bookId: params.id,
      rating,
      comment,
      userName: userName || "Anonymous",
    });

    return NextResponse.json({ review: newReview });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Error creating review" }, { status: 500 });
  }
}
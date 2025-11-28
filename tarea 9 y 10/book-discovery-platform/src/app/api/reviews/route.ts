import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Review from "@/models/Review";

export async function GET() {
  await connectDB();
  const reviews = await Review.find().limit(10).lean();
  return NextResponse.json(reviews);
}

export async function POST(req: Request) {
  await connectDB();
  const body = await req.json();

  if (!body.bookId || !body.rating || !body.comment || !body.userId) {
    return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });
  }

  const review = await Review.create(body);
  return NextResponse.json(review, { status: 201 });
}

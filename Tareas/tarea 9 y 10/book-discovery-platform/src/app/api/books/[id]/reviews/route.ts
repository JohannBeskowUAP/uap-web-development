import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect'
import Review from '@/models/Review';

// GET all reviews for a book
export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await dbConnect();

  const reviews = await Review.find({ bookId: id }).sort({ createdAt: -1 });
  return NextResponse.json({ reviews });
}

// POST new review
export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await dbConnect();

  const { rating, comment, userName } = await req.json();
  const newReview = await Review.create({
    bookId: id,
    userName: userName || 'Anonymous',
    rating,
    comment,
  });

  return NextResponse.json(newReview, { status: 201 });
}

// PUT → edit a review
export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await dbConnect();

  const { reviewId, rating, comment } = await req.json();
  const updated = await Review.findByIdAndUpdate(
    reviewId,
    { rating, comment },
    { new: true }
  );

  return NextResponse.json(updated);
}

import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Review from "@/models/Review";
import { decrypt } from "@/lib/session";
import { cookies } from "next/headers";

export async function GET() {
  export async function GET() {
    await dbConnect();
    const reviews = await Review.find().limit(10).lean();
    return NextResponse.json(reviews);
  }

  export async function POST(req: Request) {
    export async function POST(req: Request) {
      await dbConnect();

      // 1. Verify Session
      const cookieStore = await cookies();
      const session = cookieStore.get("session")?.value;
      const payload = await decrypt(session);

      if (!payload || !payload.userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }

      const body = await req.json();

      // 2. Validate Data
      if (!body.bookId || !body.rating || !body.comment) {
        return NextResponse.json({ error: "Missing fields" }, { status: 400 });
      }

      // 3. Enforce User Identity (User can only post as themselves)
      const userId = payload.userId as string;

      const review = await Review.create({
        ...body,
        userId, // Force userId from session
      });
      return NextResponse.json(review, { status: 201 });
    }

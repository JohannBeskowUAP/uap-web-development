import { NextResponse } from "next/server";
import mongoose from "mongoose";
import User from "@/models/User";
import { cookies } from "next/headers";
import { decrypt } from "@/lib/session";
import type { SessionPayload } from "@/lib/definitions";

const MONGODB_URI = process.env.MONGODB_URI!;

async function connectDB() {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(MONGODB_URI);
  }
}

// Helper to get current user from session
async function getCurrentUser() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("session")?.value;

  if (!sessionToken) return null;

  const session = (await decrypt(sessionToken)) as SessionPayload | null;
  if (!session?.userId) return null;

  const user = await User.findById(session.userId);
  return user;
}

// GET favorite status
export async function GET(req: Request) {
  await connectDB();

  const url = new URL(req.url);
  const bookId = url.searchParams.get("bookId");
  if (!bookId) {
    return NextResponse.json({ error: "Missing bookId" }, { status: 400 });
  }

  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const isFavorite = user.favorites.includes(bookId);

  return NextResponse.json({ isFavorite });
}

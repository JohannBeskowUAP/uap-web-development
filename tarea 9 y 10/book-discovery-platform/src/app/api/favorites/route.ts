import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import { cookies } from "next/headers";
import { decrypt } from "@/lib/session";
import type { SessionPayload } from "@/lib/definitions";

// ✅ Helper to get current user from session cookie
async function getCurrentUser() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("session")?.value;

  if (!sessionToken) return null;

  const session = (await decrypt(sessionToken)) as SessionPayload | null;
  if (!session?.userId) return null;

  const user = await User.findById(session.userId);
  return user;
}

// ✅ GET: return current user's favorite book IDs
export async function GET() {
  await dbConnect();
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  return NextResponse.json({ favorites: user.favorites || [] });
}

// ✅ POST: add a book to favorites
export async function POST(req: Request) {
  await dbConnect();

  const { bookId } = await req.json();
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  // Add only if not already in favorites
  if (!user.favorites.includes(bookId)) {
    user.favorites.push(bookId);
    await user.save();
  }

  return NextResponse.json({ success: true, favorites: user.favorites });
}

// ✅ DELETE: remove a book from favorites
export async function DELETE(req: Request) {
  await dbConnect();

  const { bookId } = await req.json();
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  // Remove bookId from favorites
  user.favorites = user.favorites.filter((id: string) => id !== bookId);
  await user.save();

  return NextResponse.json({ success: true, favorites: user.favorites });
}

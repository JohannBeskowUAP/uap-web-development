import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { decrypt } from "@/lib/session";
import User from "@/models/User";
import Review from "@/models/Review";
import dbConnect from "@/lib/dbConnect";

export async function GET() {
  await dbConnect();

  const cookieStore = await cookies();
  const session = cookieStore.get("session")?.value;
  const payload = await decrypt(session);

  if (!payload || !payload.userId) {
    return NextResponse.json({ user: null }, { status: 401 });
  }

  try {
    const user = await User.findById(payload.userId).select("email favorites");
    if (!user) return NextResponse.json({ user: null }, { status: 401 });

    // Fetch user's reviews
    const reviews = await Review.find({ userId: payload.userId }).sort({ createdAt: -1 });

    return NextResponse.json({
      user: {
        ...user.toObject(),
        reviews
      }
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

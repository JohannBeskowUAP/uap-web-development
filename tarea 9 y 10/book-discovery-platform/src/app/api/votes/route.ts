import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Vote from "@/models/Vote";
import { decrypt } from "@/lib/session";
import { cookies } from "next/headers";

export async function POST(req: Request) {
    try {
        await dbConnect();

        // 1. Verify Session
        const cookieStore = await cookies();
        const session = cookieStore.get("session")?.value;
        const payload = await decrypt(session);

        if (!payload || !payload.userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { reviewId, type } = await req.json(); // type: 'up' or 'down'

        if (!reviewId || !['up', 'down'].includes(type)) {
            return NextResponse.json({ error: "Invalid data" }, { status: 400 });
        }

        // 2. Check for existing vote
        const existingVote = await Vote.findOne({
            userId: payload.userId,
            reviewId
        });

        if (existingVote) {
            if (existingVote.type === type) {
                // Toggle off if same vote
                await Vote.findByIdAndDelete(existingVote._id);
                return NextResponse.json({ message: "Vote removed" });
            } else {
                // Change vote
                existingVote.type = type;
                await existingVote.save();
                return NextResponse.json({ message: "Vote updated", vote: existingVote });
            }
        }

        // 3. Create new vote
        const newVote = await Vote.create({
            userId: payload.userId,
            reviewId,
            type
        });

        return NextResponse.json({ message: "Vote added", vote: newVote }, { status: 201 });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}

export async function GET(req: Request) {
    // Optional: Get votes for a review
    // Implementation depends on frontend needs, usually votes are aggregated with reviews
    return NextResponse.json({ message: "Not implemented" }, { status: 501 });
}

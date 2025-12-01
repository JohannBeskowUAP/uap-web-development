import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Review from "@/models/Review";
import { decrypt } from "@/lib/session";
import { cookies } from "next/headers";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        await dbConnect();
        const { id } = await params;

        // 1. Verify Session
        const cookieStore = await cookies();
        const session = cookieStore.get("session")?.value;
        const payload = await decrypt(session);

        if (!payload || !payload.userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // 2. Find Review
        const review = await Review.findById(id);
        if (!review) {
            return NextResponse.json({ error: "Review not found" }, { status: 404 });
        }

        // 3. Verify Ownership
        if (review.userId !== payload.userId) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        // 4. Update
        const body = await req.json();
        const updatedReview = await Review.findByIdAndUpdate(
            id,
            {
                rating: body.rating || review.rating,
                comment: body.comment || review.comment
            },
            { new: true }
        );

        return NextResponse.json(updatedReview);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        await dbConnect();
        const { id } = await params;

        // 1. Verify Session
        const cookieStore = await cookies();
        const session = cookieStore.get("session")?.value;
        const payload = await decrypt(session);

        if (!payload || !payload.userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // 2. Find Review
        const review = await Review.findById(id);
        if (!review) {
            return NextResponse.json({ error: "Review not found" }, { status: 404 });
        }

        // 3. Verify Ownership
        if (review.userId !== payload.userId) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        // 4. Delete
        await Review.findByIdAndDelete(id);

        return NextResponse.json({ message: "Review deleted" });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}

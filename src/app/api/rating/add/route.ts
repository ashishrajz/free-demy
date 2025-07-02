import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { connectDB } from "@/lib/db";
import Rating from "@/lib/models/rating.model";
import { getUserByClerkId } from "@/actions/user.actions";

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    const { courseId, value, comment } = await req.json();
    await connectDB();

    const user = await getUserByClerkId(userId);
    if (!user) return new NextResponse("User not found", { status: 404 });

    // Check if already rated and update, else create
    const existingRating = await Rating.findOne({
      courseId,
      userId: user._id,
    });

    if (existingRating) {
      existingRating.value = value;
      existingRating.comment = comment;
      await existingRating.save();
    } else {
      await Rating.create({
        courseId,
        userId: user._id,
        value,
        comment,
      });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Rating submission failed:", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

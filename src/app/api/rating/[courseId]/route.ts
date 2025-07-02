import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Rating from "@/lib/models/rating.model";

// Correct handler with typed context
export async function GET(
  req: Request,
  context: { params: Record<string, string> }
) {
  try {
    await connectDB();

    const { courseId } = context.params;

    const ratings = await Rating.find({ courseId })
      .populate("userId", "name image") // populate name and image of user
      .sort({ createdAt: -1 });

    return NextResponse.json(ratings);
  } catch (err) {
    console.error("Failed to fetch ratings:", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

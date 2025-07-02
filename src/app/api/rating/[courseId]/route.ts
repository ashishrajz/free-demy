// app/api/ratings/[courseId]/route.ts
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Rating from "@/lib/models/rating.model";

export async function GET(
  request: Request,
  context: { params: { courseId: string } }
) {
  try {
    await connectDB();

    const courseId = context.params.courseId;

    const ratings = await Rating.find({ courseId })
      .populate("userId", "name image")
      .sort({ createdAt: -1 });

    return NextResponse.json(ratings);
  } catch (err) {
    console.error("Failed to fetch ratings:", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

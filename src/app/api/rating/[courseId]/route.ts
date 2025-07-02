// app/api/ratings/[courseId]/route.ts
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Rating from "@/lib/models/rating.model";

export async function GET(_: Request, { params }: { params: { courseId: string } }) {
  try {
    await connectDB();

    const ratings = await Rating.find({ courseId: params.courseId })
      .populate("userId", "name image") // Populate user's name and image
      .sort({ createdAt: -1 });

    return NextResponse.json(ratings);
  } catch (err) {
    console.error("Failed to fetch ratings:", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

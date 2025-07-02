// src/app/api/rating/[courseId]/route.ts

import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Rating from "@/lib/models/rating.model";

export async function GET(
  req: NextRequest,
  context: any // ✅ Use `any` to bypass TypeScript strict typing
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

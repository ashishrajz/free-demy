import { connectDB } from "@/lib/db";
import Course from "@/lib/models/course.model";
import Rating from "@/lib/models/rating.model";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

interface LeanCourse {
  _id: mongoose.Types.ObjectId;
  title: string;
  description: string;
  thumbnailUrl: string;
  price: number;
  authorName: string;
  category: string;
}

export async function GET(
  req: NextRequest,
  { params }: { params: { category: string } }
) {
  try {
    await connectDB();

    const rawCategory = decodeURIComponent(params.category);
    const category =
      rawCategory.charAt(0).toUpperCase() + rawCategory.slice(1).toLowerCase();

    // 👇 Tell TypeScript what shape the data will be
    const courses = await Course.find({ category })
      .select("title description thumbnailUrl price authorName category")
      .lean<LeanCourse[]>();

    const courseIds = courses.map(
      (course) => new mongoose.Types.ObjectId(course._id)
    );

    const ratingStats = await Rating.aggregate([
      { $match: { courseId: { $in: courseIds } } },
      {
        $group: {
          _id: "$courseId",
          avgRating: { $avg: "$value" },
          totalRatings: { $sum: 1 },
        },
      },
    ]);

    const ratingMap = new Map(
      ratingStats.map((r) => [
        r._id.toString(),
        { avgRating: r.avgRating, totalRatings: r.totalRatings },
      ])
    );

    const coursesWithRatings = courses.map((course) => {
      const stats = ratingMap.get(course._id.toString()) || {
        avgRating: 0,
        totalRatings: 0,
      };
      return {
        ...course,
        ratingStats: {
          avgRating: stats.avgRating,
          totalRatings: stats.totalRatings,
        },
      };
    });

    return NextResponse.json(coursesWithRatings);
  } catch (err) {
    console.error("API Error in /api/course/category/[category]:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

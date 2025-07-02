import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/db";
import Course from "@/lib/models/course.model";
import Rating from "@/lib/models/rating.model";

interface LeanCourse {
  _id: mongoose.Types.ObjectId;
  title: string;
  description: string;
  thumbnailUrl: string;
  price: number;
  category: string;
  authorName: string;
}

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q");

    if (!query) {
      return NextResponse.json({ error: "Query is required" }, { status: 400 });
    }

    // Search courses with title/description/category match
    const courses = await Course.find({
      $or: [
        { title: { $regex: query, $options: "i" } },
        { description: { $regex: query, $options: "i" } },
        { category: { $regex: query, $options: "i" } },
      ],
    })
      .select("title description thumbnailUrl price category authorName")
      .lean<LeanCourse[]>();

    const courseIds = courses.map((course) => new mongoose.Types.ObjectId(course._id));

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

    const enrichedCourses = courses.map((course) => {
      const stats = ratingMap.get(course._id.toString()) || {
        avgRating: 0,
        totalRatings: 0,
      };

      return {
        _id: course._id.toString(),
        title: course.title,
        description: course.description,
        price: course.price,
        category: course.category,
        thumbnailUrl: course.thumbnailUrl,
        authorName: course.authorName || "Unknown", // ✅ from schema
        ratingStats: {
          avgRating: stats.avgRating,
          totalRatings: stats.totalRatings,
        },
      };
    });

    return NextResponse.json({ courses: enrichedCourses });
  } catch (err) {
    console.error("[SEARCH_API_ERROR]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

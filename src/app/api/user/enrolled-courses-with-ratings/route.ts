import { connectDB } from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";
import { getUserByClerkId } from "@/actions/user.actions";
import Course from "@/lib/models/course.model";
import Rating from "@/lib/models/rating.model";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

interface LeanCourse {
  _id: mongoose.Types.ObjectId;
  title: string;
  description: string;
  thumbnailUrl: string;
  authorName: string;
  category: string;
  sections: {
    lessons: { _id: mongoose.Types.ObjectId }[];
  }[];
}

export async function GET() {
  try {
    await connectDB();

    const authUser = await currentUser();
    if (!authUser) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const dbUser = await getUserByClerkId(authUser.id);
    if (!dbUser || !dbUser.enrolledCourses.length) {
      return NextResponse.json([]);
    }

    // Get enrolled course details
    const courses = await Course.find({ _id: { $in: dbUser.enrolledCourses } })
      .select("title description thumbnailUrl authorName category sections")
      .lean<LeanCourse[]>();

    const courseIds = courses.map(course => course._id);

    // Aggregate ratings
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

    // Create progress map
    const progressMap = new Map<string, string[]>(
      dbUser.courseProgress.map((entry: {
        course: mongoose.Types.ObjectId;
        completedLessons: mongoose.Types.ObjectId[];
      }) => [
        entry.course.toString(),
        entry.completedLessons.map(id => id.toString()),
      ])
    );

    // Combine courses with rating & progress
    const enrichedCourses = courses.map(course => {
      const courseId = course._id.toString();

      const ratings = ratingMap.get(courseId) || {
        avgRating: 0,
        totalRatings: 0,
      };

      const completedLessons: string[] = progressMap.get(courseId) || [];

      const allLessons = course.sections.flatMap(section =>
        section.lessons.map(lesson => lesson._id.toString())
      );

      const totalLessons = allLessons.length;

      const completedCount = allLessons.filter(id =>
        completedLessons.includes(id)
      ).length;

      const progress = totalLessons > 0
        ? Math.round((completedCount / totalLessons) * 100)
        : 0;

      return {
        ...course,
        ratingStats: ratings,
        progress,
      };
    });

    return NextResponse.json(enrichedCourses);
  } catch (err) {
    console.error("Error fetching enrolled courses with ratings & progress:", err);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}

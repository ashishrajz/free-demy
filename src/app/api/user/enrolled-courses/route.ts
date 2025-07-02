import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { connectDB } from "@/lib/db";
import { getUserByClerkId } from "@/actions/user.actions";
import Course from "@/lib/models/course.model";
import mongoose from "mongoose";

interface ICourseProgress {
  course: mongoose.Types.ObjectId;
  completedLessons: mongoose.Types.ObjectId[];
}


export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    await connectDB();
    const user = await getUserByClerkId(userId);
    if (!user) return new NextResponse("User not found", { status: 404 });

    const enrolledCourses = await Course.find({
      _id: { $in: user.enrolledCourses },
    }).lean();

    const progressMap: Record<string, string[]> = {};
    user.courseProgress.forEach((entry: ICourseProgress) => {
      progressMap[entry.course.toString()] = entry.completedLessons.map((id) =>
        id.toString()
      );
    });
    

    const coursesWithProgress = enrolledCourses.map((course: any) => {
      const totalLessons = course.sections?.reduce(
        (count: number, section: any) => count + section.lessons.length,
        0
      ) || 0;

      const completedLessons = progressMap[course._id.toString()]?.length || 0;
      const progress = totalLessons
        ? Math.round((completedLessons / totalLessons) * 100)
        : 0;

      return {
        _id: course._id,
        title: course.title,
        description: course.description,
        thumbnailUrl: course.thumbnailUrl,
        progress,
      };
    });

    return NextResponse.json(coursesWithProgress);
  } catch (err) {
    console.error("Failed to get enrolled courses with progress:", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

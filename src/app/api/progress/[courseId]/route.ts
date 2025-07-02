import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { connectDB } from "@/lib/db";
import { getUserByClerkId } from "@/actions/user.actions";
import Course from "@/lib/models/course.model";
import mongoose from "mongoose";

interface CourseWithSections {
  _id: string;
  sections: {
    title: string;
    lessons: {
      _id: string;
      title: string;
      videoUrl: string;
    }[];
  }[];
}

// ✅ Proper way to define the function to receive params
export async function GET(
  req: NextRequest,
  { params }: { params: { courseId: string } }
) {
  try {
    const { userId } = await auth();
    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    // ✅ Safely get courseId from params
    const courseId = params.courseId;

    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return new NextResponse("Invalid course ID", { status: 400 });
    }

    await connectDB();
    const user = await getUserByClerkId(userId);
    if (!user) return new NextResponse("User not found", { status: 404 });

    const course = await Course.findById(courseId).lean<CourseWithSections>();
    if (!course) return new NextResponse("Course not found", { status: 404 });

    const totalLessons = course.sections.reduce(
      (acc, section) => acc + section.lessons.length,
      0
    );

    const progressEntry = user.courseProgress.find(
      (entry: any) => entry.course?.toString() === courseId
    );

    const completedLessons = progressEntry?.completedLessons || [];
    const percentage =
      totalLessons === 0
        ? 0
        : Math.round((completedLessons.length / totalLessons) * 100);

    return NextResponse.json({
      completedLessons,
      totalLessons,
      percentage,
    });
  } catch (err) {
    console.error("Progress fetch error:", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

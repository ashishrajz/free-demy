// File: /app/api/progress/mark-complete/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { connectDB } from "@/lib/db";
import { getUserByClerkId } from "@/actions/user.actions";
import mongoose from "mongoose";

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    const { courseId, lessonId } = await req.json();
    if (!courseId || !lessonId)
      return new NextResponse("Missing courseId or lessonId", { status: 400 });

    await connectDB();
    const user = await getUserByClerkId(userId);
    if (!user) return new NextResponse("User not found", { status: 404 });

    const courseObjectId = new mongoose.Types.ObjectId(courseId);
    const lessonObjectId = new mongoose.Types.ObjectId(lessonId);

    // Filter out invalid entries (missing course field)
    user.courseProgress = user.courseProgress.filter(
    (p: any) => p.course && mongoose.Types.ObjectId.isValid(p.course)
    );


    let progressEntry = user.courseProgress.find((p: any) =>
      p.course?.toString() === courseId
    );

    if (!progressEntry) {
      // If progress doesn't exist, add new entry
      user.courseProgress.push({
        course: courseObjectId,
        completedLessons: [lessonObjectId],
      });
    } else {
      // If progress exists, add lesson if not already marked
      const alreadyCompleted = progressEntry.completedLessons.some(
        (id: any) => id.toString() === lessonId
      );
      if (!alreadyCompleted) {
        progressEntry.completedLessons.push(lessonObjectId);
      }
    }
    console.log("User to save:", JSON.stringify(user, null, 2));


    await user.save();
    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Error marking lesson complete:", err.message, err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

// File: app/api/course/[id]/route.ts

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { connectDB } from "@/lib/db";
import Course from "@/lib/models/course.model";
import { getUserByClerkId } from "@/actions/user.actions";

export async function PUT(req: NextRequest, context: any) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    await connectDB();

    const user = await getUserByClerkId(userId);
    if (!user || !["admin", "instructor"].includes(user.role)) {
      return new NextResponse("Forbidden", { status: 403 });
    }

    const body = await req.json();
    const {
      title,
      description,
      price,
      category,
      thumbnailUrl,
      sections,
      status,
    } = body;

    const courseId = context.params.id; // ✅ Safely access ID

    const course = await Course.findOne({
      _id: courseId,
      instructorId: userId,
    });

    if (!course) {
      return new NextResponse("Course not found", { status: 404 });
    }

    course.title = title;
    course.description = description;
    course.price = price;
    course.category = category;
    course.thumbnailUrl = thumbnailUrl;
    course.sections = sections;
    course.status = status;

    await course.save();

    return NextResponse.json(course);
  } catch (error) {
    console.error("Error updating course:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

// src/app/api/course/delete/[id]/route.ts

import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { connectDB } from "@/lib/db";
import Course from "@/lib/models/course.model";

export async function DELETE(
  request: NextRequest,
  context: any
) {
  try {
    await connectDB();
    const user = await currentUser();

    if (!user || !user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const course = await Course.findById(context.params.id);

    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    if (course.instructorId !== user.id && user.publicMetadata.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await Course.findByIdAndDelete(context.params.id);

    return NextResponse.json({ message: "Course deleted successfully" }, { status: 200 });
  } catch (err) {
    console.error("Delete error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

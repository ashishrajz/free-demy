import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Course from "@/lib/models/course.model";

export async function GET() {
  try {
    await connectDB();

    const courses = await Course.find({}, "_id title category"); // only fetch what’s needed
    return NextResponse.json(courses);
  } catch (error) {
    console.error("Failed to fetch courses:", error);
    return NextResponse.json({ error: "Failed to fetch courses" }, { status: 500 });
  }
}

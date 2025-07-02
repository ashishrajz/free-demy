import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import Course from "@/lib/models/course.model";
import { connectDB } from "@/lib/db";

export async function GET() {
  await connectDB();
  const user = await currentUser();

  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const courses = await Course.find({ instructorId: user.id });

  return NextResponse.json(courses);
}

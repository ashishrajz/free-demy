import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import Course from "@/lib/models/course.model";
import Enrollment from "@/lib/models/enrollment.model";
import { connectDB } from "@/lib/db";

export async function GET() {
  await connectDB();
  const user = await currentUser();

  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const courses = await Course.find({ instructorId: user.id });
  const courseIds = courses.map((c) => c._id);

  const enrollments = await Enrollment.find({ course: { $in: courseIds } });
  const totalRevenue = courses.reduce((sum, c) => sum + (c.price || 0), 0);

  return NextResponse.json({
    totalCourses: courses.length,
    totalEnrollments: enrollments.length,
    totalRevenue,
  });
}

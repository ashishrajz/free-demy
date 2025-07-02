import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { connectDB } from "@/lib/db";
import User from "@/lib/models/user.model";
import Course from "@/lib/models/course.model";

export async function POST(req: NextRequest) {
  const { sessionId, courseId } = await req.json();

  await connectDB();

  const session = await stripe.checkout.sessions.retrieve(sessionId);

  const userId = session.metadata?.userId;

  if (!userId) return new NextResponse("Invalid session", { status: 400 });

  const user = await User.findById(userId);
  const course = await Course.findById(courseId);

  if (!user || !course) {
    return new NextResponse("User or Course not found", { status: 404 });
  }

  // Prevent duplicates
  if (!user.enrolledCourses.includes(courseId)) {
    user.enrolledCourses.push(courseId);
    await user.save();
  }

  return NextResponse.json({ success: true });
}

// src/app/api/enroll/add/route.ts

import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { connectDB } from "@/lib/db";
import Course from "@/lib/models/course.model";
import User from "@/lib/models/user.model";

export async function POST(req: NextRequest) {
  try {
    const { sessionId } = await req.json();
    if (!sessionId) return new NextResponse("Missing session ID", { status: 400 });

    await connectDB();
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    const courseId = session.metadata?.courseId;
    const userId = session.metadata?.userId;

    if (!courseId || !userId) {
      return new NextResponse("Missing metadata", { status: 400 });
    }

    const course = await Course.findById(courseId); // No .lean() — returns Mongoose doc with ObjectId
    const user = await User.findById(userId);

    if (!course || !user) {
      return new NextResponse("User or course not found", { status: 404 });
    }

    // Safely check ObjectId existence in array
    const alreadyEnrolled = user.enrolledCourses.some((id) =>
      id.equals(course._id)
    );

    if (!alreadyEnrolled) {
      user.enrolledCourses.push(course._id);
      await user.save();
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Enrollment error:", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}

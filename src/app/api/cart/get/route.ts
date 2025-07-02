import { auth } from "@clerk/nextjs/server";
import { connectDB } from "@/lib/db";
import { NextResponse } from "next/server";
import { getUserByClerkId } from "@/actions/user.actions";
import Course from "@/lib/models/course.model";

export async function GET() {
  await connectDB();
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await getUserByClerkId(userId);

  const courses = await Course.find({
    _id: { $in: user.cart },
  }).lean();

  return NextResponse.json({ cartCourses: courses });
}


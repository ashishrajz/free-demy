// /app/api/user/courses/route.ts
import { auth } from "@clerk/nextjs/server";
import { connectDB } from "@/lib/db";
import User from "@/lib/models/user.model";
import { NextResponse } from "next/server";

export async function GET() {
  const { userId } = await auth();
  if (!userId) return new NextResponse("Unauthorized", { status: 401 });

  await connectDB();
  const user = await User.findOne({ clerkId: userId })
    .populate("enrolledCourses")
    .populate("cart");

  return NextResponse.json({
    enrolledCourses: user.enrolledCourses,
    cartCourses: user.cart,
  });
}

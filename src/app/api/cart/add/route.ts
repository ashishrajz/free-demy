// src/app/api/cart/add/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { connectDB } from "@/lib/db";
import mongoose from "mongoose";

import { addToCart } from "@/actions/cart.actions";
import { getDbUserId } from "@/actions/user.actions";
import User from "@/lib/models/user.model";

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return new NextResponse("Unauthorized", { status: 401 });

  const { courseId } = (await req.json()) as { courseId: string };

  if (!mongoose.Types.ObjectId.isValid(courseId)) {
    return new NextResponse("Invalid course ID", { status: 400 });
  }

  await connectDB();
  const dbUserId = await getDbUserId(userId);

  const user = await User.findById(dbUserId);
  if (!user) return new NextResponse("User not found", { status: 404 });

  const courseObjectId = new mongoose.Types.ObjectId(courseId);

  if (user.enrolledCourses.includes(courseObjectId)) {
    return new NextResponse("You already own this course", { status: 400 });
  }

  if (user.cart.includes(courseObjectId)) {
    return new NextResponse("Course already in cart", { status: 200 });
  }

  const updatedCart = await addToCart(dbUserId, courseId);

  return NextResponse.json(updatedCart);
}

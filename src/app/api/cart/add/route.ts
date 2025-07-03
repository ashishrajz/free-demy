// src/app/api/cart/add/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

import { addToCart } from "@/actions/cart.actions";
import { getDbUserId } from "@/actions/user.actions";
import User from "@/lib/models/user.model";
import { connectDB } from "@/lib/db";
import mongoose from "mongoose";

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return new NextResponse("Unauthorized", { status: 401 });

  const body = await req.json();
  const courseId = String(body.courseId); // ✅ Force it to string

  await connectDB();
  const dbUserId = await getDbUserId(userId);
  const user = await User.findById(dbUserId);

  if (!user) return new NextResponse("User not found", { status: 404 });

  // Check if already enrolled
  if (
    user.enrolledCourses.some((id) =>
      id.equals(new mongoose.Types.ObjectId(courseId))
    )
  ) {
    return new NextResponse("You already own this course", { status: 400 });
  }

  // Check if already in cart
  if (
    user.cart.some((id) =>
      id.equals(new mongoose.Types.ObjectId(courseId))
    )
  ) {
    return new NextResponse("Course already in cart", { status: 200 });
  }

  const updatedCart = await addToCart(dbUserId, courseId);

  return NextResponse.json(updatedCart);
}

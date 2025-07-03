// src/app/api/cart/add/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

import { addToCart } from "@/actions/cart.actions";
import { getDbUserId } from "@/actions/user.actions";
import User from "@/lib/models/user.model";
import { connectDB } from "@/lib/db";

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return new NextResponse("Unauthorized", { status: 401 });

  const { courseId } = await req.json();

  await connectDB();
  const dbUserId = await getDbUserId(userId); // ✅ already a string

  const user = await User.findById(dbUserId);
  if (!user) return new NextResponse("User not found", { status: 404 });

  // ✅ Prevent adding if already enrolled
  if (user.enrolledCourses.includes(courseId)) {
    return new NextResponse("You already own this course", { status: 400 });
  }

  // ✅ Prevent duplicate cart entry
  if (user.cart.includes(courseId)) {
    return new NextResponse("Course already in cart", { status: 200 });
  }

  const updatedCart = await addToCart(dbUserId, courseId); // ✅ dbUserId is string now

  return NextResponse.json(updatedCart);
}

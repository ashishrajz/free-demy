// src/app/api/enroll/add/route.ts
import { NextResponse } from "next/server";
import Stripe from "stripe";
import mongoose from "mongoose";

import { connectDB } from "@/lib/db";
import User from "@/lib/models/user.model";
import Course from "@/lib/models/course.model";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
});

export async function POST(req: Request) {
  try {
    await connectDB();

    const { sessionId } = await req.json();
    if (!sessionId) {
      return NextResponse.json({ success: false, error: "Missing sessionId" }, { status: 400 });
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId);
    const userId = session.metadata?.userId;
    const courseIds = JSON.parse(session.metadata?.courseIds || "[]");

    if (!userId || courseIds.length === 0) {
      return NextResponse.json({ success: false, error: "Invalid metadata" }, { status: 400 });
    }

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
    }

    // Convert courseIds to ObjectIds to prevent type issues
    const objectIdCourses = courseIds.map((id: string) => new mongoose.Types.ObjectId(id));

    await User.updateOne(
      { _id: userId },
      {
        $addToSet: { enrolledCourses: { $each: objectIdCourses } },
        $pull: { cart: { $in: objectIdCourses } },
      }
    );

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Enroll error:", err);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import Stripe from "stripe";
import mongoose from "mongoose";

import { connectDB } from "@/lib/db";
import User from "@/lib/models/user.model";

// Initialize Stripe instance
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-04-10",
});

export async function POST(req: Request) {
  try {
    await connectDB();

    const { sessionId } = await req.json();
    if (!sessionId) {
      return NextResponse.json(
        { success: false, error: "Missing sessionId" },
        { status: 400 }
      );
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId);
    const userId = session.metadata?.userId;
    const courseIdsRaw = session.metadata?.courseIds;

    if (!userId || !courseIdsRaw) {
      return NextResponse.json(
        { success: false, error: "Invalid session metadata" },
        { status: 400 }
      );
    }

    const courseIds: mongoose.Types.ObjectId[] = JSON.parse(courseIdsRaw).map(
      (id: string) => new mongoose.Types.ObjectId(id)
    );

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    // Update user: add courses to enrolledCourses, remove from cart
    await User.updateOne(
      { _id: userId },
      {
        $addToSet: { enrolledCourses: { $each: courseIds } },
        $pull: { cart: { $in: courseIds } },
      }
    );

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Enroll error:", err);
    return NextResponse.json(
      { success: false, error: "Server error" },
      { status: 500 }
    );
  }
}

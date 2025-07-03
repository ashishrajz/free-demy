import { NextResponse } from "next/server";
import Stripe from "stripe";
import { connectDB } from "@/lib/db";
import User from "@/lib/models/user.model";
import Course from "@/lib/models/course.model";
import mongoose from "mongoose";

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

    // Convert courseIds to ObjectIds
    const objectIds = courseIds.map((id: string) => new mongoose.Types.ObjectId(id));

    // Filter out courses the user is already enrolled in
    const newCourses = objectIds.filter((id) => 
      !user.enrolledCourses.some((enrolledId) => enrolledId.equals(id))
    );

    if (newCourses.length > 0) {
      user.enrolledCourses.push(...newCourses);

      // Remove from cart if present
      user.cart = user.cart.filter(
        (cartId) => !newCourses.some((id) => id.equals(cartId))
      );

      await user.save();
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Enroll error:", err);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}

// app/api/enroll/route.ts
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { connectDB } from "@/lib/db";
import User from "@/lib/models/user.model";

// ✅ No apiVersion needed here!
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

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
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}

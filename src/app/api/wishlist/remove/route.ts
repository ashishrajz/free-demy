import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { connectDB } from "@/lib/db";
import User from "@/lib/models/user.model";
import mongoose from "mongoose";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { courseId } = await req.json();
    if (!courseId || !mongoose.Types.ObjectId.isValid(courseId)) {
      return NextResponse.json({ message: "Invalid course ID" }, { status: 400 });
    }

    await connectDB();

    const user = await User.findOne({ clerkId: userId });
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Remove courseId from wishlist array
    user.wishlist = user.wishlist.filter(
      (id: mongoose.Types.ObjectId) => id.toString() !== courseId
    );
    await user.save();

    return NextResponse.json({ message: "Removed from wishlist", wishlist: user.wishlist });
  } catch (error) {
    console.error("Wishlist remove error:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

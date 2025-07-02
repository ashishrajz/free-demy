import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/lib/models/user.model";

export async function GET() {
  await connectDB();
  const user = await currentUser();

  if (!user) {
    return NextResponse.json({ role: null });
  }

  const userDoc = await User.findOne({ clerkId: user.id });
  return NextResponse.json({ role: userDoc?.role || null });
}

import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { connectDB } from "@/lib/db";
import User from "@/lib/models/user.model";

// Use `any` for the second argument to avoid type error from Next.js
export async function DELETE(
  req: NextRequest,
  context: any // 👈 FIX: bypass broken type inference here
) {
  await connectDB();

  const user = await currentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const courseId = context.params.id; // Extract ID safely

  await User.updateOne(
    { clerkId: user.id },
    { $pull: { cart: courseId } }
  );

  return NextResponse.json({ success: true });
}

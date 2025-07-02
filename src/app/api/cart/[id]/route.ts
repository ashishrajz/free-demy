// src/app/api/cart/[id]/route.ts

import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { connectDB } from "@/lib/db";
import User from "@/lib/models/user.model";

// ✅ The correct handler signature for App Router API routes
export async function DELETE(
  req: NextRequest,
  context: { params: { id: string } }
) {
  await connectDB();

  const user = await currentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const courseId = context.params.id;

  await User.updateOne(
    { clerkId: user.id },
    { $pull: { cart: courseId } }
  );

  return NextResponse.json({ success: true });
}

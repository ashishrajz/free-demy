// /app/api/cart/[id]/route.ts
import { currentUser } from "@clerk/nextjs/server";
import { connectDB } from "@/lib/db";
import User from "@/lib/models/user.model";
import { NextResponse } from "next/server";

// ✅ Fix: explicitly define the context argument using `NextRequest` and typed context
export async function DELETE(
  req: Request,
  context: { params: { id: string } }  // ✅ context must be defined like this
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


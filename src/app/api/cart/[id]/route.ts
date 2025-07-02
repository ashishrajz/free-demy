// /app/api/cart/[id]/route.ts
import { currentUser } from "@clerk/nextjs/server";
import { connectDB } from "@/lib/db";
import User from "@/lib/models/user.model";
import { NextResponse } from "next/server";

export async function DELETE(_: any, { params }: { params: { id: string } }) {
  await connectDB();
  const user = await currentUser();
  if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
  await User.updateOne(
    { clerkId: user.id },
    { $pull: { cart: params.id } }
  );
  return NextResponse.json({ success: true });
}

// app/api/cart/count/route.ts
import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/lib/models/user.model";

export async function GET() {
  try {
    await connectDB();
    const user = await currentUser();
    if (!user) return NextResponse.json({ count: 0 });

    const dbUser = await User.findOne({ clerkId: user.id });
    const cartCount = dbUser?.cart?.length || 0;

    return NextResponse.json({ count: cartCount });
  } catch (err) {
    return NextResponse.json({ count: 0 }, { status: 500 });
  }
}

// /app/api/cart/route.ts
import { currentUser } from "@clerk/nextjs/server";
import { connectDB } from "@/lib/db";
import User from "@/lib/models/user.model";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDB();

    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const dbUser = await User.findOne({ clerkId: user.id }).populate("cart");

    const cartCourses = dbUser?.cart || [];

    // Properly type the reduce
    const totalAmount = cartCourses.reduce((sum: number, course: any) => {
      return sum + (course.price || 0);
    }, 0);

    return NextResponse.json({ cartCourses, totalAmount });
  } catch (error) {
    console.error("Error fetching cart:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getUserByClerkId } from "@/actions/user.actions";
import Course from "@/lib/models/course.model";
import { connectDB } from "@/lib/db";

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return new NextResponse("Unauthorized", { status: 401 });

  await connectDB();

  const user = await getUserByClerkId(userId);
  if (!user || !["admin", "instructor"].includes(user.role)) {
    return new NextResponse("Forbidden", { status: 403 });
  }

  const body = await req.json();
  const { title, description, price, category, thumbnailUrl, sections,authorName } = body;

  const course = await Course.create({
    title,
    description,
    price,
    category,
    thumbnailUrl,
    authorName,
    instructorId: user.clerkId, // assigning Clerk ID
    sections,
  });

  return NextResponse.json(course);
}

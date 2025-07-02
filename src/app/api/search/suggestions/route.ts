import { NextRequest, NextResponse } from "next/server";
import {connectDB} from "@/lib/db";
import Course from "@/lib/models/course.model";

export async function GET(req: NextRequest) {
  await connectDB();
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("q");

  if (!query) return NextResponse.json([]);

  const courses = await Course.find({
    title: { $regex: query, $options: "i" },
  }).limit(5).select("title _id");

  return NextResponse.json(courses);
}

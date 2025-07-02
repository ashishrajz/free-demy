// actions/course.actions.ts
import { connectDB } from "@/lib/db";
import Course from "@/lib/models/course.model";

export async function getCourseById(id: string) {
  try {
    await connectDB();
    const course = await Course.findById(id).lean();
    return JSON.parse(JSON.stringify(course));
  } catch (err) {
    console.error("Error fetching course:", err);
    throw new Error("Could not fetch course.");
  }
}

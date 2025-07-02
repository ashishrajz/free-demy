// File: app/my-learning/[courseId]/page.tsx
import { Metadata } from "next";
import WatchClient from "@/components/WatchClient";
import Course from "@/lib/models/course.model";
import { connectDB } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { getUserByClerkId } from "@/actions/user.actions";
import { notFound } from "next/navigation";
import { CourseType } from "@/types";

export async function generateMetadata({ params }: { params: { courseId: string } }): Promise<Metadata> {
  await connectDB();
  const course = await Course.findById(params.courseId).lean() as CourseType | null;
  if (!course || !course.title) return { title: "Course Not Found" };
  return { title: `${course.title} | My Learning` };
}

export default async function WatchPage({ params }: { params: { courseId: string } }) {
  await connectDB();
  const { userId } = await auth();
  if (!userId) return notFound();

  const user = await getUserByClerkId(userId);
  const course = await Course.findById(params.courseId).lean();

  if (!user?.enrolledCourses.includes(params.courseId) || !course) return notFound();

  const plainCourse = JSON.parse(JSON.stringify(course));
  const plainUser = JSON.parse(JSON.stringify(user));

  return <WatchClient user={plainUser} course={plainCourse} />;
}

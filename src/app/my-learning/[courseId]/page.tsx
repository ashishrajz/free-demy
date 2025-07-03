// File: app/my-learning/[courseId]/page.tsx

import { Metadata } from "next";
import WatchClient from "@/components/WatchClient";
import Course from "@/lib/models/course.model";
import { connectDB } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { getUserByClerkId } from "@/actions/user.actions";
import { notFound } from "next/navigation";
import { CourseType } from "@/types";
import mongoose from "mongoose";

// Use `any` to avoid inference errors on server functions
export async function generateMetadata({ params }: any): Promise<Metadata> {
  await connectDB();

  const courseDoc = await Course.findById(params.courseId).lean();
  if (!courseDoc || !courseDoc.title) return { title: "Course Not Found" };

  const course = JSON.parse(JSON.stringify(courseDoc)) as CourseType;
  return { title: `${course.title} | My Learning` };
}

export default async function WatchPage({ params }: any) {
  await connectDB();

  const { userId } = await auth();
  if (!userId) return notFound();

  const user = await getUserByClerkId(userId);
  const courseDoc = await Course.findById(params.courseId).lean();

  if (!courseDoc || !user) return notFound();

  // 🧠 Ensure the courseId exists in user's enrolledCourses
  const isEnrolled = user.enrolledCourses.some((id: mongoose.Types.ObjectId) =>
    id.equals(new mongoose.Types.ObjectId(params.courseId))
  );

  if (!isEnrolled) return notFound();

  const plainCourse = JSON.parse(JSON.stringify(courseDoc)) as CourseType;
  const plainUser = JSON.parse(JSON.stringify(user));

  return <WatchClient user={plainUser} course={plainCourse} />;
}

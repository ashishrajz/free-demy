// src/actions/enrollment.ts
import { connectDB } from "@/lib/db";
import User from "@/lib/models/user.model";

export const enrollInCourse = async (userId: string, courseId: string) => {
  await connectDB();
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");

  if (!user.enrolledCourses.includes(courseId)) {
    user.enrolledCourses.push(courseId);
    await user.save();
  }
  return user.enrolledCourses;
};

export const getEnrolledCourses = async (userId: string) => {
  await connectDB();
  const user = await User.findById(userId).populate("enrolledCourses");
  return user?.enrolledCourses || [];
};
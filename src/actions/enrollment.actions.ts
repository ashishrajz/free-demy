// src/actions/enrollment.ts
import mongoose from "mongoose";
import { connectDB } from "@/lib/db";
import User from "@/lib/models/user.model";

export const enrollInCourse = async (userId: string, courseId: string) => {
  await connectDB();
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");

  const courseObjectId = new mongoose.Types.ObjectId(courseId);

  const alreadyEnrolled = user.enrolledCourses.some((id) => id.equals(courseObjectId));

  if (!alreadyEnrolled) {
    user.enrolledCourses.push(courseObjectId);
    await user.save();
  }

  return user.enrolledCourses;
};

export const getEnrolledCourses = async (userId: string) => {
  await connectDB();
  const user = await User.findById(userId).populate("enrolledCourses");
  return user?.enrolledCourses || [];
};

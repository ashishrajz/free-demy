// src/actions/rating.ts
import mongoose from "mongoose";
import Rating from "@/lib/models/rating.model";
import { connectDB } from "@/lib/db";

export const addRating = async (userId: string, courseId: string, value: number) => {
  await connectDB();

  const userObjectId = new mongoose.Types.ObjectId(userId);
  const courseObjectId = new mongoose.Types.ObjectId(courseId);

  const existing = await Rating.findOne({
    userId: userObjectId,
    courseId: courseObjectId,
  });

  if (existing) {
    existing.value = value;
    await existing.save();
    return existing;
  } else {
    return await Rating.create({
      userId: userObjectId,
      courseId: courseObjectId,
      value,
    });
  }
};

export const getCourseRating = async (courseId: string) => {
  await connectDB();
  const courseObjectId = new mongoose.Types.ObjectId(courseId);

  const ratings = await Rating.find({ courseId: courseObjectId });

  const average =
    ratings.reduce((acc, r) => acc + r.value, 0) / (ratings.length || 1);

  return {
    average: Number(average.toFixed(1)),
    total: ratings.length,
  };
};

// src/actions/rating.ts
import Rating from "@/lib/models/rating.model";
import { connectDB } from "@/lib/db";

export const addRating = async (userId: string, courseId: string, rating: number) => {
  await connectDB();
  const existing = await Rating.findOne({ userId, courseId });
  if (existing) {
    existing.rating = rating;
    await existing.save();
    return existing;
  } else {
    return await Rating.create({ userId, courseId, rating });
  }
};

export const getCourseRating = async (courseId: string) => {
  await connectDB();
  const ratings = await Rating.find({ courseId });
  const average =
    ratings.reduce((acc, r) => acc + r.rating, 0) / (ratings.length || 1);
  return { average, total: ratings.length };
};

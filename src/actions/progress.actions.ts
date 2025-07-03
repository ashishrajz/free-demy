// src/actions/progress.ts
import Progress from "@/lib/models/userProgress.model";
import { connectDB } from "@/lib/db";

export const getProgress = async (userId: string, courseId: string) => {
  await connectDB();
  const progress = await Progress.findOne({ userId, courseId });
  return progress || null;
};

export const updateProgress = async (userId: string, courseId: string, lessonId: string) => {
  await connectDB();
  let progress = await Progress.findOne({ userId, courseId });

  if (!progress) {
    progress = new Progress({ userId, courseId, completedLessons: [lessonId] });
  } else if (!progress.completedLessons.includes(lessonId)) {
    progress.completedLessons.push(lessonId);
  }

  await progress.save();
  return progress;
};

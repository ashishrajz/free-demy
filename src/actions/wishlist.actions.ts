// src/actions/wishlist.ts
import mongoose from "mongoose";
import { connectDB } from "@/lib/db";
import User from "@/lib/models/user.model";

export const addToWishlist = async (userId: string, courseId: string) => {
  await connectDB();
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");

  const courseObjectId = new mongoose.Types.ObjectId(courseId);

  // Use .some() with .equals() to compare ObjectIds
  const alreadyExists = user.wishlist.some((id) => id.equals(courseObjectId));
  if (!alreadyExists) {
    user.wishlist.push(courseObjectId);
    await user.save();
  }

  return user.wishlist;
};

export const getWishlist = async (userId: string) => {
  await connectDB();
  const user = await User.findById(userId).populate("wishlist");
  return user?.wishlist || [];
};

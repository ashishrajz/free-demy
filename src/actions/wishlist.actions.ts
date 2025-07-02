// src/actions/wishlist.ts
import { connectDB } from "@/lib/db";
import User from "@/lib/models/user.model";

export const addToWishlist = async (userId: string, courseId: string) => {
  await connectDB();
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");

  if (!user.wishlist.includes(courseId)) {
    user.wishlist.push(courseId);
    await user.save();
  }
  return user.wishlist;
};

export const getWishlist = async (userId: string) => {
  await connectDB();
  const user = await User.findById(userId).populate("wishlist");
  return user?.wishlist || [];
};
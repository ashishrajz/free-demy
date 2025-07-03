// src/actions/cart.ts
import mongoose from "mongoose";
import Course from "@/lib/models/course.model";
import User from "@/lib/models/user.model";
import { connectDB } from "@/lib/db";

export const addToCart = async (userId: string, courseId: string) => {
  await connectDB();

  // Check if courseId is a valid ObjectId
  if (!mongoose.Types.ObjectId.isValid(courseId)) {
    throw new Error("Invalid courseId");
  }

  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");

  const courseObjectId = new mongoose.Types.ObjectId(courseId);

  // Avoid duplicates in cart
  const isInCart = user.cart.some((id) => id.equals(courseObjectId));
  if (!isInCart) {
    user.cart.push(courseObjectId);
    await user.save();
  }

  return user.cart;
};

export const getCartItems = async (userId: string) => {
  await connectDB();
  const user = await User.findById(userId).populate("cart");
  return user?.cart || [];
};

export const enrollFromCart = async (userId: string) => {
  await connectDB();

  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");

  user.enrolledCourses.push(...user.cart);
  user.cart = [];
  await user.save();

  return user.enrolledCourses;
};

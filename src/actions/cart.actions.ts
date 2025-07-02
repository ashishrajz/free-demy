// src/actions/cart.ts
import Course from "@/lib/models/course.model";
import User from "@/lib/models/user.model";
import { connectDB } from "@/lib/db";

export const addToCart = async (userId: string, courseId: string) => {
  await connectDB();
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");

  if (!user.cart.includes(courseId)) {
    user.cart.push(courseId);
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
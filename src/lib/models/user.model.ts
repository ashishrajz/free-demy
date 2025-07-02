// File: /lib/models/user.model.ts

import mongoose, { Schema, Document, model, models } from "mongoose";

// Interface for a course progress entry
interface ICourseProgress {
  course: mongoose.Types.ObjectId;
  completedLessons: mongoose.Types.ObjectId[];
}

// Full user document interface
export interface IUser extends Document {
  clerkId: string;
  email: string;
  name?: string;
  image?: string;
  role: "student" | "instructor" | "admin";
  cart: mongoose.Types.ObjectId[];
  wishlist: mongoose.Types.ObjectId[];
  enrolledCourses: mongoose.Types.ObjectId[];
  courseProgress: ICourseProgress[];
}

// Sub-schema for courseProgress
const CourseProgressSchema = new Schema<ICourseProgress>(
  {
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    completedLessons: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Lesson",
      },
    ],
  },
  { _id: false } // prevents generating _id for each progress entry
);

// Main user schema
const UserSchema = new Schema<IUser>(
  {
    clerkId: { type: String, required: true, unique: true },
    email: { type: String, required: true },
    name: { type: String },
    image: { type: String },
    role: {
      type: String,
      enum: ["student", "instructor", "admin"],
      default: "student",
    },
    cart: [{ type: mongoose.Schema.Types.ObjectId, ref: "Course" }],
    wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: "Course" }],
    enrolledCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Course" }],
    courseProgress: [CourseProgressSchema],
  },
  { timestamps: true }
);

// Export model, ensuring single registration
export default models.User || model<IUser>("User", UserSchema);

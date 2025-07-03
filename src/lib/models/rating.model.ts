// models/rating.model.ts
import mongoose, { Schema, Document, models, model } from "mongoose";

// TypeScript interface for Rating document
export interface IRating extends Document {
  userId: mongoose.Types.ObjectId;
  courseId: mongoose.Types.ObjectId;
  value: number;
  comment?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ratingSchema = new Schema<IRating>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    value: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Use `models.Rating` if it exists to avoid model redefinition errors
export default models.Rating || model<IRating>("Rating", ratingSchema);

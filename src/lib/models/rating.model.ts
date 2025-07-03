// src/lib/models/rating.model.ts
import mongoose, { Schema, Document, model, models, Model } from "mongoose";

export interface RatingDocument extends Document {
  userId: mongoose.Types.ObjectId;
  courseId: mongoose.Types.ObjectId;
  value: number;
  comment?: string;
}

const ratingSchema = new Schema<RatingDocument>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    courseId: { type: Schema.Types.ObjectId, ref: "Course", required: true },
    value: { type: Number, required: true },
    comment: { type: String },
  },
  { timestamps: true }
);

// ✅ Ensure proper typing of the model
const Rating: Model<RatingDocument> =
  models.Rating || model<RatingDocument>("Rating", ratingSchema);

export default Rating;

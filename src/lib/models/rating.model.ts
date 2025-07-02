// models/rating.model.ts
import mongoose from "mongoose";

const ratingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
  value: { type: Number, required: true }, // <-- make sure it's `value`, not `rating`
  comment: { type: String },
}, { timestamps: true });

export default mongoose.models.Rating || mongoose.model("Rating", ratingSchema);


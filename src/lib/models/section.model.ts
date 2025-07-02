import mongoose, { Schema, Document, models, model } from "mongoose";

export interface ISection extends Document {
  courseId: mongoose.Types.ObjectId;
  title: string;
}

const SectionSchema = new Schema<ISection>(
  {
    courseId: { type: Schema.Types.ObjectId, ref: "Course", required: true },
    title: { type: String, required: true },
  },
  { timestamps: true }
);

export default models.Section || model<ISection>("Section", SectionSchema);

import mongoose, { Schema, model, models } from "mongoose";

const lessonSchema = new Schema({
  title: { type: String, required: true },
  videoUrl: { type: String, required: true },
});

const sectionSchema = new Schema({
  title: { type: String, required: true },
  lessons: [lessonSchema],
});

const courseSchema = new Schema(
  {
    title: { type: String, required: true },
    description: String,
    price: { type: Number, required: true },
    category: {
      type: String,
      enum: [
        "Development",
        "Business",
        "Trading",
        "DSA",
        "Editing",
        "Design",
        "Marketing",
        "Health & Fitness",
        "Content Creation",
        "AI",
      ],
      required: true,
    },
    thumbnailUrl: {
      type: String,
      required: true,
    },
    instructorId: {
      type: String, // Clerk user ID
      required: true,
    },
    authorName: {
      type: String,
      required: true,
    },
    sections: [sectionSchema],
  },
  { timestamps: true }
);

export default models.Course || model("Course", courseSchema);

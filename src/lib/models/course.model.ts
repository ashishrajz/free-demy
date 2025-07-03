// src/lib/models/course.model.ts

import mongoose, {
  Schema,
  model,
  models,
  Document,
  Model,
  Types,
} from "mongoose";

// -----------------------------
// Interfaces
// -----------------------------

interface ILesson {
  title: string;
  videoUrl: string;
}

interface ISection {
  title: string;
  lessons: ILesson[];
}

export interface ICourse extends Document {
  title: string;
  description?: string;
  price: number;
  category:
    | "Development"
    | "Business"
    | "Trading"
    | "DSA"
    | "Editing"
    | "Design"
    | "Marketing"
    | "Health & Fitness"
    | "Content Creation"
    | "AI";
  thumbnailUrl: string;
  instructorId: string; // Clerk ID
  authorName: string;
  sections: ISection[];
  createdAt: Date;
  updatedAt: Date;
}

// -----------------------------
// Schemas
// -----------------------------

const lessonSchema = new Schema<ILesson>(
  {
    title: { type: String, required: true },
    videoUrl: { type: String, required: true },
  },
  { _id: false }
);

const sectionSchema = new Schema<ISection>(
  {
    title: { type: String, required: true },
    lessons: [lessonSchema],
  },
  { _id: false }
);

const courseSchema = new Schema<ICourse>(
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
    thumbnailUrl: { type: String, required: true },
    instructorId: { type: String, required: true },
    authorName: { type: String, required: true },
    sections: [sectionSchema],
    status: {
      type: String,
      enum: ["draft", "published"],
      default: "draft",
    },
  },
  { timestamps: true }
);

// -----------------------------
// Model Export
// -----------------------------

const Course: Model<ICourse> = models.Course || model<ICourse>("Course", courseSchema);
export default Course;

import mongoose, { Schema, Document, models } from "mongoose";

export interface EnrollmentDocument extends Document {
  userId: string;
  courseId: mongoose.Types.ObjectId;
  enrolledAt: Date;
}

const EnrollmentSchema = new Schema<EnrollmentDocument>(
  {
    userId: {
      type: String,
      required: true,
    },
    courseId: {
      type: Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    enrolledAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export default models.Enrollment ||
  mongoose.model<EnrollmentDocument>("Enrollment", EnrollmentSchema);

// models/enrollment.model.ts
import mongoose, { Schema, Document, Model, models, model } from "mongoose";

export interface EnrollmentDocument extends Document {
  userId: string;
  courseId: mongoose.Types.ObjectId;
  enrolledAt: Date;
}

const EnrollmentSchema = new Schema<EnrollmentDocument>(
  {
    userId: { type: String, required: true },
    courseId: { type: Schema.Types.ObjectId, ref: "Course", required: true },
    enrolledAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// ✅ Explicitly type the model
const Enrollment: Model<EnrollmentDocument> =
  models.Enrollment || model<EnrollmentDocument>("Enrollment", EnrollmentSchema);

export default Enrollment;

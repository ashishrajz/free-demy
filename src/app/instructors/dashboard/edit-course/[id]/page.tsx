// app/instructors/dashboard/edit-course/[id]/page.tsx

import UploadCourseForm from "@/components/UploadCourseForm";
import { getCourseById } from "@/actions/course.actions";

export default async function EditCoursePage({ params }: any) {
  const course = await getCourseById(params.id);
  return <UploadCourseForm initialCourseData={course} />;
}

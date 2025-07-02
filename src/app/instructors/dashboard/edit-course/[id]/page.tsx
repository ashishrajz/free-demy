// app/dashboard/edit-course/[id]/page.tsx
import UploadCourseForm from "@/components/UploadCourseForm";
import { getCourseById } from "@/actions/course.actions";

interface EditCoursePageProps {
  params: { id: string };
}

export default async function EditCoursePage({ params }: EditCoursePageProps) {
  const course = await getCourseById(params.id); // Must be a Promise

  return <UploadCourseForm initialCourseData={course} />;
}

"use client";

import { useRouter } from "next/navigation";
import { CheckCircle } from "lucide-react";

export default function CourseUploadSuccess() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12 bg-white dark:bg-black transition-colors text-center">
      <CheckCircle className="w-16 h-16 text-green-500 mb-6" />

      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
        Course Uploaded Successfully!
      </h1>

      <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-md">
        Your course is now live on the platform. You can manage or edit it anytime from the dashboard.
      </p>

      <button
        onClick={() => router.push("/instructors/dashboard")}
        className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-md font-semibold transition"
      >
        Go to My Courses
      </button>
    </div>
  );
}

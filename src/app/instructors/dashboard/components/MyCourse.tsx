"use client";

import { useEffect, useState } from "react";
import { axiosInstance } from "@/lib/axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog } from "@headlessui/react";

interface Course {
  _id: string;
  title: string;
  price: number;
  thumbnailUrl: string;
  status: string;
}

export default function MyCourses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await axiosInstance.get("/api/instructor/courses");
        setCourses(res.data);
      } catch (err) {
        console.error("Failed to fetch instructor courses", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const handleDelete = async () => {
    if (!confirmDeleteId) return;

    setDeleting(true);
    try {
      await axiosInstance.delete(`/api/course/delete/${confirmDeleteId}`);
      setCourses((prev) => prev.filter((c) => c._id !== confirmDeleteId));
    } catch (err) {
      console.error("Error deleting course", err);
    } finally {
      setDeleting(false);
      setConfirmDeleteId(null);
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, idx) => (
          <div key={idx} className="p-4 border rounded-lg">
            <Skeleton className="h-52 w-full mb-4 rounded-md" />
            <Skeleton className="h-6 w-3/4 mb-2" />
            <Skeleton className="h-4 w-1/2 mb-2" />
            <Skeleton className="h-4 w-1/3" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <>
      {/* Course Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <div
            key={course._id}
            className="border rounded-lg p-4 shadow-sm hover:shadow-md transition cursor-pointer relative"
            onClick={(e) => {
              const target = e.target as HTMLElement;
              if (!target.closest("a") && !target.closest("button")) {
                router.push(`/course/${course._id}`);
              }
            }}
          >
            <img
              src={course.thumbnailUrl}
              alt={course.title}
              className="w-full h-52 object-cover rounded-t mb-2"
            />
            <h3 className="mt-3 font-semibold text-lg">{course.title}</h3>
            <p className="text-sm text-gray-500">₹{course.price}</p>
            <p className="text-xs mt-1 text-green-600 font-medium capitalize">
              {course.status}
            </p>

            <div className="flex flex-wrap gap-3 mt-4">
              <Link
                href={`/course/${course._id}`}
                className="text-sm px-3 py-1 bg-purple-50 text-purple-700 border border-purple-200 rounded hover:bg-purple-100 transition"
              >
                View
              </Link>
              <Link
                href={`/instructors/dashboard/edit-course/${course._id}`}
                className="text-sm px-3 py-1 bg-blue-50 text-blue-700 border border-blue-200 rounded hover:bg-blue-100 transition"
              >
                Edit
              </Link>
              <button
                onClick={() => setConfirmDeleteId(course._id)}
                className="text-sm px-3 py-1 bg-red-50 text-red-700 border border-red-200 rounded hover:bg-red-100 transition"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={!!confirmDeleteId}
        onClose={() => setConfirmDeleteId(null)}
        className="fixed inset-0 z-50 flex items-center justify-center"
      >
        {/* Light Transparent Background */}
        <div className="fixed inset-0 bg-white/50 backdrop-blur-sm" aria-hidden="true" />

        {/* Dialog Panel */}
        <Dialog.Panel className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-xl w-full max-w-sm mx-4 z-50 relative">
          <Dialog.Title className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
            Confirm Deletion
          </Dialog.Title>
          <Dialog.Description className="text-sm text-gray-600 dark:text-gray-300 mb-6">
            Are you sure you want to delete this course? This action cannot be undone.
          </Dialog.Description>

          <div className="flex justify-end gap-3">
            <button
              onClick={() => setConfirmDeleteId(null)}
              className="px-4 py-2 rounded border text-gray-700 hover:bg-gray-100 transition text-sm"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 transition text-sm disabled:opacity-50"
            >
              {deleting ? "Deleting..." : "Delete"}
            </button>
          </div>
        </Dialog.Panel>
      </Dialog>
    </>
  );
}

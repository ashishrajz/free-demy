"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { CourseType } from "@/types";
import { axiosInstance } from "@/lib/axios";
import { Skeleton } from "@/components/ui/skeleton";
import CourseCard from "@/components/CourseCard";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const q = searchParams.get("q");

  const [courses, setCourses] = useState<CourseType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      if (!q) return;

      try {
        setLoading(true);
        const res = await axiosInstance.get(`/api/course/search?q=${encodeURIComponent(q)}`);
        console.log("🔍 Search API response:", res.data); // 👈 Add this
        setCourses(res.data.courses); // Ensure your route returns { courses: [...] }
      } catch (err) {
        console.error("Failed to fetch search results:", err);
        setCourses([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [q]);

  const skeletonArray = Array.from({ length: 6 });

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">
        Search results for: <span className="text-blue-600">{q}</span>
      </h1>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {skeletonArray.map((_, idx) => (
            <div key={idx} className="border rounded-lg shadow-sm p-4 space-y-3">
              <Skeleton className="h-40 w-full rounded-md" />
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <div className="flex justify-between">
                <Skeleton className="h-4 w-12" />
                <Skeleton className="h-4 w-16" />
              </div>
            </div>
          ))}
        </div>
      ) : courses.length === 0 ? (
        <p>No courses found for this search.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 justify-items-center">
          {courses.map((course) => (
            <CourseCard key={course._id} course={course} />
          ))}
        </div>
      )}
    </div>
  );
}

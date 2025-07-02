"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { axiosInstance } from "@/lib/axios";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";

interface Course {
  _id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  authorName: string;
  category: string;
  progress: number;
  ratingStats?: {
    avgRating: number;
    totalRatings: number;
  };
}

export default function MyLearning() {
  const { user } = useUser();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchEnrolledCourses = async () => {
      try {
        const res = await axiosInstance.get("/api/user/enrolled-courses-with-ratings");
        setCourses(res.data);
      } catch (err) {
        console.error("Failed to fetch courses", err);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchEnrolledCourses();
    }
  }, [user]);

  if (!user) {
    return <div className="p-8 text-center">Please login to view your courses.</div>;
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-56 rounded-md" />
        ))}
      </div>
    );
  }

  return (
    <div>
      <div className="bg-gray-800 p-6 text-white">
        <h1 className="text-3xl font-bold font-serif ml-12">My Learning</h1>
      </div>

      <div className="p-6 max-w-7xl mx-auto">
        {courses.length === 0 ? (
          <div className="text-gray-500">You haven't enrolled in any courses yet.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {courses.map((course) => (
              <div
                key={course._id}
                className="bg-white dark:bg-gray-700 rounded shadow-md hover:shadow-lg transition cursor-pointer"
                onClick={() => router.push(`/my-learning/${course._id}`)}
              >
                <img
                  src={course.thumbnailUrl}
                  alt={course.title}
                  className="w-full h-52 object-cover rounded-t mb-2"
                />
                <div className="p-4 space-y-1">
                  <h3 className="font-semibold text-lg">{course.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-200">By {course.authorName}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-200">Category: {course.category}</p>
                  <p className="text-sm text-yellow-600">
                    ⭐ {course.ratingStats?.avgRating?.toFixed(1) || "N/A"} ({course.ratingStats?.totalRatings || 0})
                  </p>

                  {/* Progress bar */}
                  <div className="mt-2">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full"
                        style={{ width: `${course.progress || 0}%` }}
                      ></div>
                    </div>
                    <p className="text-xs mt-1 text-right text-gray-500">
                      {course.progress} % complete
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  //
}

"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { CourseType } from "@/types";
import { axiosInstance } from "@/lib/axios";
import { Skeleton } from "@/components/ui/skeleton";
import CourseCard from "@/components/CourseCard";

interface RatingInfo {
  avgRating: number;
  totalRatings: number;
}

export default function CategoryCoursesPage() {
  const { category } = useParams();
  const [courses, setCourses] = useState<CourseType[]>([]);
  
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCoursesAndRatings = async () => {
      try {
        setIsLoading(true);
        const res = await axiosInstance.get(`/api/course/category/${category}`);
        setCourses(res.data);
        
      } catch (err) {
        console.error("Failed to fetch category data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    if (category) {
      fetchCoursesAndRatings();
    }
  }, [category]);

  

  

  const formattedCategory = decodeURIComponent(category as string);
  const skeletonArray = Array.from({ length: 6 });

  // Merge ratings into course data
  

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 flex items-center gap-2">
        Courses in <span className="capitalize text-blue-600">{formattedCategory}</span>
      </h1>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 ">
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
        <p>No courses found in this category.</p>
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

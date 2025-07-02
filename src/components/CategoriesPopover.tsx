"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { axiosInstance } from "@/lib/axios";

interface Course {
  _id: string;
  title: string;
  category: string;
}

export default function CategoriesPopover() {
  const [categories, setCategories] = useState<string[]>([]);
  const [courses, setCourses] = useState<Record<string, Course[]>>({});
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await axiosInstance.get("/api/course");
        const courseList: Course[] = res.data;

        const categoryMap: Record<string, Course[]> = {};
        for (const course of courseList) {
          if (!categoryMap[course.category]) {
            categoryMap[course.category] = [];
          }
          categoryMap[course.category].push(course);
        }

        setCategories(Object.keys(categoryMap));
        setCourses(categoryMap);
      } catch (err) {
        console.error("Error fetching courses:", err);
      }
    };

    fetchCourses();
  }, []);

  return (
    <div
      className="relative z-50"
      onMouseEnter={() => setMenuOpen(true)}
      onMouseLeave={() => {
        setMenuOpen(false);
        setActiveCategory(null);
      }}
    >
      <Button variant="ghost" className="flex items-center gap-2 hover:bg-purple-200 hover:text-purple-900 dark:hover:bg-purple-400/20 dark:text-white dark:hover:text-purple-100">
        Explore
        <ChevronDown className="w-4 h-4" />
      </Button>

      {/* Category Panel */}
      {menuOpen && (
        <div className="absolute top-full left-0 bg-white dark:bg-black border border-gray-200 dark:border-gray-700 shadow-lg rounded-md w-60">
          <ul className="p-2 space-y-1">
            {categories.map((cat) => (
              <li
                key={cat}
                onMouseEnter={() => setActiveCategory(cat)}
                className={`cursor-pointer px-3 py-2 rounded transition-colors duration-200 ${
                  activeCategory === cat
                    ? "bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 font-medium"
                    : "hover:bg-purple-50 dark:hover:bg-purple-800 hover:text-purple-700 dark:hover:text-purple-300"
                }`}
              >
                {cat}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Courses Panel (only if category is hovered) */}
      {menuOpen && activeCategory && (
        <div className="absolute top-full left-[15rem] mt-0 bg-white dark:bg-black border border-gray-200 dark:border-gray-700 shadow-lg rounded-md w-[300px]">
          <div className="p-3">
            <h4 className="font-semibold mb-2">Courses</h4>
            <ul className="space-y-1">
              {courses[activeCategory]?.map((course) => (
                <li key={course._id}>
                  <Link
                    href={`/course/${course._id}`}
                    className="text-sm block px-2 py-1 rounded transition-colors duration-200 hover:bg-purple-50 dark:hover:bg-purple-800 hover:text-purple-700 dark:hover:text-purple-300"
                  >
                    {course.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

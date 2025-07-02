"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import UploadCourseForm from "@/components/UploadCourseForm";
import MyCourses from "./components/MyCourse";
import Analytics from "./components/Analytics";
import { Skeleton } from "@/components/ui/skeleton";

const tabs = [ "My Courses","Upload Course", "Analytics"];

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("My Courses");
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkRole = async () => {
      try {
        const res = await fetch("/api/user/role");
        const data = await res.json();

        if (data.role === "student") {
          router.replace("/instructors");
        } else if (data.role === "instructor" || data.role === "admin") {
          setLoading(false);
        } else {
          router.replace("/");
        }
      } catch (err) {
        console.error("Role check failed:", err);
        router.replace("/");
      }
    };

    checkRole();
  }, [router]);

  if (loading) {
    return (
      <div className="p-6 space-y-6 max-w-3xl mx-auto">
        <div className="flex space-x-4 border-b mb-6 pb-2">
          {tabs.map((_, i) => (
            <Skeleton key={i} className="h-8 w-32 rounded" />
          ))}
        </div>

        {/* Simulated form fields */}
        <div className="space-y-4">
          <Skeleton className="h-10 w-full rounded" />
          <Skeleton className="h-10 w-full rounded" />
          <Skeleton className="h-10 w-full rounded" />
          <Skeleton className="h-48 w-full rounded" />
          <Skeleton className="h-10 w-1/2 rounded" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex space-x-6 border-b mb-6 pb-2">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 font-medium ${
              activeTab === tab
                ? "border-b-2 border-purple-600 text-purple-600"
                : "text-gray-600 dark:text-gray-300"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>
      {activeTab === "My Courses" && <MyCourses />}

      {activeTab === "Upload Course" && <UploadCourseForm />}
      
      {activeTab === "Analytics" && <Analytics />}
    </div>
  );
}

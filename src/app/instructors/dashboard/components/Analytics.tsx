"use client";

import { useEffect, useState } from "react";
import { axiosInstance } from "@/lib/axios";

interface AnalyticsData {
  totalCourses: number;
  totalEnrollments: number;
  totalRevenue: number;
}

export default function Analytics() {
  const [data, setData] = useState<AnalyticsData | null>(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await axiosInstance.get("/api/instructor/analytics");
        setData(res.data);
      } catch (err) {
        console.error("Failed to fetch analytics data", err);
      }
    };

    fetchAnalytics();
  }, []);

  if (!data) return <p>Loading analytics...</p>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
      <div className="p-6 border rounded shadow">
        <h2 className="text-xl font-bold">{data.totalCourses}</h2>
        <p className="text-gray-500">Courses</p>
      </div>
      <div className="p-6 border rounded shadow">
        <h2 className="text-xl font-bold">{data.totalEnrollments}</h2>
        <p className="text-gray-500">Enrollments</p>
      </div>
      <div className="p-6 border rounded shadow">
        <h2 className="text-xl font-bold">₹{data.totalRevenue}</h2>
        <p className="text-gray-500">Total Revenue</p>
      </div>
    </div>
  );
}

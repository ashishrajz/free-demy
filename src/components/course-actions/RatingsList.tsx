"use client";

import { useEffect, useState } from "react";
import { axiosInstance } from "@/lib/axios";

interface RatingType {
  _id: string;
  value: number;
  comment?: string; // changed from review to comment
  createdAt: string;
  userId: {
    name: string;
    image: string;
  };
}

export default function RatingsList({ courseId }: { courseId: string }) {
  const [ratings, setRatings] = useState<RatingType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRatings = async () => {
      try {
        const res = await axiosInstance.get(`/api/rating/${courseId}`);
        setRatings(res.data);
      } catch (err) {
        console.error("Failed to fetch ratings:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRatings();
  }, [courseId]);

  if (loading) return <p>Loading ratings...</p>;

  if (ratings.length === 0) return <p className="text-gray-600">No ratings yet.</p>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {ratings.map((r) => (
        <div key={r._id} className="border rounded-md p-4 shadow-sm bg-white dark:bg-gray-800">
          <div className="flex items-center gap-3 mb-2">
            <img
              src={r.userId?.image || "/default-user.png"}
              alt={r.userId?.name || "Anonymous"}
              className="w-10 h-10 rounded-full object-cover"
            />
            <div>
              <p className="font-semibold">{r.userId?.name || "Anonymous"}</p>
              <p className="text-sm text-gray-500">
                {new Date(r.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1 mb-1">
            {[...Array(5)].map((_, i) => (
              <span key={i} className={i < r.value ? "text-yellow-500" : "text-gray-300"}>
                ★
              </span>
            ))}
          </div>

          {r.comment && (
            <p className="text-gray-700 mt-2 whitespace-pre-line">{r.comment}</p>
          )}
        </div>
      ))}
    </div>
  );
}

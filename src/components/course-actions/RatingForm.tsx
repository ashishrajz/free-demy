"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { axiosInstance } from "@/lib/axios";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Star } from "lucide-react";

interface RatingFormProps {
  courseId: string;
  userId: string;
}

export default function RatingForm({ courseId, userId }: RatingFormProps) {
  const [rating, setRating] = useState<number>(5);
  const [hovered, setHovered] = useState<number | null>(null);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await axiosInstance.post("/api/rating/add", {
        courseId,
        value: rating,
        comment,
      });
      toast.success("Rating submitted!");
      setComment("");
      router.refresh();
    } catch (err: any) {
      toast.error("Failed to submit rating");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-10 space-y-5 bg-white dark:bg-black p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold text-gray-800 dark:text-white">Leave a Rating</h2>

      {/* Star Rating */}
      <div className="flex gap-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <motion.button
            key={star}
            type="button"
            onMouseEnter={() => setHovered(star)}
            onMouseLeave={() => setHovered(null)}
            onClick={() => setRating(star)}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.95 }}
            className="focus:outline-none"
          >
            <Star
              size={30}
              className={`transition-colors ${
                (hovered ?? rating) >= star ? "text-yellow-400" : "text-gray-300"
              }`}
              fill={(hovered ?? rating) >= star ? "#facc15" : "none"}
            />
          </motion.button>
        ))}
      </div>

      {/* Comment Box */}
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        rows={3}
        placeholder="Write a short review..."
      />

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="bg-purple-600 text-white px-6 py-2 rounded-md hover:bg-purple-700 transition-all disabled:opacity-50"
      >
        {isSubmitting ? "Submitting..." : "Submit Review"}
      </button>
    </form>
  );
}

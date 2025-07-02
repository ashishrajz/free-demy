"use client";

import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { axiosInstance } from "@/lib/axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import LoadingPlaceholder from "@/components/ui/LoadingPlaceholder";

export default function EnrollNowButton({ courseId }: { courseId: string }) {
  const { user } = useUser();
  const router = useRouter();

  const [isEnrolled, setIsEnrolled] = useState(false);
  const [loading, setLoading] = useState(true);

  // Check if user is already enrolled
  useEffect(() => {
    const checkEnrollment = async () => {
      if (!user) return setLoading(false);
    
      try {
        const res = await axiosInstance.get("/api/user/enrolled-courses");
        const enrolledCourses = res.data || [];
    
        // Check if any of the populated courses match the courseId
        const enrolled = enrolledCourses.some((c: any) => c._id === courseId);
        setIsEnrolled(enrolled);
      } catch (err) {
        console.error("Error checking enrollment:", err);
      } finally {
        setLoading(false);
      }
    };
    

    checkEnrollment();
  }, [user, courseId]);

  // Handle Stripe checkout
  const handleEnrollNow = async () => {
    if (!user) return toast.error("Please login first");

    try {
      const res = await axiosInstance.post("/api/stripe/checkout", { courseId });
      const { checkoutUrl } = res.data;

      if (checkoutUrl) {
        window.location.href = checkoutUrl;
      } else {
        toast.error("Unable to initiate payment");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    }
  };

  const handleStartLearning = () => {
    router.push(`/my-learning/${courseId}`);
  };

  if (loading) return <LoadingPlaceholder />;

  return isEnrolled ? (
    <button
      onClick={handleStartLearning}
      className="px-9 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded "
    >
      Start Learning
    </button>
  ) : (
    <button
      onClick={handleEnrollNow}
      className="px-19 py-2 border border-purple-500 text-purple-500 hover:bg-purple-200 transition-colors duration-200"
    >
      Enroll Now
    </button>
  );
}

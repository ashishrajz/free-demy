"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { axiosInstance } from "@/lib/axios";
import toast from "react-hot-toast";

export default function AddToCartButtonn({
  courseId,
  className = "",
}: {
  courseId: string;
  className?: string;
})  {
  const { user } = useUser();
  const router = useRouter();
  const [isInCart, setIsInCart] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkCourseStatus = async () => {
      if (!user) return;
      try {
        const res = await axiosInstance.get("/api/user/courses"); // 👈 your backend should return { enrolledCourses, cartCourses }
        const enrolled = res.data.enrolledCourses.map((c: any) => c._id);
        const cart = res.data.cartCourses.map((c: any) => c._id);

        setIsEnrolled(enrolled.includes(courseId));
        setIsInCart(cart.includes(courseId));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    checkCourseStatus();
  }, [user, courseId]);

  const handleClick = async () => {
    if (!user) return toast.error("Please login first");
    if (isEnrolled) return toast.error("You already own this course");

    if (isInCart) {
      router.push("/cart");
    } else {
      try {
        await axiosInstance.post("/api/cart/add", { courseId });
        toast.success("Added to cart");
        setIsInCart(true);
      } catch (err: any) {
        const message =
          err.response?.data || "Something went wrong. Please try again.";
        toast.error(message);
      }
    }
  };

  const getButtonText = () => {
    if (loading) return "Loading...";
    if (isEnrolled) return "Enrolled";
    if (isInCart) return "Go to Cart";
    return "Add";
  };

  return (
    <button
      onClick={handleClick}
      disabled={isEnrolled || loading}
      className={` py-2 rounded transition-colors duration-200 ${className} ${
        isEnrolled
          ? "bg-purple-400 text-white cursor-not-allowed"
          : isInCart
          ? "bg-purple-500 hover:bg-purple-600 text-white"
          : "border border-purple-500 text-purple-500 hover:bg-purple-200"
      }`}
    >
      {getButtonText()}
    </button>
  );
}

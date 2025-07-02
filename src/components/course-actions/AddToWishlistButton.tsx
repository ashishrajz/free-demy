"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { axiosInstance } from "@/lib/axios";
import toast from "react-hot-toast";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import LoadingPlaceholder from "@/components/ui/LoadingPlaceholder";

export default function AddToCartButtonn({
  courseId,
  className = "",
}: {
  courseId: string;
  className?: string;
})  {
  const { user } = useUser();
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWishlistStatus = async () => {
      if (!user) return;
      try {
        const res = await axiosInstance.get("/api/wishlist/get");
        const wishlist = res.data.wishlist || [];
        setIsWishlisted(wishlist.some((course: any) => course._id === courseId));
      } catch (error) {
        console.error("Failed to fetch wishlist", error);
      }finally {
        setLoading(false);
      }
    };

    fetchWishlistStatus();
  }, [user, courseId]);

  const toggleWishlist = async () => {
    if (!user) {
      toast.error("Please login first");
      return;
    }

    try {
      if (isWishlisted) {
        await axiosInstance.post("/api/wishlist/remove", { courseId });
        toast.success("Removed from wishlist");
      } else {
        await axiosInstance.post("/api/wishlist/add", { courseId });
        toast.success("Added to wishlist");
      }

      setIsWishlisted(!isWishlisted);
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    }
  };

  
  if (loading) return <LoadingPlaceholder />;

  return (
    
      <button
      onClick={toggleWishlist}
      className={`text-xl flex items-center justify-center text-purple-500 hover:scale-110 transition-transform duration-150 border border-purple-500 border-solid rounded-sm py-2 ${className}`}
      aria-label="Toggle wishlist"
    >
      {isWishlisted ? <FaHeart /> : <FaRegHeart />}
    </button>

    
    
  );
}

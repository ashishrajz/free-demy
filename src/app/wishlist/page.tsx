"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Image from "next/image";
import axios from "axios";
import { Skeleton } from "@/components/ui/skeleton";
import AddToCartButtonn from "@/components/course-actions/AddToCartButton";
import AddToWishlistButton from "@/components/course-actions/AddToWishlistButton";
import EnrollNowButton from "@/components/course-actions/EnrollNowButton";

interface Course {
  _id: string;
  title: string;
  thumbnailUrl: string;
  authorName: string;
  category: string;
  price: number;
  avgRating: number;
  totalRatings: number;
}

export default function WishlistPage() {
  const { user } = useUser();
  const [wishlist, setWishlist] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function fetchWishlist() {
      try {
        const res = await axios.get("/api/user/wishlist-with-ratings");
        setWishlist(res.data);
      } catch (err) {
        console.error("Failed to fetch wishlist", err);
      } finally {
        setIsLoading(false);
      }
    }

    if (user) {
      fetchWishlist();
    }
  }, [user]);

  

  return (
    <div>
      <div className="bg-gray-800 p-6 text-white">
        <h1 className="text-3xl font-bold font-serif ml-12">Wishlist</h1>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {isLoading ? (
          <div className="space-y-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex flex-col md:flex-row items-center gap-4 border p-4 rounded shadow">
                <Skeleton className="w-full md:w-52 h-40" />
                <div className="flex-1 space-y-2 w-full">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-4 w-1/3" />
                  <Skeleton className="h-4 w-1/4" />
                </div>
              </div>
            ))}
          </div>
        ) : wishlist.length === 0 ? (
          <p>No items in wishlist.</p>
        ) : (
          <div className="space-y-6">
            {wishlist.map((course) => (
              <div
                key={course._id}
                onClick={() => router.push(`/course/${course._id}`)}
                className="flex flex-col md:flex-row items-center border p-4 rounded shadow-md gap-4 cursor-pointer hover:shadow-lg transition"
              >
                {/* Thumbnail */}
                <div className="w-full md:w-52 h-40 relative rounded overflow-hidden">
                  <Image
                    src={course.thumbnailUrl}
                    alt={course.title}
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Info */}
                <div className="flex-1 w-full">
                  <h2 className="text-xl font-semibold">{course.title}</h2>
                  <p className="text-sm text-gray-600">By {course.authorName}</p>
                  <p className="text-sm text-gray-500">Category: {course.category}</p>
                  <p className="text-sm text-yellow-600">
                    ⭐ {course.avgRating.toFixed(1)} ({course.totalRatings})
                  </p>
                  <p className="text-md font-semibold mt-1">₹{course.price}</p>
                </div>

                {/* Actions */}
                <div onClick={(e) => e.stopPropagation()} className="flex flex-col gap-3 w-full md:w-auto">
  <div className="flex flex-row gap-2 w-full">
    <AddToCartButtonn courseId={course._id.toString()} className="w-5/6" />
    <AddToWishlistButton courseId={course._id.toString()} className="w-1/6" />
  </div>
  <EnrollNowButton courseId={course._id.toString()}  />
</div>

              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

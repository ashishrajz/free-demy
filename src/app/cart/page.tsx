"use client";

import { useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import Image from "next/image";
import axios from "axios";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from "next/navigation";

export default function CartPage() {
  const [cartCourses, setCartCourses] = useState<any[]>([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [loading, setLoading] = useState(true); // 🆕 loading state
  const router = useRouter();

  useEffect(() => {
    async function fetchCart() {
      try {
        const res = await axios.get("/api/cart");
        setCartCourses(res.data.cartCourses);
        setTotalAmount(res.data.totalAmount);
      } catch (err) {
        console.error("Failed to fetch cart", err);
      } finally {
        setLoading(false);
      }
    }
    fetchCart();
  }, []);

  const handleRemove = async (courseId: string) => {
    await axios.delete(`/api/cart/${courseId}`);
    setCartCourses((prev) => prev.filter((c) => c._id !== courseId));
  };

  const handleCheckout = async () => {
    const res = await axios.post("/api/stripe/checkout-all", {
      courses: cartCourses.map((c) => c._id),
    });
    const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);
    if (stripe) stripe.redirectToCheckout({ sessionId: res.data.sessionId });
  };

  return (
    <div>
      <div className="bg-gray-800 p-6 text-white">
        <h1 className="text-3xl font-bold font-serif ml-12">Your Cart</h1>
      </div>
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-6">
            {loading ? (
              // 🔧 Skeleton while loading
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-center border p-4 rounded-lg shadow gap-4">
                  <Skeleton className="w-28 h-28 rounded" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-6 w-2/3" />
                    <Skeleton className="h-4 w-1/3" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                  <div className="w-24 space-y-2">
                    <Skeleton className="h-6" />
                    <Skeleton className="h-4" />
                  </div>
                </div>
              ))
            ) : cartCourses.length === 0 ? (
              <p>No items in cart.</p>
            ) : (cartCourses.map((course) => (
              <div
                key={course._id}
                onClick={() => router.push(`/course/${course._id}`)} // 👈 Navigate on click
                className="flex items-center border p-4 rounded-lg shadow cursor-pointer hover:shadow-md transition"
              >
                <Image
                  src={course.thumbnailUrl}
                  alt={course.title}
                  width={100}
                  height={100}
                  className="rounded object-cover w-28 h-28 mr-4"
                />
                <div className="flex-1">
                  <h2 className="text-xl font-semibold">{course.title}</h2>
                  <p className="text-gray-600">By {course.author?.name}</p>
                  <p className="text-sm text-gray-500">
                    {course.category} • {course.sections?.length} sections •{" "}
                    {course.sections?.reduce(
                      (sum: number, sec: any) => sum + sec.lessons.length,
                      0
                    )} lessons
                  </p>
                </div>
                <div
                  className="text-right ml-4"
                  onClick={(e) => e.stopPropagation()} // ❗ Prevents triggering redirect on Remove
                >
                  <p className="text-lg font-bold mb-2">₹{course.price}</p>
                  <button
                    onClick={() => handleRemove(course._id)}
                    className="text-red-600 hover:underline text-sm"
                  >
                    Remove
                  </button>
                </div>
              </div>
            )))}
          </div>
          <div className="border p-6 rounded shadow h-fit">
            <h2 className="text-lg font-bold mb-4">Total</h2>
            {loading ? (
              <Skeleton className="h-6 w-24 mb-4" />
            ) : (
              <p className="text-xl font-semibold">₹{totalAmount}</p>
            )}
            <button
              onClick={handleCheckout}
              disabled={loading || cartCourses.length === 0}
              className="w-full mt-4 bg-purple-600 text-white py-2 rounded hover:bg-purple-700 disabled:opacity-50"
            >
              Checkout with Stripe
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

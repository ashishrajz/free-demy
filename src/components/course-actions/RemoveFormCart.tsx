"use client";

import { useEffect, useState } from "react";
import { axiosInstance } from "@/lib/axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function CartPage() {
  const [cartCourses, setCartCourses] = useState<any[]>([]);
  const router = useRouter();

  const fetchCart = async () => {
    try {
      const res = await axiosInstance.get("/api/cart");
      setCartCourses(res.data.cartCourses);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const removeFromCart = async (courseId: string) => {
    try {
      await axiosInstance.post("/api/cart/remove", { courseId });
      toast.success("Removed from cart");
      setCartCourses(prev => prev.filter(c => c._id !== courseId));
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Your Cart</h2>
      {cartCourses.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <ul className="space-y-4">
          {cartCourses.map(course => (
            <li key={course._id} className="border p-4 rounded shadow-sm">
              <h3 className="font-semibold">{course.title}</h3>
              <p className="text-gray-600">{course.description}</p>
              <button
                onClick={() => removeFromCart(course._id)}
                className="mt-2 px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Remove from Cart
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

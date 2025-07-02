// app/payment/success/page.tsx
"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import axios from "axios";
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const sessionId = searchParams.get("session_id");

  useEffect(() => {
    const enrollUser = async () => {
      if (!sessionId) return;

      try {
        const res = await axios.post("/api/enroll", { sessionId });
        console.log("Enrollment success:", res.data);
      } catch (err) {
        console.error("Enroll error:", err);
      }
    };

    enrollUser();
  }, [sessionId]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-16 bg-white dark:bg-black transition-colors">
      <div className="text-green-600 dark:text-green-400 mb-6 animate-bounce">
        <CheckCircle className="w-20 h-20" />
      </div>

      <h1 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-4">
        Payment successful!
      </h1>
      <p className="text-lg text-gray-600 dark:text-gray-300 text-center mb-8 max-w-md">
        Your course has been added to your account.
      </p>

      <Button
        onClick={() => router.push("/my-learning")}
        className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-md font-semibold transition"
      >
        Go to My Learning
      </Button>
    </div>
  );
}

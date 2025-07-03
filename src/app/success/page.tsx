// File: app/payment/success/page.tsx

"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import axios from "axios";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

// Separated component that uses `useSearchParams`
function SuccessPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const sessionId = searchParams.get("session_id");

  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");

  useEffect(() => {
    const enrollUser = async () => {
      if (!sessionId) return setStatus("error");

      try {
        const res = await axios.post("/api/enroll", { sessionId });
        console.log("Enroll response:", res.data);

        if (res.data.success) {
          setStatus("success");
        } else {
          setStatus("error");
        }
      } catch (err) {
        console.error("Enroll error:", err);
        setStatus("error");
      }
    };

    enrollUser();
  }, [sessionId]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-16 bg-white dark:bg-black transition-colors">
      {status === "loading" && (
        <>
          <Loader2 className="w-10 h-10 text-purple-600 animate-spin mb-6" />
          <p className="text-gray-700 dark:text-gray-300">Finalizing your purchase...</p>
        </>
      )}

      {status === "success" && (
        <>
          <div className="text-green-600 dark:text-green-400 mb-6 animate-bounce">
            <CheckCircle className="w-20 h-20" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-4">
            Payment successful!
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 text-center mb-8 max-w-md">
            Your courses have been added to your account.
          </p>
          <Button
            onClick={() => router.push("/my-learning")}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-md font-semibold transition"
          >
            Go to My Learning
          </Button>
        </>
      )}

      {status === "error" && (
        <>
          <div className="text-red-600 dark:text-red-400 mb-6">
            <XCircle className="w-20 h-20" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-4">
            Something went wrong.
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 text-center mb-8 max-w-md">
            We couldn’t verify your payment. Please contact support or try again.
          </p>
          <Button
            onClick={() => router.push("/")}
            className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-md font-semibold transition"
          >
            Go to Home
          </Button>
        </>
      )}
    </div>
  );
}

// ✅ Wrap it in Suspense
export default function SuccessPage() {
  return (
    <Suspense fallback={<p className="text-center py-20">Loading...</p>}>
      <SuccessPageContent />
    </Suspense>
  );
}

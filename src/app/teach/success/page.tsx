"use client";

import { useRouter } from "next/navigation";

export default function SuccessPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12 bg-white dark:bg-black transition-colors">
      <div className="text-5xl mb-6">✅</div>
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">
        We will get back to you soon!
      </h1>
      <p className="text-gray-600 dark:text-gray-300 mb-8 text-center max-w-md">
        Thank you for signing up to become an instructor. You're one step closer
        to teaching the world.
      </p>
      <button
        onClick={() => router.push("/")}
        className="bg-purple-600 text-white px-6 py-3 rounded-md hover:bg-purple-700 transition"
      >
        Go to Home
      </button>
    </div>
  );
}

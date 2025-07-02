"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook, FaApple } from "react-icons/fa";

export default function InstructorSignupForm() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(true);
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ fullName, email, consent });
    router.push("/teach/success");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12 bg-white dark:bg-black transition-colors">
      {/* Top Illustration or Icons */}
      <div className="text-4xl mb-6">📚 💌 🌐</div>

      <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
        Become an Instructor
      </h1>
      <p className="text-center text-gray-600 dark:text-gray-300 max-w-md mb-8">
        Discover a supportive community of online instructors. Get instant
        access to all course creation resources.
      </p>

      <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4">
        <input
          type="text"
          placeholder="Full name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
          required
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
          required
        />

        <label className="flex items-start text-sm text-gray-700 dark:text-gray-300">
          <input
            type="checkbox"
            className="mt-1 mr-2"
            checked={consent}
            onChange={() => setConsent(!consent)}
          />
          I want to get the most out of my experience, by receiving emails with
          insider tips, motivation, special updates and promotions reserved for
          instructors.
        </label>

        <button
          type="submit"
          className="w-full bg-purple-600 text-white py-3 rounded-md hover:bg-purple-700 transition font-semibold"
        >
          📩 Continue with email
        </button>
      </form>

      {/* OR Divider */}
      <div className="my-6 text-gray-400 dark:text-gray-500">
        ──────── or ────────
      </div>

      {/* Social Options */}
      <div className="flex gap-6">
        <button className="text-2xl"><FcGoogle /></button>
        <button className="text-2xl text-blue-600"><FaFacebook /></button>
        <button className="text-2xl text-black dark:text-white"><FaApple /></button>
      </div>

      <p className="text-xs text-gray-500 dark:text-gray-400 mt-6 text-center max-w-xs">
        By signing up, you agree to our{" "}
        <a href="#" className="underline">Terms of Use</a> and{" "}
        <a href="#" className="underline">Privacy Policy</a>.
      </p>
    </div>
  );
}

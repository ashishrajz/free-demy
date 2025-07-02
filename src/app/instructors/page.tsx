"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton"; // Ensure this exists

export default function TeachPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkRoleAndRedirect = async () => {
      try {
        const res = await fetch("/api/user/role");
        const data = await res.json();

        if (data.role === "admin" || data.role === "instructor") {
          router.push("/instructors/dashboard");
        } else {
          setLoading(false);
        }
      } catch (error) {
        console.error("Failed to check user role", error);
        setLoading(false);
      }
    };

    checkRoleAndRedirect();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-black px-6 py-16 sm:px-12">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <Skeleton className="h-10 w-2/3" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-12 w-40" />
          </div>
          <Skeleton className="h-[300px] w-full rounded" />
        </div>

        <div className="max-w-5xl mx-auto mt-24">
          <Skeleton className="h-10 w-1/2 mb-8" />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-12">
            <Skeleton className="h-40" />
            <Skeleton className="h-40" />
            <Skeleton className="h-40" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black px-6 py-16 sm:px-12 flex flex-col items-center justify-start transition-colors">
      {/* Hero Section */}
      <div className="max-w-5xl w-full grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Come teach <br /> with us
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-lg mb-6">
            Become an instructor and change lives — including your own
          </p>
          <button
            onClick={() => router.push("/teach/form")}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded font-semibold transition"
          >
            Get started
          </button>
        </div>
        <div className="w-full flex justify-center">
          <Image
            src="/teacher.png"
            alt="Instructor"
            width={400}
            height={400}
            className="rounded"
          />
        </div>
      </div>

      {/* Reasons Section */}
      <div className="max-w-5xl w-full mt-24 text-center">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-12">
          So many reasons to start
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-12">
          {[
            {
              icon: "📝",
              title: "Teach your way",
              desc: "Publish the course you want, in the way you want, and always have control of your own content.",
            },
            {
              icon: "🌟",
              title: "Inspire learners",
              desc: "Teach what you know and help learners explore their interests, gain new skills, and advance their careers.",
            },
            {
              icon: "💰",
              title: "Get rewarded",
              desc: "Expand your professional network, build your expertise, and earn money on each paid enrollment.",
            },
          ].map((item, i) => (
            <div key={i}>
              <div className="text-3xl mb-4">{item.icon}</div>
              <h3 className="font-semibold text-xl text-gray-900 dark:text-white mb-2">
                {item.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

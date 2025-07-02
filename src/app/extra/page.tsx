"use client";

import Image from "next/image";
import React from "react";
import { useRouter } from "next/navigation";

export default function ExtraPage() {

  const router = useRouter();
  return (
    <div className="min-h-screen bg-white dark:bg-black px-6 py-16 transition-colors">
      {/* Section 1: AI for Business Leaders */}
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12">
        {/* Text */}
        <div className="flex-1">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            AI for Business Leaders
          </h1>
          <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
            Build an AI-habit for you and your team that builds hands-on
            skills to help you lead effectively.
          </p>
          <button onClick={() => router.push("/course/68657ae9570db134be6062d6")} className="px-6 py-3 border-2 border-purple-600 text-purple-600 font-semibold rounded-md hover:bg-purple-600 hover:text-white transition">
            Start Learning →
          </button>
        </div>

        {/* Image */}
        <div className="flex-1">
          <Image
            src="/ai-card.png"
            alt="AI Cards"
            width={800}
            height={400}
            className="w-full h-auto"
          />
        </div>
      </div>

      {/* Section 2: Trusted by Companies */}
      <div className="mt-24 text-center">
        <p className="text-lg text-gray-600 dark:text-gray-400 mb-10">
          Trusted by over <strong className="text-gray-900 dark:text-white">16,000 companies</strong> and millions of learners around the world
        </p>

        <div className="flex flex-wrap justify-center gap-12 items-center max-w-5xl mx-auto">
          <Image src="/logo-vw.png" alt="Volkswagen" width={80} height={80} />
          <Image src="/logo-samsung.png" alt="Samsung" width={100} height={60} />
          <Image src="/logo-cisco.webp" alt="Cisco" width={80} height={60} />
          <Image src="/logo-vimeo.png" alt="Vimeo" width={100} height={60} />
          <Image src="/pg-logo.png" alt="P&G" width={60} height={60} />
          <Image src="/logo-hp.png" alt="Hewlett Packard" width={60} height={40} />
          <Image src="/logo-citi.png" alt="Citi" width={80} height={40} />
        </div>
      </div>
    </div>
  );
}

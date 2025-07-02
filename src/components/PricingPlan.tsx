"use client";

import React from "react";
import { useRouter } from "next/navigation";

const plans = [
  {
    name: "Personal Plan",
    target: "For you",
    users: "Individual",
    price: "Starting at ₹0 per month",
    note: "Billed monthly or annually. Cancel anytime.",
    button: "Start subscription",
    features: [
      "Access to 26,000+ top courses",
      "Certification prep",
      "Goal-focused recommendations",
      "AI-powered coding exercises",
    ],
  },
  {
    name: "Team Plan",
    target: "For your team",
    users: "2 to 20 people",
    price: "₹0 a month per user",
    note: "Billed annually. Cancel anytime.",
    button: "Start subscription",
    features: [
      "Access to 13,000+ top courses",
      "Certification prep",
      "Goal-focused recommendations",
      "AI-powered coding exercises",
      "Analytics and adoption reports",
    ],
  },
  {
    name: "Enterprise Plan",
    target: "For your whole organization",
    users: "More than 20 people",
    price: "Contact sales for pricing",
    note: "",
    button: "Start Subscription",
    features: [
      "Access to 30,000+ top courses",
      "Certification prep",
      "Goal-focused recommendations",
      "AI-powered coding exercises",
      "Advanced analytics and insights",
      "Dedicated customer success team",
      "International course collection featuring 15 languages",
      "Customizable content",
      "Hands-on tech training with add-on",
      "Strategic implementation services with add-on",
    ],
  },
];

export default function PricingPlans() {
  const router = useRouter();

  return (
    <div className="min-h-screen px-4 py-10 bg-white dark:bg-black text-center text-gray-800 dark:text-white">
      <h1 className="text-4xl sm:text-6xl font-bold mb-2">Choose a plan for success</h1>
      <p className="text-gray-600 dark:text-gray-300 mb-10">
        Don’t want to buy courses one by one? Pick a plan to help you, your team, or your organization achieve outcomes faster.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {plans.map((plan, idx) => (
          <div
            key={idx}
            className="border border-gray-200 dark:border-gray-700 shadow-md rounded-lg p-6 flex flex-col items-start bg-white dark:bg-gray-900"
          >
            <h2 className="text-xl font-semibold mb-1">{plan.name}</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{plan.target}</p>
            <p className="text-sm text-gray-500 dark:text-gray-500 mb-4">{plan.users}</p>
            <p className="text-lg font-semibold mb-1">{plan.price}</p>
            {plan.note && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">{plan.note}</p>
            )}
            <button
              onClick={() => router.push("/")}
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md w-full mb-4 transition"
            >
              {plan.button}
            </button>
            <ul className="space-y-2 text-left text-sm text-gray-700 dark:text-gray-300 w-full">
              {plan.features.map((feature, fIdx) => (
                <li key={fIdx} className="flex items-start">
                  <span className="text-green-600 mr-2">✔</span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

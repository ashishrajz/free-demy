"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";

type Suggestion = {
  _id: string;
  title: string;
};

export default function MobileSearchPage() {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const router = useRouter();

  useEffect(() => {
    const delay = setTimeout(() => {
      if (query.trim()) {
        fetch(`/api/search/suggestions?q=${encodeURIComponent(query)}`)
          .then((res) => res.json())
          .then((data) => setSuggestions(data));
      } else {
        setSuggestions([]);
      }
    }, 300);

    return () => clearTimeout(delay);
  }, [query]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  const handleSuggestionClick = (id: string) => {
    router.push(`/course/${id}`);
  };

  return (
    <div className="p-4 space-y-4 max-w-xl mx-auto">
      {/* Search Bar + Close Button Row */}
      <div className="flex items-center gap-2">
        <form
          onSubmit={handleSubmit}
          className="flex items-center gap-2 border border-purple-400 rounded-full px-4 py-2 bg-white dark:bg-gray-700 shadow-sm flex-1"
        >
          <Search className="h-5 w-5 text-purple-500" />
          <input
            type="text"
            placeholder="Search for courses or categories"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent focus:outline-none text-sm placeholder-purple-500"
          />
        </form>

        {/* Close Button */}
        <button
          onClick={() => router.push("/")}
          className="text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white p-2"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Suggestions */}
      {suggestions.length > 0 && (
        <ul className="bg-white dark:bg-gray-700 rounded-lg shadow-md border divide-y text-sm">
          {suggestions.map((item) => (
            <li
              key={item._id}
              className="px-4 py-3 hover:bg-purple-100 dark:hover:bg-purple-700 cursor-pointer"
              onClick={() => handleSuggestionClick(item._id)}
            >
              {item.title}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

"use client";

import { Search } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

type Suggestion = {
  _id: string;
  title: string;
};

const SearchInput = () => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const delay = setTimeout(() => {
      if (query.trim().length > 0) {
        fetch(`/api/search/suggestions?q=${encodeURIComponent(query)}`)
          .then(res => res.json())
          .then(data => setSuggestions(data));
      } else {
        setSuggestions([]);
      }
    }, 300); // debounce

    return () => clearTimeout(delay);
  }, [query]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${query}`);
    }
  };

  const handleSuggestionClick = (id: string) => {
    router.push(`/course/${id}`);
    setShowSuggestions(false);
  };

  return (
    <div className="relative w-80 max-w-md">
      <form
        onSubmit={handleSearch}
        className="flex items-center gap-2 w-full 
        text-purple-700 border border-purple-300 rounded-full px-4 py-2 
        transition focus-within:ring-2 focus-within:ring-purple-400 bg-white dark:bg-gray-800 dark:text-purple-300 dark:border-purple-600"
      >
        <Search className="h-5 w-5 text-purple-500" />
        <input
          type="text"
          placeholder="Search anything"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setShowSuggestions(true);
          }}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
          className="bg-transparent focus:outline-none w-full placeholder-purple-500 text-sm"
        />
      </form>

      {showSuggestions && suggestions.length > 0 && (
        <ul className="absolute z-50 bg-white dark:bg-gray-800 shadow-lg border mt-1 w-full rounded-md overflow-hidden">
          {suggestions.map((item) => (
            <li
              key={item._id}
              className="px-4 py-2 hover:bg-purple-100 dark:hover:bg-purple-700 cursor-pointer text-sm"
              onClick={() => handleSuggestionClick(item._id)}
            >
              {item.title}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchInput;

//dark

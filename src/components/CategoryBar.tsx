'use client';

import Link from 'next/link';

const categories = [
  'Development',
  'Business',
  'Trading',
  'DSA',
  'Editing',
  'Design',
  'Marketing',
  'Health & Fitness',
  'Content Creation',
  'AI',
];

const CategoryBar = () => {
  return (
    <div className="hidden md:block w-full shadow-md border-b bg-background overflow-x-auto whitespace-nowrap z-10 relative">
      <div className="flex max-w-7xl items-center space-x-15 px-30 py-3">
        {categories.map((category) => (
          <Link
            key={category}
            href={`/courses/category/${encodeURIComponent(
              category.toLowerCase().replace(/ & /g, '-').replace(/\s+/g, '-')
            )}`}
            className="text-sm font-medium text-muted-foreground hover:text-purple-600 transition-colors"
          >
            {category}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CategoryBar;

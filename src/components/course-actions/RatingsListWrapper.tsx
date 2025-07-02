// src/components/course-actions/RatingsListWrapper.tsx
"use client";

import RatingsList from "./RatingsList";

export default function RatingsListWrapper({ courseId }: { courseId: string }) {
  return <RatingsList courseId={courseId} />;
}

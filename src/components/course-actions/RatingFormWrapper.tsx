"use client";

import dynamic from "next/dynamic";

const RatingForm = dynamic(() => import("./RatingForm"), {
  ssr: false,
  loading: () => <p>Loading rating form...</p>,
});

export default function RatingFormWrapper({
  courseId,
  userId,
}: {
  courseId: string;
  userId?: string;
}) {
  if (!userId) return null;
  return <RatingForm courseId={courseId} userId={userId} />;
}

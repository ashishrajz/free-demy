"use client";

import RatingForm from "./RatingForm";

interface Props {
  courseId: string;
  userId: string;
}

export default function RatingFormWrapper({ courseId, userId }: Props) {
  return <RatingForm courseId={courseId} userId={userId} />;
}

// app/course/[id]/page.tsx
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { connectDB } from "@/lib/db";
import Course from "@/lib/models/course.model";
import Rating from "@/lib/models/rating.model";
import { formatDistanceToNow } from "date-fns";
import mongoose from "mongoose";
import AddToCartButtonn from "@/components/course-actions/AddToCartButtonn";
import AddToWishlistButton from "@/components/course-actions/AddToWishlistButton";
import EnrollNowButton from "@/components/course-actions/EnrollNowButton";
import { currentUser } from "@clerk/nextjs/server";
import { getUserByClerkId } from "@/actions/user.actions";
import RatingForm from "@/components/course-actions/RatingForm";
import dynamic from "next/dynamic";
import { Suspense } from "react";
import { Badge } from "@/components/ui/badge";
import { BadgeCheckIcon } from "lucide-react";

const RatingsList = dynamic(() => import("@/components/course-actions/RatingsList"), {
  loading: () => <p>Loading ratings...</p>,
});

export const metadata: Metadata = {
  title: "Course Detail",
};

interface CourseType {
  _id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  thumbnailUrl: string;
  authorName: string;
  createdAt: string | Date;
  updatedAt: string | Date;
  sections: {
    title: string;
    lessons: {
      title: string;
      videoUrl: string;
    }[];
  }[];
}

export default async function CoursePage({ params }: { params: { id: string } }) {
  await connectDB();
  

  if (!mongoose.Types.ObjectId.isValid(params.id)) {
    notFound();
  }

  const course = await Course.findById(params.id).lean<CourseType>();
  const ratingStats = await Rating.aggregate([
    { $match: { courseId: new mongoose.Types.ObjectId(params.id) } },
    {
      $group: {
        _id: null,
        avgRating: { $avg: "$value" },
        totalRatings: { $sum: 1 },
      },
    },
  ]);

  if (!course) return notFound();

  const courseRating = ratingStats[0] || { avgRating: 0, totalRatings: 0 };
  const totalLessons = course.sections.reduce((acc, sec) => acc + sec.lessons.length, 0);

  const user = await currentUser();
  const dbUser = user ? await getUserByClerkId(user.id) : null;
  const isEnrolled = dbUser?.enrolledCourses.includes(course._id.toString());

  return (
    <div>
      <div className="bg-gray-900 text-white py-8 px-4 md:px-8">
        <div className="max-w-4xl mx-auto flex flex-col-reverse md:flex-row gap-6 relative">
          <div className="flex-1 pr-4">
            <h1 className="text-3xl font-bold mb-2">{course.title}</h1>
            <p className="text-gray-300 mb-2">{course.description}</p>
            <div className="flex items-center gap-2 mb-2">
              <Badge className="bg-purple-500 text-white">{course.category}</Badge>
              <Badge className="bg-blue-500 text-white flex items-center gap-1">
                <BadgeCheckIcon size={16} /> Premium
              </Badge>
            </div>
            <div className="text-yellow-400 mb-2">
              ★ {courseRating.avgRating.toFixed(1)} ({courseRating.totalRatings})
            </div>
            <div className="text-gray-400 mb-2">
              Created {formatDistanceToNow(new Date(course.createdAt), { addSuffix: true })}
            </div>
            <div className="text-white font-medium mb-2">By {course.authorName}</div>
          </div>

          <div className="w-full md:w-80 sticky top-4 bg-white text-black rounded shadow-md p-4 h-fit">
            <img
              src={course.thumbnailUrl}
              alt={course.title}
              className="w-full h-40 object-cover rounded mb-4"
            />


            
<div className="flex flex-col gap-3">
    <div className="text-2xl font-bold text-gray-900">
      {course.price > 0 ? `₹${course.price.toFixed(2)}` : "Free"}
    </div>

    <div className="flex gap-2">
      <AddToCartButtonn courseId={course._id.toString()} className="w-6/7" />
      <AddToWishlistButton courseId={course._id.toString()} className="w-1/7" />
    </div>

    <EnrollNowButton courseId={course._id.toString()}  />
  </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-10">
        <h2 className="text-2xl font-bold mb-4">Course Content</h2>
        <p className="text-gray-700 mb-4">
          {course.sections.length} sections • {totalLessons} lessons
        </p>

        {course.sections.length === 0 && <p>No sections added yet.</p>}

        <div className="space-y-4 border border-gray-200 dark:border-gray-600 rounded p-4">
          {course.sections.map((section, i) => (
            <details key={i} className="border rounded overflow-hidden">
              <summary className="bg-gray-100 dark:bg-gray-800 px-4 py-2 cursor-pointer font-medium">
                {section.title}
              </summary>
              <ul className="px-6 py-2 list-disc list-inside text-gray-400">
                {section.lessons.map((lesson, j) => (
                  <li key={j}>{lesson.title}</li>
                ))}
              </ul>
            </details>
          ))}
        </div>

        {isEnrolled && (
          <div className="mt-10">
            <h3 className="text-2xl font-semibold mb-2">Rate this course</h3>
            <RatingForm courseId={course._id.toString()} userId={dbUser?._id.toString()} />
          </div>
        )}

        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Student Ratings</h2>
          <Suspense fallback={<p>Loading ratings...</p>}>
            <RatingsList courseId={course._id.toString()} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}

import Link from "next/link";
import { AlertCircleIcon, BadgeCheckIcon, CheckIcon } from "lucide-react"


import { Badge } from "@/components/ui/badge"

interface CourseCardProps {
  course: {
    _id: string;
    title: string;
    thumbnailUrl: string;
    authorName: string;
    price: number;
    category: string;
    ratingStats?: {
      avgRating: number;
      totalRatings: number;
    };
  };
}


const CourseCard: React.FC<CourseCardProps> = ({ course }) => {
  return (
    <Link href={`/course/${course._id}`}>
      <div
        className="w-64 rounded-xl border shadow-sm  p-4 m-1 transition-transform duration-200 hover:scale-[1.02] hover:shadow-md cursor-pointer bg-white dark:bg-black text-gray-900 dark:text-gray-100"
      >
        <img
          src={course.thumbnailUrl}
          alt={course.title}
          className="w-full h-36 object-cover rounded-md mb-3"
        />

        <div className="flex justify-between items-center mb-2">
          <h3 className="font-extrabold text-xl line-clamp-1">{course.title}</h3>
          
        </div>

        <p className="text-sm text-gray-600 line-clamp-3">
          {course.authorName || "Unknown Author"} 
          
        </p>

        <div className="mt-3 flex items-center justify-between text-sm">
          <span className="font-bold text-black dark:text-white">₹{course.price}</span>
          <p className="text-sm text-yellow-600">
  ⭐ {course.ratingStats?.avgRating?.toFixed(1) || "N/A"} ({course.ratingStats?.totalRatings || 0})
</p>

        </div>
        <div className="flex items-center mt-2 space-x-2">
        <Badge
          variant="secondary"
          className="bg-purple-500 text-white dark:bg-blue-600 mr-2"
        >
          
          {course.category}
        </Badge>
        
        <Badge
          variant="secondary"
          className="bg-blue-500 text-white dark:bg-purple-600"
        >
          <BadgeCheckIcon />
          Premium
        </Badge>

        </div>
        
        
        
      </div>
    </Link>
  );
};

export default CourseCard;
export type { CourseCardProps };
//hii
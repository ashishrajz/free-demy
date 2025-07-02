"use client";

import { useEffect, useState } from "react";
import YoutubePlayer from "@/components/YoutubePlayer";
import { extractYouTubeVideoId } from "@/lib/utils";
import { FaPlay } from "react-icons/fa";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { axiosInstance } from "@/lib/axios";
import { Skeleton } from "./ui/skeleton";

interface LessonType {
  _id: string;
  title: string;
  videoUrl: string;
}

interface SectionType {
  title: string;
  lessons: LessonType[];
}

interface CourseType {
  _id: string;
  title: string;
  sections: SectionType[];
}

export default function WatchClient({ user, course }: { user: any; course: CourseType }) {
  const [currentLesson, setCurrentLesson] = useState<LessonType>(course.sections?.[0]?.lessons?.[0]);
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);
  const [isLessonsLoading, setIsLessonsLoading] = useState(true);


  const currentVideoId = extractYouTubeVideoId(currentLesson?.videoUrl);
  const totalLessons = course.sections.reduce((acc, section) => acc + section.lessons.length, 0);
  const progress = Math.round((completedLessons.length / totalLessons) * 100);

  // Fetch completed lessons on mount
  useEffect(() => {
    if (!user || !course._id) return;
  
    const fetchProgress = async () => {
      try {
        const res = await axiosInstance.get(`/api/progress/${course._id}`);
        setCompletedLessons(res.data.completedLessons.map((id: any) => id.toString()));
      } catch (err) {
        console.error("Failed to fetch progress", err);
      } finally {
        setIsLessonsLoading(false); // ✅ Set loading to false
      }
    };
  
    fetchProgress();
  }, [user, course._id]);
  

  const markLessonComplete = async (lessonId: string) => {
    try {
      await axiosInstance.post("/api/progress/mark-complete", {
        courseId: course._id,
        lessonId: currentLesson._id,
      });

      setCompletedLessons((prev) => [...new Set([...prev, lessonId])]);
    } catch (err) {
      console.error("Failed to mark lesson complete", err);
    }
  };

  const handleManualComplete = () => {
    if (!currentLesson?._id || completedLessons.includes(currentLesson._id)) return;
    markLessonComplete(currentLesson._id);
  };

  const handleVideoEnd = () => {
    if (currentLesson?._id && !completedLessons.includes(currentLesson._id)) {
      markLessonComplete(currentLesson._id);
    }

    // Autoplay next lesson
    const { nextLesson } = findNextLesson(course, currentLesson._id);
    if (nextLesson) setCurrentLesson(nextLesson);
  };

  const findNextLesson = (course: CourseType, currentLessonId: string) => {
    for (let i = 0; i < course.sections.length; i++) {
      const lessons = course.sections[i].lessons;
      const index = lessons.findIndex((l) => l._id === currentLessonId);
      if (index !== -1) {
        if (index + 1 < lessons.length) {
          return { nextLesson: lessons[index + 1] };
        } else if (i + 1 < course.sections.length && course.sections[i + 1].lessons.length > 0) {
          return { nextLesson: course.sections[i + 1].lessons[0] };
        }
      }
    }
    return { nextLesson: null };
  };

  return (
    <div className="flex flex-col-reverse md:flex-row w-full">
      {/* Sidebar */}
      <aside className="w-full md:w-1/3 lg:w-1/4 h-full overflow-y-auto border-r">
      <div className="p-4 border-b">
  <h2 className="text-lg font-bold mb-2">Course Content</h2>
  {isLessonsLoading ? (
    <>
      <Skeleton className="h-2 w-full rounded" />
      <Skeleton className="h-4 w-24 mt-2" />
    </>
  ) : (
    <>
      <Progress value={progress} className="h-2" />
      <p className="text-sm text-gray-600 mt-1">{progress}% completed</p>
    </>
  )}
</div>


        {course.sections.map((section, sectionIndex) => (
          <div key={sectionIndex} className="p-4 border-b">
            <h3 className="font-semibold mb-2">{section.title}</h3>
            <ul>
              {section.lessons.map((lesson) => {
                const isActive = lesson._id === currentLesson?._id;
                const isCompleted = completedLessons.includes(lesson._id);

                return (
                  <li
                    key={lesson._id}
                    onClick={() => setCurrentLesson(lesson)}
                    className={`flex items-center gap-2 text-sm py-1 cursor-pointer hover:text-black dark:hover:text-gray-300 ${
                      isActive ? "text-purple-600 font-semibold" : "text-gray-700 dark:text-gray-100"
                    }`}
                  >
                    <Checkbox checked={isCompleted} disabled className="w-4 h-4" />
                    {isActive && <FaPlay className="text-xs" />}
                    {lesson.title}
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </aside>

      {/* Main Video Area */}
      <main className="flex-1 p-4">
      {isLessonsLoading ? (
  <div className="space-y-4">
    <Skeleton className="h-8 w-3/4" />
    <Skeleton className="aspect-video w-full rounded" />
    <div className="flex justify-between mt-4">
      <Skeleton className="h-6 w-1/2" />
      <Skeleton className="h-10 w-32" />
    </div>
  </div>
) : (
  <>
    <h1 className="text-2xl font-bold mb-4">{course.title}</h1>
    {currentVideoId ? (
      <YoutubePlayer videoId={currentVideoId} onEnd={handleVideoEnd} />
    ) : (
      <p>No valid YouTube video for this lesson.</p>
    )}

    <div className="mt-4 flex items-center justify-between">
      <h2 className="text-lg font-semibold">{currentLesson?.title}</h2>
      <button
        onClick={handleManualComplete}
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
        disabled={completedLessons.includes(currentLesson._id)}
      >
        {completedLessons.includes(currentLesson._id)
          ? "Completed"
          : "Mark as Complete"}
      </button>
    </div>
  </>
)}


      </main>
    </div>
  );
}
//
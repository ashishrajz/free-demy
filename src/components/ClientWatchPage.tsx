"use client";

import { useState } from "react";
import { CourseType } from "@/types"; // define type in /types.ts

type Props = { course: CourseType };

export default function ClientWatchPage({ course }: Props) {
  const [activeSectionIndex, setActiveSectionIndex] = useState(0);
  const [activeLessonIndex, setActiveLessonIndex] = useState(0);

  const section = course.sections[activeSectionIndex];
  const lesson = section.lessons[activeLessonIndex];

  return (
    <div className="flex h-screen">
      <aside className="w-64 bg-gray-100 p-4 overflow-y-auto">
        <h2 className="font-semibold mb-4">{course.title}</h2>
        {course.sections.map((sec, si) => (
          <div key={si} className="mb-3">
            <div className="font-medium">{sec.title}</div>
            <ul className="mt-1">
              {sec.lessons.map((les, li) => (
                <li
                  key={li}
                  className={`py-1 pl-2 cursor-pointer rounded transition ${
                    si === activeSectionIndex && li === activeLessonIndex
                      ? "bg-blue-200 font-semibold"
                      : "hover:bg-gray-200"
                  }`}
                  onClick={() => {
                    setActiveSectionIndex(si);
                    setActiveLessonIndex(li);
                  }}
                >
                  {les.title}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </aside>

      <main className="flex-1 p-8 overflow-y-auto">
        <div className="prose max-w-none mb-4">
          <h1>{section.title}: {lesson.title}</h1>
        </div>
        <iframe
          className="w-full h-[600px] bg-black"
          src={`https://www.youtube.com/embed/${new URL(lesson.videoUrl).searchParams.get("v")}`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        />
      </main>
    </div>
  );
}

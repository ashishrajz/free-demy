"use client";

import { useRef, useState, useEffect } from "react";
import CourseCard from "@/components/CourseCard";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function CourseSlider({ courses }: { courses: any[] }) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    const container = scrollContainerRef.current;
    if (!container) return;
    const { scrollLeft, scrollWidth, clientWidth } = container;
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 1);
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;
    checkScroll();
    container.addEventListener("scroll", checkScroll);
    window.addEventListener("resize", checkScroll);
    return () => {
      container.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, []);

  const scroll = (direction: "left" | "right") => {
    const container = scrollContainerRef.current;
    if (!container) return;
    const scrollAmount = container.clientWidth * 0.8; // adjust scroll distance
    container.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  return (
    <div className="relative w-full ">
      {/* Left Arrow */}
      <Button
        variant="ghost"
        className="absolute left-0 md:left-6 top-1/2 transform -translate-y-1/2 bg-white text-black w-12 h-12 flex items-center justify-center rounded-full shadow-md hover:bg-purple-200 transition z-20"
        onClick={() => scroll("left")}
        disabled={!canScrollLeft}
      >
        <ChevronLeft size={32} />
      </Button>

      {/* Scroll Container */}
      <div
        ref={scrollContainerRef}
        className="overflow-x-auto hide-scrollbar flex gap-4 mx-auto "
        style={{ scrollBehavior: "smooth", overflowY: "hidden",maxWidth: '84rem' }}
      >
        {courses.map((course) => (
          <CourseCard key={course._id.toString()} course={course} />
        ))}
      </div>

      {/* Right Arrow */}
      <Button
        variant="ghost"
        className="absolute right-0 md:right-6 top-1/2 transform -translate-y-1/2 bg-white text-black w-12 h-12 flex items-center justify-center rounded-full shadow-md hover:bg-purple-200 transition"
        onClick={() => scroll("right")}
        disabled={!canScrollRight}
      >
        <ChevronRight className="w-8 h-8" />
      </Button>
    </div>
  );
}


//
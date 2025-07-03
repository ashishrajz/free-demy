"use client";

import {
  Sheet,
  SheetContent,
} from "@/components/ui/sheet";
import { Menu, X, Search, ShoppingCart } from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { axiosInstance } from "@/lib/axios";
import { DialogTitle } from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { useUser, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import ModeToggle from "./ModeToggle";

interface Course {
  _id: string;
  title: string;
  category: string;
}

export default function MobileNavbar() {
  const [open, setOpen] = useState(false);
  const [showCourses, setShowCourses] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);
  const [courses, setCourses] = useState<Record<string, Course[]>>({});
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const { user } = useUser();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await axiosInstance.get("/api/course");
        const courseList: Course[] = res.data;

        const categoryMap: Record<string, Course[]> = {};
        for (const course of courseList) {
          if (!categoryMap[course.category]) {
            categoryMap[course.category] = [];
          }
          categoryMap[course.category].push(course);
        }

        setCategories(Object.keys(categoryMap));
        setCourses(categoryMap);
      } catch (err) {
        console.error("Error fetching courses:", err);
      }
    };

    fetchCourses();
  }, []);

  const handleCategoryClick = (category: string) => {
    setActiveCategory(category);
    setShowCourses(true);
  };

  const handleBack = () => {
    setShowCourses(false);
    setActiveCategory(null);
  };

  return (
    <>
      {/* Top Navbar */}
      <div className="flex items-center justify-between py-3 lg:hidden w-full">
        {/* Hamburger */}
        <Button variant="ghost" onClick={() => setOpen(true)}>
          <Menu className="w-10 h-10" />
        </Button>

        {/* Logo */}
        <Link href="/" className="flex justify-center flex-1">
          <Image
            src="/freedemylogoblack.png"
            alt="Freedemy"
            width={110}
            height={40}
            className="dark:hidden"
          />
          <Image
            src="/freedemylogowhite.png"
            alt="Freedemy"
            width={110}
            height={40}
            className="hidden dark:block"
          />
        </Link>

        {/* Right Icons */}
        <div className="flex items-center gap-2">
          <Link href="/search-page">
            <Button variant="ghost" size="icon">
              <Search className="w-10 h-10" />
            </Button>
          </Link>
          <Link href="/cart">
            <Button variant="ghost" size="icon">
              <ShoppingCart className="w-10 h-10" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Close Button */}
      {open && (
        <button
          onClick={() => {
            setOpen(false);
            setShowCourses(false);
            setActiveCategory(null);
          }}
          className="fixed top-4 left-[300px] z-[9999] bg-white dark:bg-neutral-900 text-black dark:text-white p-2 rounded-full border border-gray-300 dark:border-gray-700 shadow-lg"
        >
          <X className="w-6 h-6" />
        </button>
      )}

      {/* Sheet Drawer */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left" className="w-[280px] px-5 pt-10 overflow-y-auto">
          <VisuallyHidden>
            <DialogTitle>Navigation Menu</DialogTitle>
          </VisuallyHidden>

          {!showCourses ? (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold mb-4">Menu</h2>

              <nav className="space-y-3 pl-2">
                <Link
                  href="/"
                  className="block py-2 px-3 rounded-md hover:bg-purple-100 dark:hover:bg-purple-900"
                >
                  Home
                </Link>
                <Link
                  href="/plans"
                  className="block py-2 px-3 rounded-md hover:bg-purple-100 dark:hover:bg-purple-900"
                >
                  Plans & Pricing
                </Link>
                <Link
                  href="/my-learning"
                  className="block py-2 px-3 rounded-md hover:bg-purple-100 dark:hover:bg-purple-900"
                >
                  My Learning
                </Link>
                <Link
                  href="/wishlist"
                  className="block py-2 px-3 rounded-md hover:bg-purple-100 dark:hover:bg-purple-900"
                >
                  Wishlist
                </Link>
                <Link
                  href="/instructors"
                  className="block py-2 px-3 rounded-md hover:bg-purple-100 dark:hover:bg-purple-900"
                >
                  Teach on Freedemy
                </Link>

                {/* Categories */}
                <div className="mt-4">
                  <h3 className="text-md font-medium mb-2">Categories</h3>
                  <ul className="space-y-2">
                    {categories.map((cat) => (
                      <li key={cat}>
                        <button
                          className="w-full text-left py-2 px-3 rounded-md hover:bg-purple-100 dark:hover:bg-purple-900"
                          onClick={() => handleCategoryClick(cat)}
                        >
                          {cat}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              </nav>

              {/* Theme + Auth Section */}
              <div className="pt-6 border-t border-gray-200 dark:border-gray-800 flex items-center justify-between">
                <ModeToggle />

                {user?.id ? (
                  <UserButton afterSignOutUrl="/" />
                ) : (
                  <div className="flex gap-2">
                    <SignInButton mode="modal">
                      <Button size="sm" variant="outline">Login</Button>
                    </SignInButton>
                    <SignUpButton mode="modal">
                      <Button size="sm" variant="default">Sign up</Button>
                    </SignUpButton>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <button
                className="text-sm text-purple-600 dark:text-purple-300 hover:underline"
                onClick={handleBack}
              >
                ← Back to categories
              </button>
              <h3 className="text-md font-medium">{activeCategory} Courses</h3>
              <ul className="space-y-2">
                {courses[activeCategory!]?.map((course) => (
                  <li key={course._id}>
                    <Link
                      href={`/course/${course._id}`}
                      className="block py-2 px-3 rounded-md hover:bg-purple-100 dark:hover:bg-purple-900"
                    >
                      {course.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </>
  );
}

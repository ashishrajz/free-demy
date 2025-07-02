import CategoryBar from '@/components/CategoryBar'
import ImageCarousel from '@/components/ImageCarousel'
import CourseSlider from "@/components/CourseSlider";
import { categories } from "@/lib/constant";
import React from 'react'
import ExtraPage from './extra/page';


const fetchCoursesByCategory = async (category: string) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/course/category/${category}`
  , {
    cache: "no-store",
  });

  if (!res.ok) {
    const text = await res.text(); // fallback for debugging
    throw new Error(`API Error: ${res.status} - ${text}`);
  }

  const data = await res.json();
  return data;
};


const page = async() => {

  const courseDataPromises = categories.map((cat) => fetchCoursesByCategory(cat));
  const courseLists = await Promise.all(courseDataPromises);
  return (
    <div>
      <CategoryBar/>
      <ImageCarousel />
      <div className="space-y-16 mx-6 " >
      {categories.map((category, index) => (
        <div key={category} >
          <h2 className="text-2xl font-bold mb-3 mt-5 mx-auto flex " style={{maxWidth:'84rem'}}>{category} Courses</h2>
          <CourseSlider courses={courseLists[index]} />
        </div>
      ))}
    </div>
    <ExtraPage />
      
      
    </div>
  )
}

export default page

//
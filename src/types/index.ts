export interface LessonType {
    _id: string; // or ObjectId if you're using mongoose types
    title: string;
    videoUrl: string;
    // other fields...
  }
  
  export interface SectionType {
    _id: string;
    title: string;
    lessons: LessonType[];
  }
  
  export interface CourseType {
    _id: string;
    title: string;
    description: string;
    price: number;
    authorName: string;
    category: string;
    thumbnailUrl: string;
    status: "draft" | "published";
    createdBy: string;
    sections: SectionType[];
  }

 export interface WatchClientProps {
    userId: string;
    course: CourseType;
  }
  
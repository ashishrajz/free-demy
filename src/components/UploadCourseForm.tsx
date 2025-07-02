"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import {
  Input,
} from "@/components/ui/input";
import {
  Textarea,
} from "@/components/ui/textarea";
import {
  Button,
} from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { auth } from "@clerk/nextjs/server";

const categories = [
  "Development", "Business", "Trading", "DSA", "Editing",
  "Design", "Marketing", "Health & Fitness", "Content Creation", "AI"
];

interface UploadCourseFormProps {
  initialCourseData?: {
    _id?: string;
    title: string;
    authorName: string;
    description: string;
    price: number;
    category: string;
    thumbnailUrl: string;
    sections: {
      title: string;
      lessons: {
        title: string;
        videoUrl: string;
      }[];
    }[];
    status: string;
  };
}

const UploadCourseForm: React.FC<UploadCourseFormProps> = ({ initialCourseData }) => {
  const [title, setTitle] = useState(initialCourseData?.title || "");
  const [authorName, setAuthorName] = useState(initialCourseData?.authorName || "");
  const [description, setDescription] = useState(initialCourseData?.description || "");
  const [price, setPrice] = useState(initialCourseData?.price || 0);
  const [category, setCategory] = useState(initialCourseData?.category || categories[0]);
  const [thumbnailUrl, setThumbnailUrl] = useState(initialCourseData?.thumbnailUrl || "");
  const [sections, setSections] = useState(
    initialCourseData?.sections?.length
      ? initialCourseData.sections
      : [{ title: "", lessons: [{ title: "", videoUrl: "" }] }]
  );
  const [status, setStatus] = useState(initialCourseData?.status || "draft");
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const router = useRouter();

  const handleSectionChange = (index: number, field: "title", value: string) => {
    const updatedSections = [...sections];
    updatedSections[index][field] = value;
    setSections(updatedSections);
  };

  const handleLessonChange = (
    sIndex: number,
    lIndex: number,
    field: "title" | "videoUrl",
    value: string
  ) => {
    const updatedSections = [...sections];
    updatedSections[sIndex].lessons[lIndex][field] = value;
    setSections(updatedSections);
  };

  const addSection = () => {
    setSections([...sections, { title: "", lessons: [{ title: "", videoUrl: "" }] }]);
  };

  const addLesson = (sectionIndex: number) => {
    const updatedSections = [...sections];
    updatedSections[sectionIndex].lessons.push({ title: "", videoUrl: "" });
    setSections(updatedSections);
  };

  const handleThumbnailChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setThumbnailFile(file);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "free-demy");

    try {
      const cloudinaryRes = await fetch("https://api.cloudinary.com/v1_1/dqmnlyoux/image/upload", {
        method: "POST",
        body: formData,
      });

      const data = await cloudinaryRes.json();

      if (!cloudinaryRes.ok) {
        console.error("Cloudinary upload error:", data);
        throw new Error(data.error?.message || "Image upload failed");
      }

      setThumbnailUrl(data.secure_url);
    } catch (err: any) {
      console.error("Upload failed:", err.message);
      toast.error("Thumbnail upload failed: " + err.message);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        title,
        authorName,
        description,
        price,
        category,
        thumbnailUrl,
        sections,
        status,
      };
  
      const isEditing = !!initialCourseData?._id;
      const url = isEditing
        ? `/api/course/${initialCourseData._id}`
        : "/api/course/upload";
  
      const method = isEditing ? "PUT" : "POST";
  
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
  
      if (!res.ok) {
        const errorText = await res.text();
        console.error("API Error:", errorText);
        throw new Error("Upload failed");
      }
  
      toast.success(isEditing ? "Course updated!" : "Course uploaded!");
      router.push("/course/upload-success");
    } catch (err: any) {
      console.error(err);
      toast.error("Something went wrong: " + err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl mx-auto p-6">
      <div className="grid gap-4">
        <Label>Course Title</Label>
        <Input
          placeholder="Course Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      <div className="grid gap-4">
        <Label>Author Name</Label>
        <Input
          placeholder="Author"
          value={authorName}
          onChange={(e) => setAuthorName(e.target.value)}
        />
      </div>
      

      <div className="grid gap-4">
        <Label>Course Description</Label>
        <Textarea
          placeholder="Course Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div className="grid gap-4">
        <Label>Price (₹)</Label>
        <Input
          type="number"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(Number(e.target.value))}
        />
      </div>

      <div className="grid gap-4">
        <Label>Thumbnail</Label>
        <Input
          type="file"
          accept="image/*"
          onChange={handleThumbnailChange}
        />
        {thumbnailUrl && (
          <img
            src={thumbnailUrl}
            alt="Thumbnail Preview"
            className="h-32 mt-2 rounded shadow-md"
          />
        )}
      </div>

      <div className="grid gap-4">
        <Label>Category</Label>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger>
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-6">
        <Label className="text-lg">Sections</Label>
        {sections.map((section, sIndex) => (
          <Card key={sIndex} className="p-4 space-y-4">
            <Input
              placeholder="Section Title"
              value={section.title}
              onChange={(e) => handleSectionChange(sIndex, "title", e.target.value)}
            />

            {section.lessons.map((lesson, lIndex) => (
              <div key={lIndex} className="pl-4 space-y-2">
                <Input
                  placeholder="Lesson Title"
                  value={lesson.title}
                  onChange={(e) => handleLessonChange(sIndex, lIndex, "title", e.target.value)}
                />
                <Input
                  placeholder="Video URL (YouTube Unlisted)"
                  value={lesson.videoUrl}
                  onChange={(e) => handleLessonChange(sIndex, lIndex, "videoUrl", e.target.value)}
                />
              </div>
            ))}

            <Button
              type="button"
              variant="outline"
              onClick={() => addLesson(sIndex)}
              className="mt-2"
            >
              + Add Lesson
            </Button>
          </Card>
        ))}

        <Button
          type="button"
          variant="secondary"
          onClick={addSection}
          className="w-fit"
        >
          + Add Section
        </Button>
      </div>

      <div className="grid gap-4">
        <Label>Status</Label>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger>
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="published">Published</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button type="submit" className="w-full">
        {initialCourseData?._id ? "Update Course" : "Upload Course"}
      </Button>
    </form>
  );
};

export default UploadCourseForm;

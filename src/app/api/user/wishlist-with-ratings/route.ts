import { connectDB } from "@/lib/db";
import User from "@/lib/models/user.model";
import Rating from "@/lib/models/rating.model";
import { currentUser } from "@clerk/nextjs/server";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDB();
    const user = await currentUser();
    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const dbUser = await User.findOne({ clerkId: user.id }).populate("wishlist");

    if (!dbUser) {
      return new NextResponse("User not found", { status: 404 });
    }

    const wishlistCourses = dbUser.wishlist || [];

    const coursesWithRatings = await Promise.all(
      wishlistCourses.map(async (course: any) => {
        const ratingStats = await Rating.aggregate([
          { $match: { courseId: new mongoose.Types.ObjectId(course._id) } },
          {
            $group: {
              _id: null,
              avgRating: { $avg: "$value" },
              totalRatings: { $sum: 1 },
            },
          },
        ]);

        const ratingInfo = ratingStats[0] || { avgRating: 0, totalRatings: 0 };

        return {
          _id: course._id.toString(),
          title: course.title,
          thumbnailUrl: course.thumbnailUrl,
          authorName: course.authorName,
          category: course.category,
          price: course.price,
          avgRating: ratingInfo.avgRating,
          totalRatings: ratingInfo.totalRatings,
        };
      })
    );

    return NextResponse.json(coursesWithRatings);
  } catch (err) {
    console.error("[WISHLIST_WITH_RATINGS_ERROR]", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

// src/app/api/wishlist/add/route.ts
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

import { addToWishlist } from "@/actions/wishlist.actions";
import { getDbUserId } from "@/actions/user.actions";



export async function POST(req: NextRequest) {
  const { userId } = await auth();
  const { courseId } = await req.json();
  if (!userId) return new NextResponse("Unauthorized", { status: 401 });
  const dbUserId = await getDbUserId(userId);
  const wishlist = await addToWishlist(dbUserId, courseId);
  return NextResponse.json(wishlist);
}
// src/app/api/user/get/route.ts
import { NextResponse } from "next/server";
import { getUserByClerkId } from "@/actions/user.actions";
import { auth} from "@clerk/nextjs/server";

export async function GET() {
  const {userId} = await auth();
  if (!userId) return new NextResponse("Unauthorized", { status: 401 });

  const user = await getUserByClerkId(userId);
  return NextResponse.json(user);
}
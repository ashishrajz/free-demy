// src/app/api/user/sync/route.ts
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { syncUser } from "@/actions/user.actions";

export async function POST() {
  const { userId } = await auth();
  if (!userId) return new NextResponse("Unauthorized", { status: 401 });
  const syncedUser = await syncUser(userId);
  return NextResponse.json(syncedUser);
}
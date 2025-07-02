// src/app/api/enrollment/from-cart/route.ts
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getDbUserId } from "@/actions/user.actions";
import { enrollFromCart } from "@/actions/cart.actions";

export async function POST() {
  const { userId } = await auth();
  if (!userId) return new NextResponse("Unauthorized", { status: 401 });
  const dbUserId = await getDbUserId(userId);
  const result = await enrollFromCart(dbUserId);
  return NextResponse.json(result);
}

// app/api/stripe/checkout/route.ts
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { connectDB } from "@/lib/db";
import Course from "@/lib/models/course.model";
import { getUserByClerkId } from "@/actions/user.actions";
import { stripe } from "@/lib/stripe";

const YOUR_DOMAIN = process.env.NEXT_PUBLIC_BASE_URL!;

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) return new NextResponse("Unauthorized", { status: 401 });

  const { courseId } = await req.json();

  await connectDB();
  const user = await getUserByClerkId(userId);
  const course = await Course.findById(courseId);
  if (!course) return new NextResponse("Course not found", { status: 404 });

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",
    customer_email: user.email,
    line_items: [
      {
        price_data: {
          currency: "inr",
          product_data: {
            name: course.title,
            description: course.description,
          },
          unit_amount: course.price * 100,
        },
        quantity: 1,
      },
    ],
    metadata: {
      userId: user._id.toString(), // DB _id, not Clerk id
      courseIds: JSON.stringify([course._id.toString()]),
    },
    success_url: `${YOUR_DOMAIN}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${YOUR_DOMAIN}/course/${course._id}`,
  });

  return NextResponse.json({ checkoutUrl: session.url });
}

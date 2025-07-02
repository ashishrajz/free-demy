// /app/api/checkout/route.ts
import { stripe } from "@/lib/stripe"; // ✅ use shared Stripe instance
import { currentUser } from "@clerk/nextjs/server";
import { connectDB } from "@/lib/db";
import User from "@/lib/models/user.model";
import Course from "@/lib/models/course.model";

export async function POST(req: Request) {
  await connectDB();
  const user = await currentUser();
    if (!user) {
        return Response.json({ error: "Unauthorized" }, { status: 401 });
    }
  const { courses } = await req.json();

  const courseDocs = await Course.find({ _id: { $in: courses } });

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",
    line_items: courseDocs.map((course) => ({
      price_data: {
        currency: "inr",
        product_data: {
          name: course.title,
        },
        unit_amount: course.price * 100,
      },
      quantity: 1,
    })),
    success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/cart`,
    metadata: {
      userId: user.id,
      courseIds: JSON.stringify(courses),
    },
  });

  return Response.json({ sessionId: session.id });
}

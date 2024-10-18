import { NextResponse } from "next/server";
import mongoose from "mongoose";
import Order from "@/models/Order";

// If you don't include request as the first argument, Next.js will not pass the params object correctly to the function, which is why we need it to access the params properly.
export async function GET(request, { params }) {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const { orderId } = params;

    const order = await Order.findById(orderId).lean();

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error("Error fetching order:", error);

    return NextResponse.json(
      { error: "Error fetching order" },
      { status: 500 }
    );
  }
}

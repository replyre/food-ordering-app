import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import Order from "@/models/Order";
import mongoose from "mongoose";

export async function POST(req) {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const { cartProducts, address, totalAmount } = await req.json();

    const session = await getServerSession(authOptions);
    const userEmail = session?.user?.email;

    if (!userEmail) {
      return new Response("Unauthorized", { status: 401 });
    }

    if (!cartProducts || !cartProducts.length) {
      return new Response("No products in cart", { status: 400 });
    }

    const { phone, streetAddress, city, postalCode, country } = address;
    if (!phone || !streetAddress || !city || !postalCode || !country) {
      return new Response("Missing address fields", { status: 400 });
    }

    const orderDoc = await Order.create({
      userEmail,
      address,
      cartProducts: cartProducts.map((product) => {
        const basePrice = product.basePrice || 0;

        const extrasTotal = product.extras
          ? product.extras.reduce(
              (extraTotal, extra) => extraTotal + (extra.price || 0),
              0
            )
          : 0;

        const sizePrice = product.size?.price || 0;

        const productPrice = basePrice + sizePrice + extrasTotal;

        return {
          productName: product?.name,
          productImage: product?.image,
          basePrice: basePrice,
          size: {
            name: product.size?.name || "Regular",
            price: sizePrice,
          },
          extras: product.extras || [],
          productPrice,
        };
      }),
      totalAmount,
      status: "Paid",
    });

    return new Response(JSON.stringify({ orderId: orderDoc._id }), {
      status: 200,
    });
  } catch (error) {
    return new Response("Error saving order", { status: 500 });
  }
}

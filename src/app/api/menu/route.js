import { MenuItem } from "@/models/MenuItem";
import mongoose from "mongoose";

export const dynamic = "force-dynamic"; // Force dynamic fetching for this route

async function connectToDatabase() {
  if (mongoose.connection.readyState !== 1) {
    await mongoose.connect(process.env.MONGO_URI);
  }
}

export async function GET() {
  await connectToDatabase();

  try {
    const menuItems = await MenuItem.find().populate("category");
    console.log("Fetched menu items:", menuItems);

    return new Response(JSON.stringify(menuItems), {
      status: 200,
      headers: {
        "Cache-Control":
          "no-store, no-cache, must-revalidate, proxy-revalidate", // No caching
        Expires: "0",
        Pragma: "no-cache",
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({ message: error.message }), {
      status: 500,
      headers: {
        "Cache-Control":
          "no-store, no-cache, must-revalidate, proxy-revalidate",
      },
    });
  }
}

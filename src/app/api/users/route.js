import { User } from "@/models/User";
import mongoose from "mongoose";

export const dynamic = "force-dynamic"; // Ensure dynamic rendering

export async function GET() {
  try {
    if (mongoose.connection.readyState !== 1) {
      // Connect to the database only if not connected
      await mongoose.connect(process.env.MONGO_URI);
    }

    const users = await User.find();

    return new Response(JSON.stringify(users), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Error fetching users:", error);

    return new Response(JSON.stringify({ error: "Failed to fetch users" }), {
      headers: { "Content-Type": "application/json" },
      status: 500,
    });
  }
}

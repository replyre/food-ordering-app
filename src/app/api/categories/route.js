import { isAdmin } from "@/app/api/auth/[...nextauth]/route";
import { Category } from "@/models/Category";
import mongoose from "mongoose";

async function connectToDatabase() {
  if (mongoose.connection.readyState !== 1) {
    await mongoose.connect(process.env.MONGO_URI);
  }
}

export async function POST(req) {
  try {
    await connectToDatabase();
    const { name } = await req.json();

    if (await isAdmin()) {
      const categoryDoc = await Category.create({ name });
      return new Response(JSON.stringify(categoryDoc), { status: 201 });
    } else {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 403,
      });
    }
  } catch (error) {
    console.error("Error in POST:", error);
    return new Response(
      JSON.stringify({ error: "Failed to create category" }),
      { status: 500 }
    );
  }
}

export async function PUT(req) {
  try {
    await connectToDatabase();
    const { _id, name } = await req.json();

    if (await isAdmin()) {
      const result = await Category.updateOne({ _id }, { name });
      if (result.modifiedCount > 0) {
        return new Response(JSON.stringify({ success: true }), { status: 200 });
      } else {
        return new Response(JSON.stringify({ error: "No category found" }), {
          status: 404,
        });
      }
    } else {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 403,
      });
    }
  } catch (error) {
    console.error("Error in PUT:", error);
    return new Response(
      JSON.stringify({ error: "Failed to update category" }),
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    await connectToDatabase();
    const categories = await Category.find();
    return new Response(JSON.stringify(categories), { status: 200 });
  } catch (error) {
    console.error("Error in GET:", error);
    return new Response(
      JSON.stringify({ error: "Failed to fetch categories" }),
      { status: 500 }
    );
  }
}

export async function DELETE(req) {
  try {
    await connectToDatabase();
    const url = new URL(req.url);
    const _id = url.searchParams.get("_id");

    if (await isAdmin()) {
      const result = await Category.deleteOne({ _id });
      if (result.deletedCount > 0) {
        return new Response(JSON.stringify({ success: true }), { status: 200 });
      } else {
        return new Response(JSON.stringify({ error: "No category found" }), {
          status: 404,
        });
      }
    } else {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 403,
      });
    }
  } catch (error) {
    console.error("Error in DELETE:", error);
    return new Response(
      JSON.stringify({ error: "Failed to delete category" }),
      { status: 500 }
    );
  }
}

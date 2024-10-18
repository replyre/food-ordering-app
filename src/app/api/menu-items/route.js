import { isAdmin } from "@/app/api/auth/[...nextauth]/route";
import { MenuItem } from "@/models/MenuItem";
import mongoose from "mongoose";

async function connectToDatabase() {
  if (mongoose.connection.readyState !== 1) {
    await mongoose.connect(process.env.MONGO_URI);
  }
}

export async function POST(req) {
  await connectToDatabase();
  const data = await req.json();

  if (await isAdmin()) {
    const userId = data.createdBy;
    if (!userId) {
      return new Response(JSON.stringify({ message: "Admin ID is required" }), {
        status: 400,
      });
    }

    data.createdBy = userId;
    try {
      const menuItemDoc = await MenuItem.create(data);
      return new Response(JSON.stringify(menuItemDoc), { status: 201 });
    } catch (error) {
      return new Response(JSON.stringify({ message: error.message }), {
        status: 500,
      });
    }
  } else {
    return new Response(JSON.stringify({ message: "Not authorized" }), {
      status: 403,
    });
  }
}

export async function PUT(req) {
  await connectToDatabase();
  const { _id, ...data } = await req.json();

  if (await isAdmin()) {
    const userId = data?.createdBy;
    if (!userId) {
      return new Response(JSON.stringify({ message: "Admin ID is required" }), {
        status: 400,
      });
    }

    const menuItem = await MenuItem.findById(_id);
    if (menuItem && menuItem.createdBy.toString() === userId) {
      try {
        await MenuItem.findByIdAndUpdate(_id, data, { new: true });
        return new Response(
          JSON.stringify({ message: "Updated successfully" }),
          { status: 200 }
        );
      } catch (error) {
        return new Response(JSON.stringify({ message: error.message }), {
          status: 500,
        });
      }
    } else {
      return new Response(JSON.stringify({ message: "Not authorized" }), {
        status: 403,
      });
    }
  } else {
    return new Response(JSON.stringify({ message: "Not authorized" }), {
      status: 403,
    });
  }
}

export async function GET(req) {
  await connectToDatabase();
  const url = new URL(req.url);

  const adminId = url.searchParams.get("adminId");

  if (await isAdmin()) {
    try {
    
      const query = adminId ? { createdBy: adminId } : {};
      const menuItems = await MenuItem.find(query);
      return new Response(JSON.stringify(menuItems), { status: 200 });
    } catch (error) {
      return new Response(JSON.stringify({ message: error.message }), {
        status: 500,
      });
    }
  } else {
    return new Response(JSON.stringify({ message: "Not authorized" }), {
      status: 403,
    });
  }
}

export async function DELETE(req) {
  await connectToDatabase();
  const url = new URL(req.url);
  const _id = url.searchParams.get("id");

  const { adminId } = await req.json();

  if (await isAdmin()) {
    if (!adminId) {
      return new Response(JSON.stringify({ message: "Admin ID is required" }), {
        status: 400,
      });
    }

    try {
      const menuItem = await MenuItem.findById(_id);
      if (menuItem && menuItem.createdBy.toString() === adminId) {
        await MenuItem.deleteOne({ _id });
        return new Response(
          JSON.stringify({ message: "Deleted successfully" }),
          { status: 200 }
        );
      } else {
        return new Response(JSON.stringify({ message: "Not authorized" }), {
          status: 403,
        });
      }
    } catch (error) {
      return new Response(JSON.stringify({ message: error.message }), {
        status: 500,
      });
    }
  } else {
    return new Response(JSON.stringify({ message: "Not authorized" }), {
      status: 403,
    });
  }
}

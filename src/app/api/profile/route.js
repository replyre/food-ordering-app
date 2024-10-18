import mongoose from "mongoose";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { User } from "@/models/User";
import { UserInfo } from "@/models/UserInfo";

export async function PUT(req) {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const data = await req.json();
    const { _id, name, image, admin, ...otherUserInfo } = data;

    let filter = {};

    if (_id) {
      filter = { _id };
    } else {
      const session = await getServerSession(authOptions);
      const email = session.user.email;
      filter = { email };
    }

    await User.updateOne(filter, { name, image });

    await UserInfo.findOneAndUpdate(
      { email: filter.email },
      { ...otherUserInfo, admin },
      { upsert: true, new: true }
    );

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    console.error("Error updating profile:", error);
    return new Response(JSON.stringify({ error: "Failed to update profile" }), {
      status: 500,
    });
  }
}

export async function GET(req) {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const url = new URL(req.url);
    const _id = url.searchParams.get("_id");

    let filterUser = {};

    if (_id) {
      filterUser = { _id };
    } else {
      const session = await getServerSession(authOptions);
      const email = session?.user?.email;

      if (!email) {
        return new Response(JSON.stringify({}), { status: 404 });
      }

      filterUser = { email };
    }

    const user = await User.findOne(filterUser).lean();
    const userInfo = await UserInfo.findOne({ email: user.email }).lean();

    return new Response(JSON.stringify({ ...user, ...userInfo }), {
      status: 200,
    });
  } catch (error) {
    console.error("Error fetching profile:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch profile" }), {
      status: 500,
    });
  }
}

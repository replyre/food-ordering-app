import clientPromise from "@/libs/mongoConnect";
import { UserInfo } from "@/models/UserInfo";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import NextAuth, { getServerSession } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import mongoose from "mongoose";

async function ensureMongoDBConnection() {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.MONGO_URI);
  }
}

export const authOptions = {
  secret: process.env.SECRET,
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  pages: {
    signIn: "/login",
  },
  session: {
    jwt: true,
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        try {
          token.id = user.id;
          token.email = user.email;

          await ensureMongoDBConnection();

          const userInfo = await UserInfo.findOne({ email: user.email });
          token.isAdmin = userInfo?.admin || false;
        } catch (error) {
          console.error("Error in JWT callback:", error);
        }
      }
      return token;
    },
    async session({ session, token }) {
      try {
        if (token) {
          session.user.id = token.id;
          session.user.email = token.email;
          session.user.isAdmin = token.isAdmin;
        }
      } catch (error) {
        console.error("Error in session callback:", error);
      }
      return session;
    },
    async signIn({ user }) {
      try {
        await ensureMongoDBConnection();

        await UserInfo.findOneAndUpdate(
          { email: user.email },
          { email: user.email },
          { upsert: true, new: true, setDefaultsOnInsert: true }
        );

        return true;
      } catch (error) {
        console.error("Error in signIn callback:", error);
        return false;
      }
    },
  },
  debug: process.env.NODE_ENV === "development",
};

export async function isAdmin() {
  try {
    const session = await getServerSession(authOptions);
    const userEmail = session?.user?.email;
    if (!userEmail) {
      return false;
    }

    await ensureMongoDBConnection();

    const userInfo = await UserInfo.findOne({ email: userEmail });
    return userInfo?.admin || false;
  } catch (error) {
    console.error("Error checking admin status:", error);
    return false;
  }
}

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };

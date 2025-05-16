// src/app/api/auth/[...nextauth]/route.js

import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import dbConnect from "../../../../../frontend/app/utils/dbConnect";
import User from "../../../../models/User";
import bcrypt from "bcrypt";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email:    { label: "Email",    type: "email",    placeholder: "you@example.com" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          throw new Error("Email and password are required");
        }

        await dbConnect();

        const normalizedEmail = credentials.email.toLowerCase().trim();
        const user = await User.findOne({ email: normalizedEmail });
        if (!user || !user.password) {
          throw new Error("Invalid email or password");
        }

        const isMatch = await bcrypt.compare(credentials.password, user.password);
        if (!isMatch) {
          throw new Error("Invalid email or password");
        }

        // Return the minimal user object for the JWT
        return {
          id:    user._id.toString(),
          name:  user.name,
          email: user.email,
          role:  user.role || "student"
        };
      }
    })
  ],

  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: "jwt" },

  callbacks: {
    // After a successful sign-in, update lastActive & status
    async signIn({ user, account, profile }) {
      try {
        await dbConnect();
        // mark the user online and update timestamp
        await User.findByIdAndUpdate(user.id, {
          status:     "online",
          lastActive: new Date()
        });
      } catch (err) {
        console.error("Error updating lastActive on signIn:", err);
      }
      return true;
    },

    // Populate the JWT with our user fields
    async jwt({ token, user }) {
      if (user) {
        token.id    = user.id;
        token.name  = user.name;
        token.email = user.email;
        token.role  = user.role;
      }
      return token;
    },

    // Expose those fields in the session object
    async session({ session, token }) {
      session.user = {
        id:    token.id,
        name:  token.name,
        email: token.email,
        role:  token.role
      };
      return session;
    }
  },

  pages: {
    signIn: "/login"
  }
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };

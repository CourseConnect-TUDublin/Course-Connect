import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import dbConnect from "../../../../lib/dbConnect";
import User from "../../../../models/User";
import bcrypt from "bcrypt";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "you@example.com" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        try {
          await dbConnect();
          const user = await User.findOne({ email: credentials.email.toLowerCase() });
          if (!user) throw new Error("Invalid email or password");
          const isMatch = await bcrypt.compare(credentials.password, user.password);
          if (!isMatch) throw new Error("Invalid email or password");
          console.log("✅ User Authenticated:", user.email);
          return { id: user._id.toString(), email: user.email, role: "student" };
        } catch (error) {
          console.error("❌ Authorization Error:", error);
          throw new Error("Login failed");
        }
      }
    })
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: "jwt" },
  cookies: {
    sessionToken: {
      name: "next-auth.session-token", // force this name in dev
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production" // false in dev
      }
    }
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.role = user.role;
      }
      console.log("🟡 JWT Token:", token);
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id;
      session.user.email = token.email;
      session.user.role = token.role;
      console.log("🟢 Session Data:", session);
      return session;
    }
  },
  pages: {
    signIn: "/login"
  }
});

export { handler as GET, handler as POST };
